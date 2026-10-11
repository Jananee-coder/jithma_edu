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
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.jithma_edu.dao.StudentDao;
import lk.jithma_edu.dao.StudentStatusDao;
import lk.jithma_edu.dao.UserDao;
import lk.jithma_edu.entity.Privilege;
import lk.jithma_edu.entity.Student;
import lk.jithma_edu.entity.StudentStatus;
import lk.jithma_edu.entity.User;

@RestController // me class eka REST controller ekak, data send / receive karanna use wenawa
// meka nathuuwa mapping wada krn na must need
public class StudentController implements CommonController<Student> {

    @Autowired
    // @Autowired → Spring dependency injection.
    // Spring container eka StudentDao instance ekak create karala me variable
    // ekata
    // inject karanawa.

    private StudentDao studentDao;

    // get user instance
    @Autowired
    private UserDao userDao;

    @Autowired // get instance -> student status
    private StudentStatusDao studentStatusDao;

    @Autowired
    private AuthController authController;

    // meka /student kiyala url ekt giyama student page eka load wenawa
    @RequestMapping("/student")
    public ModelAndView studentPage() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        // me code eke aim eka: login una user ge details ganna
        // me line eken SecurityContext eken currently logged-in una user info gannawa

        // username eka hraha user object eka gnnawa
        User loggedUser = userDao.getByUsername(authentication.getName());

        // aluth ModelAndView ekak hadanawa
        ModelAndView studentUI = new ModelAndView();

        // view name eka set karanawa (student.html file eka)
        studentUI.setViewName("student.html");

        // login una user ge nama student ekata pass karanawa
        studentUI.addObject("loggedusername", authentication.getName());

        // title set
        studentUI.addObject("title", "Jithma Institute | Student Management");

        // photo set
        studentUI.addObject("userphoto", loggedUser.getUserphoto());

