package lk.jithma_edu.controller;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.jithma_edu.dao.ClassDetailDao;
import lk.jithma_edu.dao.ClassDetailStatusDao;
import lk.jithma_edu.dao.UserDao;
import lk.jithma_edu.entity.ClassDetail;
import lk.jithma_edu.entity.ClassDetailStatus;
import lk.jithma_edu.entity.Privilege;
import lk.jithma_edu.entity.User;

@RestController // me class eka REST controller ekak, data send / receive karanna use wenawa
// meka nathuuwa mapping wada krn na must need
public class ClassDetailController implements CommonController<ClassDetail> {

    @Autowired
    // @Autowired → Spring dependency injection.
    // Spring container eka ClassDetailDao instance ekak create karala me variable
    // ekata
    // inject karanawa.
    private ClassDetailDao classDetailDao;

    // authentication object ekak hadagnnawa
    @Autowired
    private AuthController authController;

    // classdetailstatus object ekak hadagnnawa
    @Autowired
    private ClassDetailStatusDao classDetailStatusDao;

    // get user instance
    @Autowired
    private UserDao userDao;

    // meka /classdetail kiyala url ekt giyama classdetail page eka load wenawa
    @RequestMapping("/classdetail")
    public ModelAndView classDetailPage() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        // me code eke aim eka: login una user ge details ganna
        // me line eken SecurityContext eken currently logged-in una user info gannawa

        // username eka hraha user object eka gnnawa
        User loggedUser = userDao.getByUsername(authentication.getName());

        // aluth ModelAndView ekak hadanawa
        ModelAndView classDetailUI = new ModelAndView();

        // view name eka set karanawa (classdetail.html file eka)
        classDetailUI.setViewName("classdetail.html");
        // login una user ge nama classdetail ekata pass karanawa
        classDetailUI.addObject("loggedusername", authentication.getName());

        // title set
        classDetailUI.addObject("title", "Jithma Institute | Class Detail Management");

        // photo set
        classDetailUI.addObject("userphoto", loggedUser.getUserphoto());

