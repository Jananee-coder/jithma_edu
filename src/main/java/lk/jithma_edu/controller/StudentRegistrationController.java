package lk.jithma_edu.controller;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.jithma_edu.dao.StudentRegStatusDao;
import lk.jithma_edu.dao.StudentRegistrationDao;
import lk.jithma_edu.dao.UserDao;
import lk.jithma_edu.entity.Privilege;
import lk.jithma_edu.entity.StudentRegStatus;
import lk.jithma_edu.entity.StudentRegistration;
import lk.jithma_edu.entity.User;

@RestController // me class eka REST controller ekak, data send / receive karanna use wenawa
// meka nathuuwa mapping wada krn na must need
public class StudentRegistrationController implements CommonController<StudentRegistration> {

    @Autowired
    // @Autowired → Spring dependency injection.
    // Spring container eka StudentRegistrationDao instance ekak create karala me
    // variable
    // ekata
    // inject karanawa.

    private StudentRegistrationDao studentRegistrationDao;

    @Autowired // get instance StudentRegStatusDao
    private StudentRegStatusDao studentRegStatusDao;

    @Autowired // get authentication instance
    private AuthController authController;

    // get user instance
    @Autowired
    private UserDao userDao;

    // meka /registration kiyala url ekt giyama registration page eka load wenawa
    @RequestMapping("/studentregistration")
    public ModelAndView registrationPage() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        // me code eke aim eka: login una user ge details ganna
        // me line eken SecurityContext eken currently logged-in una user info gannawa

        // username eka hraha user object eka gnnawa
        User loggedUser = userDao.getByUsername(authentication.getName());

        // aluth ModelAndView ekak hadanawa
        ModelAndView registrationUI = new ModelAndView();

        // view name eka set karanawa (registration.html file eka)
        registrationUI.setViewName("studentregistration.html");

        // login una user ge nama student registration ekata pass karanawa
        registrationUI.addObject("loggedusername", authentication.getName());

        // title set
        registrationUI.addObject("title", "Jithma Institute | Student Registration Management");

        // photo set
        registrationUI.addObject("userphoto", loggedUser.getUserphoto());

