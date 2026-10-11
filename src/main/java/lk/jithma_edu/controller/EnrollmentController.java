package lk.jithma_edu.controller;

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
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.jithma_edu.dao.EnrollmentDao;
import lk.jithma_edu.dao.UserDao;
import lk.jithma_edu.entity.Enrollment;
import lk.jithma_edu.entity.EnrollmentHasBatch;
import lk.jithma_edu.entity.Privilege;
import lk.jithma_edu.entity.User;

@RestController // me class eka REST controller ekak, data send / receive karanna use wenawa
// meka nathuuwa mapping wada krn na must need
public class EnrollmentController {

    @Autowired
    // @Autowired → Spring dependency injection.
    // Spring container eka EnrollmentDao instance ekak create karala me variable
    // ekata inject karanawa.
    private EnrollmentDao enrollmentDao;

    // @Autowired // hama ekakatama danna ona ekkata witharak ba
    // private EnrollmentStatusDao enrollmentStatusDao;

    @Autowired // get authentication instance
    private AuthController authController;

    // get user instance
    @Autowired
    private UserDao userDao;

    // meka /enrollment kiyala url ekt giyama enrollment page eka load wenawa
    @RequestMapping("/enrollment")
    public ModelAndView enrollmentPage() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        // me code eke aim eka: login una user ge details ganna
        // me line eken SecurityContext eken currently logged-in una user info gannawa

        // username eka hraha user object eka gnnawa
        User loggedUser = userDao.getByUsername(authentication.getName());

        // aluth ModelAndView ekak hadanawa
        ModelAndView enrollmentUI = new ModelAndView();

        // view name eka set karanawa (enrollment.html file eka)
        enrollmentUI.setViewName("enrollment.html");

        // login una user ge nama enrollment ekata pass karanawa
        enrollmentUI.addObject("loggedusername", authentication.getName());

        // title set
        enrollmentUI.addObject("title", "Jithma Institute | Enrollment Management");

        // photo set
        enrollmentUI.addObject("userphoto", loggedUser.getUserphoto());

        // e page eka return karanawa browser ekata
        return enrollmentUI;
    }

    @GetMapping(value = "/enrollment/alldata")
    public List<Enrollment> getAllData() {
        // Login wela thiyena user kenekda kiyala ganna
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // Me userge ENROLLMENT module permission ganna
        Privilege userPrivilege = authController.getPrivilegeByUserAndModule(authentication.getName(), "ENROLLMENT");

        // User ta PRIVI_SELECT true da kiyala check karanawa
        if (userPrivilege.getPrivi_select()) {

            // User ta select permission thiyenawa nam
            // database eken enrollment table eke thiyena okkoma records return karanawa
            return enrollmentDao.findAll();

        } else {

            // Select permission naththam empty list ekak return karanawa
            return new ArrayList<>();
        }
    }

    @PostMapping(value = "/enrollment/insert")
    public String saveData(@RequestBody Enrollment enrollment) {

        // @RequestBody -> frontend eken ena JSON data eka Enrollment object ekakata
        // map karanawa.
        // e kiyanne request body eke thiyena fields tika automa Enrollment class
        // eke fields walata bind wenawa.
        // me annotation eka naththam JSON data eka object ekakata convert wenne na.

        // 1. need to check logged user privilege
        // log wela inne userta me operation eka karanna permission thiyanawada balanawa
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // Me userge ENROLLMENT module permission ganna
        Privilege userPrivilege = authController.getPrivilegeByUserAndModule(
                authentication.getName(),
                "ENROLLMENT");

        // insert permission naththam save eka block karanawa
        if (!userPrivilege.getPrivi_insert()) {
            return "Save not completed.You don't have permission..!";
        }

        // 2. need to check data existance

        // same teacher + same month enrollment already thiyanawada balanawa
        Enrollment extEnrollment = enrollmentDao.getByTeacherAndMonth(
                enrollment.getTeacher_id().getId(),
                enrollment.getEnrollmentmonth());

        // duplicate data thibboth message eka return karanawa
        if (extEnrollment != null) {
            return "Enrollment already exists for this month.";
        }

        // 3. try catch
        try {

            // 4. set auto generated tasks

            // current date-time eka set karanawa
            enrollment.setAddeddatetime(LocalDateTime.now());

            // login wela inna userge username eka gannawa
            String username = authentication.getName();

            // username eka use karala database eken login user object eka gannawa
            User loginUserObject = userDao.getByUsername(username);

            // enrollment record ekata add karapu userge ID eka set karanawa
            enrollment.setAddeduser(loginUserObject.getId());

            // EnrollmentHasBatch.java eke enrollment_id ManyToOne eka JsonIgnore krpu nisa
            // for loop dameema must
            for (EnrollmentHasBatch ehb : enrollment.getEnrollmentHasBatchList()) {
                ehb.setEnrollment_id(enrollment);
            }
            // 5. main save operation
            enrollmentDao.save(enrollment);

            // save success unoth OK return karanawa
            return "OK";

        } catch (Exception exception) {

            // mokak hari exception ekak awoth error message eka return karanawa
            return "Save not completed : "
                    + exception.getMessage();
        }
    }

    @GetMapping(value = "enrollment/getpendingbyteacher/{teacherid}", produces = "application/json")
    public List<Enrollment> getPendingByTeacher(@PathVariable("teacherid") Integer teacherid) {

        return enrollmentDao.getPendingEnrollmentsByTeacher(teacherid);
    }
}