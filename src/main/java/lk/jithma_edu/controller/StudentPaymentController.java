package lk.jithma_edu.controller;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.jithma_edu.dao.StudentPaymentDao;
import lk.jithma_edu.dao.UserDao;
import lk.jithma_edu.entity.Privilege;
import lk.jithma_edu.entity.StudentPayment;
import lk.jithma_edu.entity.User;

@RestController // me class eka REST controller ekak, data send / receive karanna use wenawa
// meka nathuuwa mapping wada krn na must need
public class StudentPaymentController {

    @Autowired
    // @Autowired → Spring dependency injection.
    // Spring container eka StudentPaymentDao instance ekak create karala me
    // variable
    // ekata
    // inject karanawa.

    private StudentPaymentDao studentPaymentDao;

    @Autowired
    private AuthController authController;

    // get user instance
    @Autowired
    private UserDao userDao;

    // meka /studentpayment kiyala url ekt giyama studentpayment page eka load
    // wenawa
    @RequestMapping("/studentpayment")
    public ModelAndView studentPaymentPage() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        // me code eke aim eka: login una user ge details ganna
        // me line eken SecurityContext eken currently logged-in una user info gannawa

        // username eka hraha user object eka gnnawa
        User loggedUser = userDao.getByUsername(authentication.getName());

        // aluth ModelAndView ekak hadanawa
        ModelAndView studentPaymentUI = new ModelAndView();

        // view name eka set karanawa (studentpayment.html file eka)
        studentPaymentUI.setViewName("studentpayment.html");

        // login una user ge nama studentpayment ekata pass karanawa
        studentPaymentUI.addObject("loggedusername", authentication.getName());

        // title set
        studentPaymentUI.addObject("title", "Jithma Institute | Student Payment Management");

        // photo set
        studentPaymentUI.addObject("userphoto", loggedUser.getUserphoto());

        // e page eka return karanawa browser ekata
        return studentPaymentUI;

    }

    @GetMapping(value = "/studentpayment/alldata")
    public List<StudentPayment> getAllData() {
        // Login wela thiyena user kenekda kiyala ganna
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // Me userge STUDENT PAYMENT module permission ganna
        Privilege userPrivilege = authController.getPrivilegeByUserAndModule(authentication.getName(),
                "STUDENTPAYMENT");

        // User ta PRIVI_SELECT true da kiyala check karanawa
        if (userPrivilege.getPrivi_select()) {

            // User ta select permission thiyenawa nam OKKOMA studentS return karanawa
            // database eken student table eke thiyena okkoma records return karanawa
            return studentPaymentDao.findAll();

        } else {

            // Select permission naththam empty list ekak return karanawa
            return new ArrayList<>();
        }
    }

    @PostMapping(value = "/studentpayment/insert")
    public String saveData(@RequestBody StudentPayment studentpayment) {
        // @RequestBody -> frontend eken ena JSON data eka StudentPayment object ekakata
        // map karanawa
        // request body eke fields tika automatically StudentPayment class eke fields
        // walata bind wenawa

        // 1. need to check loged user privilege
        // log wela inne userta me operation eka karanna permission thiyanawada balanawa
        // save krnna
        // meka naththam unauthorized user kenek save karanna ba.
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // Me userge STUDENT PAYMENT module permission ganna
        Privilege userPrivilege = authController.getPrivilegeByUserAndModule(authentication.getName(),
                "STUDENTPAYMENT");
        if (!userPrivilege.getPrivi_insert()) {
            return "Save not completed.You don't have permission..!";
        }
        // 2.need to check data existance

        // check payment duplicates (same batch + same month)
        if (studentpayment.getStudentregistration_id() != null) {

            // =========================
            // MONTHLY PAYMENT FLOW
            // =========================

            // selected registration ekata adala same month payment ekak tiyanawada check
            // karanawa
            StudentPayment extStudentPayment = studentPaymentDao.getByRegistrationAndMonth(
                    studentpayment.getStudentregistration_id().getId(),
                    studentpayment.getPaymonth());

            // same month payment ekak already tiyanawanam save eka stop karanawa
            if (extStudentPayment != null) {

                // duplicate monthly payment for same registration & month
                return "Monthly payment already exists for this month : "
                        + studentpayment.getPaymonth();
            }

        } else {

            // =========================
            // ADMISSION PAYMENT FLOW
            // =========================

            // selected studentta kalin admission fee eka gewalada kiyala check karanawa
            StudentPayment extAdmissionPayment = studentPaymentDao.getAdmissionPayment(
                    studentpayment.getStudent_id().getId());

            // admission fee eka already gewala tiyanawanam save eka stop karanawa
            if (extAdmissionPayment != null) {

                // duplicate admission fee payment for same student
                return "This student already paid admission fee..!";
            }
        }
        // 3.try catch
        try {

            // 4.set auto generted task
            studentpayment.setAddeddatetime(LocalDateTime.now()); // current date-time set karanawa

            // login wela inna userge username eka gannawa
            String username = authentication.getName();

            // username eka use karala database eken login user object eka gannawa
            User loginUserObject = userDao.getByUsername(username);

            // studentpayment record ekata add karapu userge ID eka set karanawa
            studentpayment.setAddeduser(loginUserObject.getId());

            // next studentpayment number set karanawa
            studentpayment.setPaymentno(studentPaymentDao.getNextStudentPaymentNo());

            // 5.main save operation
            studentPaymentDao.save(studentpayment);

            // save success unoth return message
            return "OK";

        } catch (Exception exception) {
            // mokak hari exception ekak awama me message eka return karanawa
            return "Save not completed : " + exception.getMessage();
        }

    }

    // batch ekakata adala month income eka gannawa
    @GetMapping(value = "/studentpayment/incomebybatchandmonth/{batchid}/{month}", produces = "application/json")
    public BigDecimal getIncomeByBatchAndMonth(
            @PathVariable("batchid") Integer batchid,
            @PathVariable("month") String month) {

        // dao eken total income eka return karanawa
        return studentPaymentDao.getIncomeByBatchAndMonth(batchid, month);
    }

    // batch ekakata month ekata pay karapu student count eka gannawa
    @GetMapping("/studentpayment/paycountbybatchandmonth/{batchid}/{month}")
    public Integer getPaidStudentCountByBatchAndMonth(
            @PathVariable Integer batchid,
            @PathVariable String month) {

        return studentPaymentDao.getPaidStudentCountByBatchAndMonth(batchid, month);
    }

    // create GET mapping for student payment check
    @GetMapping(value = "/studentpayment/getbystudentbatchandmonth", params = { "studentid", "batchid",
            "month" }, produces = "application/json")
    public StudentPayment getStudentPayment(
            @RequestParam("studentid") Integer studentid,
            @RequestParam("batchid") Integer batchid,
            @RequestParam("month") String month) {

        // student + batch + month ekata adala payment eka return karanawa
        StudentPayment studentPayment = studentPaymentDao.getStudentPayment(studentid, batchid, month);
        if (studentPayment == null) {
            return new StudentPayment();
        } else {
            return studentPayment;
        }
    }

    // check student admission status
    @GetMapping(value = "/studentpayment/checkadmissionstatus")
    public Long checkAdmissionStatus(@RequestParam("studentId") Integer studentId) {
        return studentPaymentDao.checkStudentAdmissionStatus(studentId);
    }

}