        // e page eka return karanawa browser ekata
        return registrationUI;
    }

    @GetMapping(value = "/studentregistration/alldata")
    @Override
    public List<StudentRegistration> getAllData() {

        // Login wela thiyena user kenekda kiyala ganna
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // Me userge REGISTRATION module permission ganna
        Privilege userPrivilege = authController.getPrivilegeByUserAndModule(authentication.getName(), "REGISTRATION");

        // User ta PRIVI_SELECT true da kiyala check karanawa
        if (userPrivilege.getPrivi_select()) {

            // User ta select permission thiyenawa nam
            // database eken guardian table eke thiyena okkoma records return karanawa
            return studentRegistrationDao.findAll();

        } else {

            // Select permission naththam empty list ekak return karanawa
            return new ArrayList<>();
        }
    }

    @PostMapping(value = "/studentregistration/insert")
    @Override
    public String saveData(@RequestBody StudentRegistration studentregistration) {
        // @RequestBody -> frontend eken ena JSON data eka Student Registration object
        // ekakata map
        // karanawa.
        // e kiyanne request body eke thiyena fields tika automa Student Registration
        // class eke
        // fields walata bind wenawa.
        // me annotation eka naththam JSON data eka object ekakata convert wenne na.

        // 1. need to check loged user privilege
        // log wela inne user ta me studentregistration eka delete karanna puluwanda
        // kiyala
        // check karanna one
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // Me userge REGISTRATION module permission ganna
        Privilege userPrivilege = authController.getPrivilegeByUserAndModule(authentication.getName(), "REGISTRATION");
        if (!userPrivilege.getPrivi_insert()) {
            return "Save not completed.You don't have permission..!";
        }
        // 2.need to check data existance

        StudentRegistration exStudentRegistration = studentRegistrationDao.getByStudentAndBatch(
                studentregistration.getStudent_id().getId(),
                studentregistration.getBatch_id().getId());

        if (exStudentRegistration != null) {
            // duplicate student in same batch
            return "Student already registered for this batch..!  " + studentregistration.getBatch_id().getBatchname();
        }

        // 3.try catch
        try {

            // 4.set auto generted task
            studentregistration.setAddeddatetime(LocalDateTime.now()); // current date-time set karanawa

            // login wela inna userge username eka gannawa
            String username = authentication.getName();

            // username eka use karala database eken login user object eka gannawa
            User loginUserObject = userDao.getByUsername(username);

            // studentregistration record ekata add karapu userge ID eka set karanawa
            studentregistration.setAddeduser(loginUserObject.getId());

            // 5.main save operation
            studentRegistrationDao.save(studentregistration);

            // save success unoth return message
            return "OK";

        } catch (Exception exception) {
            // mokak hari exception ekak awama me message eka return karanawa
            return "Save not completed : " + exception.getMessage();
        }
    }

    @PutMapping(value = "/studentregistration/update")
    @Override
    public String updateData(@RequestBody StudentRegistration studentregistration) {
        // @RequestBody -> frontend eken ena JSON data eka Student Registration object
        // ekakata map
        // karanawa.
        // e kiyanne request body eke thiyena fields tika automa Student Registration
        // class eke
        // fields walata bind wenawa.
        // me annotation eka naththam JSON data eka object ekakata convert wenne na.

        // 1. need to check loged user privilege
        // log wela inne user ta me studentregistration eka delete karanna puluwanda
        // kiyala
        // check karanna one
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // Me userge REGISTRATION module permission ganna
        Privilege userPrivilege = authController.getPrivilegeByUserAndModule(authentication.getName(), "REGISTRATION");
        if (!userPrivilege.getPrivi_update()) {
            return "Save not completed.You don't have permission..!";
        }
        // 2. need to check data existance
        // me registration id eka database eke innawada kiyala check karanwa
        StudentRegistration exStudentRegistration = studentRegistrationDao
                .getReferenceById(studentregistration.getId());
        if (exStudentRegistration == null) {
            return "Update not completed.Student Registration Detail Not Found ..";
            // data naththam delete karanna ba
        }
        // 3. need to check duplicate

        // 4. try–catch block for error handling
        try {
            // 5.set auto generted task
            // auto-generated values set karanawa
            studentregistration.setUpdateddatetime(LocalDateTime.now());
            // batch.setUpdateduser(1);

            // 6.main save operation
            studentRegistrationDao.save(studentregistration);

            // 7. handle dependencies
            // dependent tables update karanna wenna puluwan

            return "OK"; // update success wenawanam OK return karanawa

        } catch (Exception e) {

            // mokak hari error ekak awoth exception message return karanawa
            return "Update not completed. Some errors occurred: " + e.getMessage();
        }
    }

    @DeleteMapping(value = "/studentregistration/delete")
    @Override
    public String deleteData(@RequestBody StudentRegistration studentregistration) {
        // @RequestBody -> frontend eken ena JSON data eka Student Registration object
        // ekakata map
        // karanawa.
        // e kiyanne request body eke thiyena fields tika automa Student Registration
        // class eke
        // fields walata bind wenawa.
        // me annotation eka naththam JSON data eka object ekakata convert wenne na.

        // 1. need to check loged user privilege
        // log wela inne user ta me studentregistration eka delete karanna puluwanda
        // kiyala
        // check karanna one
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // Me userge REGISTRATION module permission ganna
        Privilege userPrivilege = authController.getPrivilegeByUserAndModule(authentication.getName(), "REGISTRATION");
        if (!userPrivilege.getPrivi_delete()) {
            return "Delete not completed.You don't have permission..!";
        }

        // 2. need to check data existance
        // me studentregistration id eka database eke innawada kiyala check karanwa
        StudentRegistration exStudentRegistration = studentRegistrationDao
                .getReferenceById(studentregistration.getId());
        if (exStudentRegistration == null) {
            return "Delete not completed.Student Registration Detail Not Found ..";
            // data naththam delete karanna ba
        }
        // 3.try catch
        try {
            // 4.set auto generted task

            // 5.operation
            // hard delete not good
            // studentRegStatusDao.delete(studentregistration);

            // soft delete
            // methanadi delete krana kenage status eka delete kiyana ekata maru wena eka
            // wenne
            StudentRegStatus deleteStatus = studentRegStatusDao.getReferenceById(2);
            exStudentRegistration.setStudentregstatus_id(deleteStatus);

            System.out.println(exStudentRegistration);
            studentRegistrationDao.save(exStudentRegistration);

            // 6.check dependancies
            return "OK"; // delete success unama me return wenawa
        } catch (Exception e) {
            // mokak hari issue ekak awama me error message eka return wenawa
            return "Delete not completed. Some errors occurred: " + e.getMessage();
        }

    }

    @GetMapping(value = "/stureg/bystubatch", produces = "application/json")
    public StudentRegistration getStudentRegistrationByStudentAndBatch(
            @RequestParam("studentId") int studentId, // URL eken studentId parameter eka gannawa
            @RequestParam("batchId") int batchId) { // URL eken batchId parameter eka gannawa

        // studentId saha batchId anuwa StudentRegistration record eka return karanawa
        return studentRegistrationDao.getStudentRegistrationByStudentAndBatch(studentId, batchId);
    }

    // batch ekakata adala studentla keeyak register wela innawada kiyala count eka
    // ganna API endpoint eka
    @GetMapping("studentregistration/count/{batchId}")
    public Long getCount(@PathVariable Integer batchId) {

        // DAO method eka call karala database eken batchId ekata adala student count
        // eka gannawa
        Long count = studentRegistrationDao.getStudentCountByBatch(batchId);

        // count eka frontend ekata return karanawa
        return count;
    }

    // batch ekata adala FREE students count eka gannawa
    @GetMapping("studentregistration/freecount/{batchId}")
    public Long getFreeCount(@PathVariable int batchId) {

        // DAO method eka call karala FREE count eka gannawa
        Long count = studentRegistrationDao.getFreeCountByBatch(batchId);

        return count;
    }

    // student ge registered batch list eka gannawa
    @GetMapping("/studentregistration/bystudent")
    public List<StudentRegistration> getRegistrationsByStudent(@RequestParam Integer studentId) {
        return studentRegistrationDao.getRegistrationsByStudent(studentId);
    }

}