        // e page eka return karanawa browser ekata
        return classDetailUI;
    }

    @GetMapping(value = "/classdetail/alldata")
    @Override
    public List<ClassDetail> getAllData() {
        // Login wela thiyena user kenekda kiyala ganna
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // Me userge CLASSDETAIL module permission ganna
        Privilege userPrivilege = authController.getPrivilegeByUserAndModule(authentication.getName(), "CLASSDETAIL");

        // User ta PRIVI_SELECT true da kiyala check karanawa
        if (userPrivilege.getPrivi_select()) {

            // User ta select permission thiyenawa nam OKKOMA classdetails return karanawa
            return classDetailDao.findAll();

        } else {

            // Select permission naththam empty list ekak return karanawa
            return new ArrayList<>();
        }
    }

    // POST mapping ekak create karala classdetail record insert karanna
    @PostMapping(value = "/classdetail/insert")
    @Override
    public String saveData(@RequestBody ClassDetail classdetail) {
        // @RequestBody -> frontend eken ena JSON data eka ClassDetail object ekakata
        // map
        // karanawa.
        // e kiyanne request body eke thiyena fields tika automa ClassDetail class eke
        // fields walata bind wenawa.
        // me annotation eka naththam JSON data eka object ekakata convert wenne na.

        // 1. need to check loged user privilege
        // log wela inne userta me operation eka karanna permission thiyanawada balanawa
        // save krnna
        // meka naththam unauthorized user kenek save karanna ba.
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // Me userge CLASSDETAIL module permission ganna
        Privilege userPrivilege = authController.getPrivilegeByUserAndModule(authentication.getName(), "CLASSDETAIL");
        if (!userPrivilege.getPrivi_insert()) {
            return "Save not completed.You don't have permission..!";
        }

        // 2.need to check data existance
        ClassDetail classdetailByClassname = classDetailDao.getClassname(classdetail.getClassname());
        if (classdetailByClassname != null) {
            // duplicate class name found
            return "Class name  already exist..! " + classdetail.getClassname();
        }

        // 3.try catch
        try {

            // 4.set auto generted task
            classdetail.setAddeddatetime(LocalDateTime.now()); // current date-time set karanawa

            // login wela inna userge username eka gannawa
            String username = authentication.getName();

            // username eka use karala database eken login user object eka gannawa
            User loginUserObject = userDao.getByUsername(username);

            // classdetail record ekata add karapu userge ID eka set karanawa
            classdetail.setAddeduser(loginUserObject.getId());

            // 5.main save operation
            classDetailDao.save(classdetail);

            // save success unoth return message
            return "OK";

        } catch (Exception exception) {
            // mokak hari exception ekak awama me message eka return karanawa
            return "Save not completed : " + exception.getMessage();
        }
    }

    @PutMapping(value = "/classdetail/update")
    @Override
    public String updateData(@RequestBody ClassDetail classdetail) {
        // @RequestBody -> frontend eken ena JSON data eka ClassDetail object ekakata
        // map
        // karanawa.
        // e kiyanne request body eke thiyena fields tika automa ClassDetail class eke
        // fields walata bind wenawa.
        // me annotation eka naththam JSON data eka object ekakata convert wenne na.

        // 1. need to check loged user privilege
        // log wela inne userta me operation eka karanna permission thiyanawada balanawa
        // update krnna
        // meka naththam unauthorized user kenek update karanna ba.
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // Me userge CLASSDETAIL module permission ganna
        Privilege userPrivilege = authController.getPrivilegeByUserAndModule(authentication.getName(), "CLASSDETAIL");
        if (!userPrivilege.getPrivi_update()) {
            return "Update not completed.You don't have permission..!";
        }

        // 2. need to check data existance
        // me classdetail id eka database eke innawada kiyala check karanwa
        ClassDetail exClassDetail = classDetailDao.getReferenceById(classdetail.getId());
        if (exClassDetail == null) {
            return "Update not completed.Class Detail Not Found ..";
            // data naththam update karanna ba
        }
        // 3. need to check duplicate
        ClassDetail classdetailByClassname = classDetailDao.getClassname(classdetail.getClassname());
        if (classdetailByClassname != null && classdetailByClassname.getId() != classdetail.getId()) {
            // duplicate class name found
            return "Class name  already exist..! " + classdetail.getClassname();
        }

        // 4. try–catch block for error handling
        try {
            // 5.set auto generted task
            // auto-generated values set karanawa
            classdetail.setUpdateddatetime(LocalDateTime.now());
            // classdetail.setUpdateduser(1);

            // 6.main save operation
            classDetailDao.save(classdetail);

            // 7. handle dependencies
            // dependent tables update karanna wenna puluwan

            return "OK"; // update success wenawanam OK return karanawa

        } catch (Exception e) {

            // mokak hari error ekak awoth exception message return karanawa
            return "Update not completed. Some errors occurred: " + e.getMessage();
        }
    }

    @DeleteMapping(value = "/classdetail/delete")
    @Override
    public String deleteData(@RequestBody ClassDetail classdetail) {
        // @RequestBody -> frontend eken ena JSON data eka ClassDetail object ekakata
        // map
        // karanawa.
        // e kiyanne request body eke thiyena fields tika automa ClassDetail class eke
        // fields walata bind wenawa.
        // me annotation eka naththam JSON data eka object ekakata convert wenne na.

        // 1. need to check loged user privilege
        // log wela inne user ta me classdetail eka delete karanna puluwanda kiyala
        // check krnna one
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // Me userge CLASSDETAIL module permission ganna
        Privilege userPrivilege = authController.getPrivilegeByUserAndModule(authentication.getName(), "CLASSDETAIL");
        if (!userPrivilege.getPrivi_delete()) {
            return "Delete not completed.You don't have permission..!";
        }

        // 2. need to check data existance
        // me classdetail id eka database eke innawada kiyala check karanwa
        ClassDetail exClassDetail = classDetailDao.getReferenceById(classdetail.getId());
        if (exClassDetail == null) {
            return "Delete not completed.Class Detail Not Found ..";
            // data naththam delete karanna ba
        }
        // 3.try catch
        try {
            // 4.set auto generted task

            // 5.operation
            // hard delete not good
            // classDetailStatusDao.delete(classdetail);

            // soft delete
            // methanadi delete krana kenage status eka delete kiyana ekata maru wena eka
            // wenne
            ClassDetailStatus deleteStatus = classDetailStatusDao.getReferenceById(2);
            exClassDetail.setClassdetailstatus_id(deleteStatus);

            System.out.println(exClassDetail);
            classDetailDao.save(exClassDetail);

            // 6.check dependancies
            return "OK"; // delete success unama me return wenawa
        } catch (Exception e) {
            // mokak hari issue ekak awama me error message eka return wenawa
            return "Delete not completed. Some errors occurred: " + e.getMessage();
        }

    }

    // create get mapping for get active classdetail names list
    // account[/classdetail/activeclassdetailnames]
    @GetMapping(value = "classdetail/activeclassdetailnames", produces = "application/json")
    public List<ClassDetail> getActiveClassNames() {
        return classDetailDao.getActiveClassDetails();
    }

}
