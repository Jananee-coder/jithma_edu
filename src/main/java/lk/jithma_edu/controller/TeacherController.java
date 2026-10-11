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
import org.springframework.web.bind.annotation.ResponseBody;
/* import org.springframework.web.bind.annotation.RequestParam; */
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.jithma_edu.dao.ClassDetailDao;
import lk.jithma_edu.dao.TeacherDao;
import lk.jithma_edu.dao.TeacherStatusDao;
import lk.jithma_edu.dao.UserDao;
import lk.jithma_edu.entity.Privilege;
import lk.jithma_edu.entity.Teacher;
import lk.jithma_edu.entity.TeacherStatus;
import lk.jithma_edu.entity.User;

@RestController // me class eka REST controller ekak, data send / receive karanna use wenawa
// meka nathuuwa mapping wada krn na must need
public class TeacherController implements CommonController<Teacher> {

    @Autowired
    // @Autowired → Spring dependency injection.
    // Spring container eka ModuleDao instance ekak create karala me variable ekata
    // inject karanawa.
    private TeacherDao teacherDao;

    // get user instance
    @Autowired
    private UserDao userDao;

    // authentication object ekak hadagnnawa
    @Autowired
    private AuthController authController;

    // teacher status instance
    @Autowired
    private TeacherStatusDao teacherStatusDao;

    @Autowired
    private ClassDetailDao classDetailDao;

    // get role instance
    //@Autowired
    //private RoleDao roleDao;

    //@Autowired
    //private BCryptPasswordEncoder bCryptPasswordEncoder;

    // meka /teacher kiyala url ekt giyama teacher page eka load wenawa
    @RequestMapping("/teacher")
    public ModelAndView teacherPage() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        // me code eke aim eka: login una user ge details ganna
        // me line eken SecurityContext eken currently logged-in una user info gannawa

        // username eka hraha user object eka gnnawa
        User loggedUser = userDao.getByUsername(authentication.getName());

        // aluth ModelAndView ekak hadanawa
        ModelAndView teacherUI = new ModelAndView();

        // view name eka set karanawa (teacher.html file eka)
        teacherUI.setViewName("teacher.html");

        // login una user ge nama teacher ekata pass karanawa
        teacherUI.addObject("loggedusername", authentication.getName());

        // title set
        teacherUI.addObject("title", "Jithma Institute | Teacher Management");
        // photo set
        teacherUI.addObject("userphoto", loggedUser.getUserphoto());

