package lk.jithma_edu.controller;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.jithma_edu.dao.EnrollmentDao;
import lk.jithma_edu.dao.EnrollmentStatusDao;
import lk.jithma_edu.dao.TeacherPaymentDao;
import lk.jithma_edu.dao.UserDao;
import lk.jithma_edu.entity.Enrollment;
import lk.jithma_edu.entity.EnrollmentStatus;
import lk.jithma_edu.entity.Privilege;
import lk.jithma_edu.entity.TeacherPayment;
import lk.jithma_edu.entity.User;

@RestController // me class eka REST controller ekak, data send / receive karanna use wenawa
// meka nathuuwa mapping wada krn na must need
public class TeacherPayamentController {

    @Autowired
    // @Autowired → Spring dependency injection.
    // Spring container eka TeacherPaymentDao instance ekak create karala me
    // variable
    // ekata inject karanawa.
    private TeacherPaymentDao teacherPaymentDao;

    @Autowired // get authentication instance
    private AuthController authController;

    @Autowired // get enrollment instance
    private EnrollmentDao enrollmentDao;

    @Autowired // get enrollmentstatus instance
    private EnrollmentStatusDao enrollmentStatusDao;

    // get user instance
    @Autowired
    private UserDao userDao;

    // meka /teacherpayment kiyala url ekt giyama teacherpayment page eka load
    // wenawa
    @RequestMapping("/teacherpayment")
    public ModelAndView teacherPaymentPage() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        // me code eke aim eka: login una user ge details ganna
        // me line eken SecurityContext eken currently logged-in una user info gannawa

        // username eka hraha user object eka gnnawa
        User loggedUser = userDao.getByUsername(authentication.getName());

        // aluth ModelAndView ekak hadanawa
        ModelAndView teacherPaymentUI = new ModelAndView();

        // view name eka set karanawa (teacherpayment.html file eka)
        teacherPaymentUI.setViewName("teacherpayment.html");

        // login una user ge nama ekata teacher payment pass karanawa
        teacherPaymentUI.addObject("loggedusername", authentication.getName());

        // title set
        teacherPaymentUI.addObject("title", "Jithma Institute | Teacher Payment Management");

        // photo set
        teacherPaymentUI.addObject("userphoto", loggedUser.getUserphoto());

        // e page eka return karanawa browser ekata
        return teacherPaymentUI;
    }

    @GetMapping(value = "/teacherpayment/alldata")
    public List<TeacherPayment> getAllData() {
        // Login wela thiyena user kenekda kiyala ganna
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // Me userge TEACHER PAYMENT module permission ganna
        Privilege userPrivilege = authController.getPrivilegeByUserAndModule(authentication.getName(),
                "TEACHERPAYMENT");

        // User ta PRIVI_SELECT true da kiyala check karanawa
        if (userPrivilege.getPrivi_select()) {

            // User ta select permission thiyenawa nam
            // database eken teacherpayment table eke thiyena okkoma records return karanawa
            return teacherPaymentDao.findAll();

        } else {

            // Select permission naththam empty list ekak return karanawa
            return new ArrayList<>();
        }
    }

    @PostMapping(value = "/teacherpayment/insert")
    public String saveData(@RequestBody TeacherPayment teacherpayment) {

        // @RequestBody -> frontend eken ena JSON data eka TeacherPayment object ekakata
        // map karanawa.
        // e kiyanne request body eke thiyena fields tika automa TeacherPayment class
        // eke fields walata bind wenawa.
        // me annotation eka naththam JSON data eka object ekakata convert wenne na.

        // 1. need to check logged user privilege
        // log wela inne userta me operation eka karanna permission thiyanawada balanawa
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // Me userge TEACHER PAYMENT module permission ganna
        Privilege userPrivilege = authController.getPrivilegeByUserAndModule(
                authentication.getName(),
                "TEACHERPAYMENT");

        // insert permission naththam save eka block karanawa
        if (!userPrivilege.getPrivi_insert()) {
            return "Save not completed.You don't have permission..!";
        }

        // 2. need to check data exiteacher payemnt already thiyanawada balanawa

        // same enrollment ekata teacher payment already thiyanawada balanawa
        TeacherPayment exTeacherPayment = teacherPaymentDao.getByEnrollmentWithTeacherPayment(
                teacherpayment.getEnrollment_id().getId());

        // duplicate payment thibboth message eka return karanawa
        if (exTeacherPayment != null) {
            return "Teacher payment already exists for this enrollment.";
        }

        // 3. try catch
        try {

            // 4. set auto generated tasks

            // current date-time eka set karanawa
            teacherpayment.setAddeddatetime(LocalDateTime.now());

            // login wela inna userge username eka gannawa
            String username = authentication.getName();

            // username eka use karala database eken login user object eka gannawa
            User loginUserObject = userDao.getByUsername(username);

            // teacherpayment record ekata add karapu userge ID eka set karanawa
            teacherpayment.setAddeduser(loginUserObject.getId());

            // bill no eka gnnawa
            teacherpayment.setBillno(teacherPaymentDao.getNextBillNo());

            // 5. main save operation
            teacherPaymentDao.save(teacherpayment);

            // 6.handle dependacies
            // teacher payment status eka completed nam
            // adala enrollment eka gannawa
            Enrollment enrollmentpay = enrollmentDao.getReferenceById(
                    teacherpayment.getEnrollment_id().getId());

            // enrollment status eka pending nam witharai completed karanne
            if (enrollmentpay.getEnrollmentstatus_id().getName().equals("Pending")) {

                // completed status object eka gannawa
                EnrollmentStatus completedStatus = enrollmentStatusDao.getReferenceById(2);

                // enrollment status eka completed karanawa
                enrollmentpay.setEnrollmentstatus_id(completedStatus);

                // enrollment update karanawa
                enrollmentDao.save(enrollmentpay);
            }
            // save success unoth OK return karanawa
            return "OK";

        } catch (Exception exception) {

            // mokak hari exception ekak awoth error message eka return karanawa
            return "Save not completed : "
                    + exception.getMessage();
        }
    }
}