        // e page eka return karanawa browser ekata
        return studentUI;
    }

    @GetMapping(value = "/student/alldata")
    @Override
    public List<Student> getAllData() {
        // Login wela thiyena user kenekda kiyala ganna
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // Me userge STUDENT module permission ganna
        Privilege userPrivilege = authController.getPrivilegeByUserAndModule(authentication.getName(), "STUDENT");

        // User ta PRIVI_SELECT true da kiyala check karanawa
        if (userPrivilege.getPrivi_select()) {

            // User ta select permission thiyenawa nam OKKOMA studentS return karanawa
            // database eken student table eke thiyena okkoma records return karanawa
            return studentDao.findAll();

        } else {

            // Select permission naththam empty list ekak return karanawa
            return new ArrayList<>();
        }

    }

    @GetMapping(value = "/studentforother/alldata")
    public List<Student> getAllDataForOthers() {

        // User ta select permission thiyenawa nam OKKOMA studentS return karanawa
        // database eken student table eke thiyena okkoma records return karanawa
        return studentDao.findAll();
    }

    @PostMapping("/student/insert")
    @Override
    public String saveData(@RequestBody Student student) {
        // @RequestBody -> frontend eken ena JSON data eka Student object ekakata map
        // karanawa.
        // e kiyanne request body eke thiyena fields tika automa Employee class eke
        // fields walata bind wenawa.
        // me annotation eka naththam JSON data eka object ekakata convert wenne na.

        // 1. need to check loged user privilege
        // log wela inne userta me operation eka karanna permission thiyanawada balanawa
        // save krnna
        // meka naththam unauthorized user kenek save karanna ba.
        // Login wela thiyena user kenekda kiyala ganna
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // Me userge STUDENT module permission ganna
        Privilege userPrivilege = authController.getPrivilegeByUserAndModule(authentication.getName(), "STUDENT");
        if (!userPrivilege.getPrivi_insert()) {
            return "Save not completed.You don't have permission..!";
        }

        // 2.need to check data existance
        // dmobile,email,nic wala combination Already thiyenawada kiyala check karanawa

        // mobile number ekata duplicate ekak innawada kiyala balanna
        /*
         * Student extStudentMobile = studentDao.getMobileno(student.getWhatsapno());
         * if (extStudentMobile != null) {
         * // duplicate mobile found
         * return "Save Not Completed : Mobile no already exist..! " +
         * student.getWhatsapno();
         * }
         */

        // 3.try catch
        try {

            // 4.set auto generted task
            student.setAddeddatetime(LocalDateTime.now()); // current date-time set karanawa

            // login wela inna userge username eka gannawa
            String username = authentication.getName();

            // username eka use karala database eken login user object eka gannawa
            User loginUserObject = userDao.getByUsername(username);

            // student record ekata add karapu userge ID eka set karanawa
            student.setAddeduser(loginUserObject.getId());

            // next student number set karanawa
            // getNextStudentRegNo method eka employeeDao eke implement karala thiyanna one
            student.setRegno(studentDao.getNextStudentRegNo());

            // 5.main save operation
            studentDao.save(student);

            // save success unoth return message
            return "OK";

        } catch (Exception exception) {
            // mokak hari exception ekak awama me message eka return karanawa
            return "Save not completed : " + exception.getMessage();
        }

    }

    @PutMapping(value = "/student/update")
    @Override
    public String updateData(@RequestBody Student student) {
        // @RequestBody -> frontend eken ena JSON data eka student object ekakata map
        // karanawa.
        // e kiyanne request body eke thiyena fields tika automa Privilege class eke
        // fields walata bind wenawa.
        // me annotation eka naththam JSON data eka object ekakata convert wenne na.

        // 1. need to check loged user privilege
        // log wela inne user ta me student eka delete karanna puluwanda kiyala
        // check karanna one
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // Me userge STUDENT module permission ganna
        Privilege userPrivilege = authController.getPrivilegeByUserAndModule(authentication.getName(), "STUDENT");
        if (!userPrivilege.getPrivi_update()) {
            return "Update not completed.You don't have permission..!";
        }

        // 2.need to check data existance
        // me student id eka database eke innawada kiyala check karanwa
        Student extStudent = studentDao.getReferenceById(student.getId());
        if (extStudent == null) {
            return "Update not completed.Student Not Found ..";
            // data naththam update karanna ba
        }
        // 3. need to check duplicate

        // 4. try–catch block for error handling
        try {
            // 5.set auto generted task
            // auto-generated values set karanawa
            student.setUpdateddatetime(LocalDateTime.now());
            // student.setUpdateduser(1);

            // 6.main save operation
            studentDao.save(student);

            // 7. handle dependencies
            // dependent tables update karanna wenna puluwan

            return "OK"; // update success wenawanam OK return karanawa

        } catch (Exception e) {

            // mokak hari error ekak awoth exception message return karanawa
            return "Update not completed. Some errors occurred: " + e.getMessage();
        }
    }

    @DeleteMapping(value = "/student/delete")
    @Override
    public String deleteData(@RequestBody Student student) {
        // @RequestBody -> frontend eken ena JSON data eka student object ekakata map
        // karanawa.
        // e kiyanne request body eke thiyena fields tika automa student class eke
        // fields walata bind wenawa.
        // me annotation eka naththam JSON data eka object ekakata convert wenne na.

        // 1. need to check loged user privilege
        // log wela inne user ta me student eka delete karanna puluwanda kiyala
        // check karanna one
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // Me userge STUDENT module permission ganna
        Privilege userPrivilege = authController.getPrivilegeByUserAndModule(authentication.getName(), "STUDENT");
        if (!userPrivilege.getPrivi_delete()) {
            return "Delete not completed.You don't have permission..!";
        }

        // 2. need to check data existance
        // me student id eka database eke innawada kiyala check karanwa
        Student extStudent = studentDao.getReferenceById(student.getId());
        if (extStudent == null) {
            return "Delete not completed.Student Not Found ..";
            // data naththam delete karanna ba
        }

        // 3.try catch
        try {
            // 4.set auto generted task

            // 5.operation
            // hard delete not good
            // studentDao.delete(student);

            // soft delete
            // methanadi delete krana kenage status eka delete kiyana ekata maru wena eka
            // wenne
            StudentStatus deleteStatus = studentStatusDao.getReferenceById(2);
            extStudent.setStudentstatus_id(deleteStatus);

            System.out.println(extStudent);
            studentDao.save(extStudent);

            // 6.check dependancies
            return "OK"; // delete success unama me return wenawa
        } catch (Exception e) {
            // mokak hari issue ekak awama me error message eka return wenawa
            return "Delete not completed. Some errors occurred: " + e.getMessage();
        }
    }

    @RequestMapping(value = "/student/paymentcountbystudent/{studentregno}")
    public String getStudentPaymentStatusByRegNo(@PathVariable("studentregno") String studentRegNo) {

        System.out.println("----------------------------");
        System.out.println(studentRegNo);
        System.out.println("----------------------------");

        String studentPaymentCount = studentDao.getStudentPayementCountByNumber(studentRegNo);

        return studentPaymentCount;
    }

    /* @GetMapping("student/bygender/{gender}")
    public List<Student> getStudentByGender(@PathVariable String gender) {

        // user select karapu gender eka aran
        // dao eka haraha database eken adala students la gannawa
        return studentDao.findByGender(gender);

    } */

}