        // e page eka return karanawa browser ekata
        return teacherUI;
    }

    @GetMapping(value = "/teacher/alldata")
    @Override
    public List<Teacher> getAllData() {
        // Login wela thiyena user kenekda kiyala ganna
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // Me userge TEACHER module permission ganna
        Privilege userPrivilege = authController.getPrivilegeByUserAndModule(authentication.getName(), "TEACHER");

        // User ta PRIVI_SELECT true da kiyala check karanawa
        if (userPrivilege.getPrivi_select()) {

            // User ta select permission thiyenawa nam OKKOMA teachers return karanawa
            return teacherDao.findAll();

        } else {

            // Select permission naththam empty list ekak return karanawa
            return new ArrayList<>();
        }
    }

    @GetMapping(value = "/teacherforother/alldata")
    public List<Teacher> getAllDataForOthers() {
        return teacherDao.findAll();
    }

    @PostMapping("/teacher/insert")
    @Override
    public String saveData(@RequestBody Teacher teacher) {
        // @RequestBody -> frontend eken ena JSON data eka teacher object ekakata map
        // karanawa.
        // e kiyanne request body eke thiyena fields tika automa Teacher class eke
        // fields walata bind wenawa.
        // me annotation eka naththam JSON data eka object ekakata convert wenne na.

        // 1. need to check loged user privilege
        // log wela inne userta me operation eka karanna permission thiyanawada balanawa
        // save krnna
        // meka naththam unauthorized user kenek save karanna ba.
        // Login wela thiyena user kenekda kiyala ganna
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // Me userge TEACHER module permission ganna
        Privilege userPrivilege = authController.getPrivilegeByUserAndModule(authentication.getName(), "TEACHER");
        if (!userPrivilege.getPrivi_insert()) {
            return "Save not completed.You don't have permission..!";
        }
        // 2.need to check data existance
        // check nic duplicate
        Teacher teacherByNic = teacherDao.getByNic(teacher.getNic());
        if (teacherByNic != null) {
            return "NIC no already exist..! " + teacher.getNic();
        }
        // check mobile duplicates
        Teacher teacherByMobile = teacherDao.getByMobile(teacher.getMobilenobusiness());
        if (teacherByMobile != null) {
            // duplicate mobile found
            return "Mobile no already exist..! " + teacher.getMobilenobusiness();
        }
        // email duplicate check
        Teacher teacheByEmail = teacherDao.getByEmail(teacher.getEmail());
        if (teacheByEmail != null) {
            return "Email already exist..! " + teacher.getEmail();
        }
        // 3.try catch
        try {

            // 4.set auto generted task
            teacher.setAddeddatetime(LocalDateTime.now()); // current date-time set karanawa

            // login wela inna userge username eka gannawa
            String username = authentication.getName();

            // username eka use karala database eken login user object eka gannawa
            User loginUserObject = userDao.getByUsername(username);

            // teacher record ekata add karapu userge ID eka set karanawa
            teacher.setAddeduser(loginUserObject.getId());

            // next teacher number set karanawa
            // getNextTeacherNo method eka teacher dao eke implement karala thiyanna one
            teacher.setTeacherno(teacherDao.getNextTeacherNo());

            // 5.main save operation
            teacherDao.save(teacher);

            // User empUser = new User();
            // autowired(UserDao,RoleDao,BCryptPasswordEncoder)
            // save success unoth return message

            // empUser.setUsername(teacher.getTeacherno());
            // empUser.setPassword(bCryptPasswordEncoder.encode(teacher.getNic()));
            // empUser.setEmail(teacher.getEmail());
            // empUser.setUserstatus(true);
            // empUser.setUserphoto(teacher.getTeacherphoto());
            // empUser.setEmployee_id(null);
            // empUser.setAddeddatetime(LocalDateTime.now());

            // Role empRole = roleDao.getReferenceById(6);
            // List<Role> userRoles = new ArrayList<>();
            // userRoles.add(empRole);
            // empUser.setRoles(userRoles);

            // userDao.save(empUser);
            // System.out.println("User account created..");

            // save success unoth return message
            return "OK";

        } catch (Exception exception) {
            // mokak hari exception ekak awama me message eka return karanawa
            return "Save not completed : " + exception.getMessage();
        }

    }

    @PutMapping(value = "/teacher/update")
    @Override
    public String updateData(@RequestBody Teacher teacher) {
        // @RequestBody -> frontend eken ena JSON data eka teacher object ekakata map
        // karanawa.
        // e kiyanne request body eke thiyena fields tika automa Teacher class eke
        // fields walata bind wenawa.
        // me annotation eka naththam JSON data eka object ekakata convert wenne na.

        // 1. need to check loged user privilege
        // log wela inne userta me operation eka karanna permission thiyanawada balanawa
        // save krnna
        // meka naththam unauthorized user kenek save karanna ba.
        // Login wela thiyena user kenekda kiyala ganna
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // Me userge TEACHER module permission ganna
        Privilege userPrivilege = authController.getPrivilegeByUserAndModule(authentication.getName(), "TEACHER");
        if (!userPrivilege.getPrivi_update()) {
            return "Save not completed.You don't have permission..!";
        }
        // 2.need to check data existance
        // me teacher id eka database eke innawada kiyala check karanwa
        Teacher extTeacher = teacherDao.getReferenceById(teacher.getId());
        if (extTeacher == null) {
            return "Update not completed.Teacher Not Found ..";
            // data naththam update karanna ba
        }
        // 3. need to check duplicate
        // check nic duplicate
        Teacher teacherByNic = teacherDao.getByNic(teacher.getNic());
        if (teacherByNic != null && teacherByNic.getId() != teacher.getId()) {
            return "NIC no already exist..! " + teacher.getNic();
        }
        // check mobile duplicates
        Teacher teacherByMobile = teacherDao.getByMobile(teacher.getMobilenobusiness());
        if (teacherByMobile != null && teacherByMobile.getId() != teacher.getId()) {
            // duplicate mobile found
            return "Mobile no already exist..! " + teacher.getMobilenobusiness();
        }
        // email duplicate check
        Teacher teacheByEmail = teacherDao.getByEmail(teacher.getEmail());
        if (teacheByEmail != null && teacheByEmail.getId() != teacher.getId()) {
            return "Email already exist..! " + teacher.getEmail();
        }
        // 4. try–catch block for error handling
        try {
            // 5.set auto generted task
            // auto-generated values set karanawa
            teacher.setUpdateddatetime(LocalDateTime.now());
            // teacher.setUpdateduser(1);

            // 6.main save operation
            teacherDao.save(teacher);

            // 7. handle dependencies
            // dependent tables update karanna wenna puluwan

            return "OK"; // update success wenawanam OK return karanawa

        } catch (Exception e) {

            // mokak hari error ekak awoth exception message return karanawa
            return "Update not completed. Some errors occurred: " + e.getMessage();
        }
    }

    @DeleteMapping(value = "/teacher/delete")
    @Override
    public String deleteData(@RequestBody Teacher teacher) {
        // @RequestBody -> frontend eken ena JSON data eka teacher object ekakata map
        // karanawa.
        // e kiyanne request body eke thiyena fields tika automa Teacher class eke
        // fields walata bind wenawa.
        // me annotation eka naththam JSON data eka object ekakata convert wenne na.

        // 1. need to check loged user privilege
        // log wela inne user ta me teacher eka delete karanna puluwanda kiyala
        // check karanna one
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // Me userge TEACHER module permission ganna
        Privilege userPrivilege = authController.getPrivilegeByUserAndModule(authentication.getName(), "TEACHER");
        if (!userPrivilege.getPrivi_delete()) {
            return "Delete not completed.You don't have permission..!";
        }

        // 2. need to check data existance
        // me teacher id eka database eke innawada kiyala check karanwa
        Teacher extTeacher = teacherDao.getReferenceById(teacher.getId());
        if (extTeacher == null) {
            return "Delete not completed.Teacher Not Found ..";
            // data naththam delete karanna ba
        }

        // 3.try catch
        try {
            // 4.set auto generted task

            // 5.operation
            // hard delete not good
            // teacherDao.delete(teacher);

            // soft delete
            // methanadi delete krana kenage status eka delete kiyana ekata maru wena eka
            // wenne
            TeacherStatus deleteStatus = teacherStatusDao.getReferenceById(2);
            extTeacher.setTeacherstatus_id(deleteStatus);
            teacher.setDeleteddatetime(LocalDateTime.now());
            System.out.println(extTeacher);
            teacherDao.save(extTeacher);

            // 6.check dependancies
            return "OK"; // delete success unama me return wenawa
        } catch (Exception e) {
            // mokak hari issue ekak awama me error message eka return wenawa
            return "Delete not completed. Some errors occurred: " + e.getMessage();
        }
    }

    // selected grade ekata adala teacher list eka return karanna
    @GetMapping(value = "/teacher/bygrade/{gradeId}", produces = "application/json")
    public List<Teacher> getTeachersByGrade(@PathVariable Integer gradeId) {

        // selected grade ekata adala teachers DB eken ganna
        return classDetailDao.getTeachersByGrade(gradeId);
    }

    // selected subject ekata adala teacher list eka return karanna
    @GetMapping(value = "/teacher/bysubjectwise/{subjectId}", produces = "application/json")
    public List<Teacher> getTeachersBySubjects(@PathVariable Integer subjectId) {

        // selected subject ekata adala teachers DB eken ganna
        return classDetailDao.getTeachersBySubject(subjectId);
    }

    // grade ekata saha subject ekata adala teachers gannawa
    @GetMapping("/teacher/bygradesubject/{gradeId}/{subjectId}")
    public List<Teacher> getTeachersByGradeAndSubject(
            @PathVariable Integer gradeId,
            @PathVariable Integer subjectId) {

        return teacherDao.getByGradeAndSubject(gradeId, subjectId);
    }

    @GetMapping("/teacher/searchbankbranch/{text}")
    public List<String> searchBankBranch(
            @PathVariable String text) {

        // user type karana bank branch text eka aran database eke search karanawa
        // ex: "neg" kiyala dunnoth Negombo kiyala thiyena branch tika hoyanawa
        List<Teacher> teachers = teacherDao.findByBankbranchContainingIgnoreCase(text);

        // Teacher object list eken bankbranch name witharak gannawa
        // duplicate values ain karanawa
        // final result eka branch name list ekak widihata return karanawa
        return teachers.stream()
                .map(teacher -> teacher.getBankbranch())
                .distinct()
                .toList();

    }

    // subject eken teacherwa filter wenwa
    @GetMapping("teacher/bysubject/{subjectId}")
    @ResponseBody
    public List<Teacher> getTeachersBySubject(@PathVariable Integer subjectId) {
        return teacherDao.getTeachersBySubject(subjectId);
    }
}
