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

import lk.jithma_edu.dao.PrivilegeDao;
import lk.jithma_edu.dao.UserDao;
import lk.jithma_edu.entity.Privilege;
import lk.jithma_edu.entity.User;

@RestController // me class eka REST controller ekak, data send / receive karanna use wenawa
// meka nathuuwa mapping wada krn na must need
public class PrivilegeController implements CommonController<Privilege> {

    @Autowired
    // @Autowired → Spring dependency injection.
    // Spring container eka ModuleDao instance ekak create karala me variable ekata
    // inject karanawa.

    private PrivilegeDao privilegeDao;

    @Autowired
    private AuthController authController;

    // get user instance
    @Autowired
    private UserDao userDao;

    // meka /privilege kiyala url ekt giyama privilege page eka load wenawa
    @RequestMapping("/privilege")
    public ModelAndView privilegePage() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        // me code eke aim eka: login una user ge details ganna
        // me line eken SecurityContext eken currently logged-in una user info gannawa

        // username eka hraha user object eka gnnawa
        User loggedUser = userDao.getByUsername(authentication.getName());

        // aluth ModelAndView ekak hadanawa
        ModelAndView privilegeUI = new ModelAndView();

        // view name eka set karanawa (privilege.html file eka)
        privilegeUI.setViewName("privilege.html");

        // login una user ge nama privilege ekata pass karanawa
        privilegeUI.addObject("loggedusername", authentication.getName());

        // title set
        privilegeUI.addObject("title", "Jithma Institute | Privilege Management");

        // photo set
        privilegeUI.addObject("userphoto", loggedUser.getUserphoto());

        // e page eka return karanawa browser ekata
        return privilegeUI;
    }

    @GetMapping(value = "/privilege/alldata")
    @Override
    public List<Privilege> getAllData() {
        // Login wela thiyena user kenekda kiyala ganna
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // Me userge PRIVILEGE module permission ganna
        Privilege userPrivilege = authController.getPrivilegeByUserAndModule(authentication.getName(), "PRIVILEGE");

        // User ta PRIVI_SELECT true da kiyala check karanawa
        if (userPrivilege.getPrivi_select()) {

            // User ta select permission thiyenawa nam OKKOMA PRIVILEGES return karanawa
            return privilegeDao.findAll();

        } else {

            // Select permission naththam empty list ekak return karanawa
            return new ArrayList<>();
        }

    }

    @PostMapping(value = "/privilege/insert")
    @Override
    public String saveData(@RequestBody Privilege privilege) {
        // @RequestBody -> frontend eken ena JSON data eka Privilege object ekakata map
        // karanawa.
        // e kiyanne request body eke thiyena fields tika automa Privilege class eke
        // fields walata bind wenawa.
        // me annotation eka naththam JSON data eka object ekakata convert wenne na.

        // 1. need to check loged user privilege
        // log wela inne user ta me privilege eka save karanna puluwanda kiyala check
        // karanna one
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // Me userge PRIVILEGE module permission ganna
        Privilege userPrivilege = authController.getPrivilegeByUserAndModule(authentication.getName(), "PRIVILEGE");
        if (!userPrivilege.getPrivi_insert()) {
            return "Save not completed.You don't have permission..!";
        }

        // 2.need to check data existance
        // de eke me role + module combination Already thiyenawada kiyala check karanawa
        Privilege extPrivilegeByRoleModule = privilegeDao.getByRoleModule(privilege.getRole_id().getId(),
                privilege.getModule_id().getId());
        if (extPrivilegeByRoleModule != null) {
            // me role-module pair already thiyenawanam save wenna epa
            return "Privilege Already Exists..";
        }
        // 3.try catch
        try {
            // 4.set auto generated task
            privilege.setAddeddatetime(LocalDateTime.now());

            // 5.operation
            privilegeDao.save(privilege);
            // dependancies

            return "OK"; // post success unama me return wenawa
        } catch (Exception e) {
            // mokak hari issue ekak awama me error message eka return wenawa
            return "Save not completed. Some errors occurred: " + e.getMessage();
        }

    }

    @PutMapping(value = "/privilege/update")
    @Override
    public String updateData(@RequestBody Privilege privilege) {

        // @RequestBody -> frontend eken ena JSON data Privilege object ekakata map
        // wenawa.
        // e nisa frontend field names Privilege class eke fields ekata match wenna one.
        // me annotation naththam JSON to Object convert wenne na.

        // 1. need to check logged user privilege
        // log wela inne user ta me privilege update karanna right ekada kiyala check
        // karanna one.
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // Me userge PRIVILEGE module permission ganna
        Privilege userPrivilege = authController.getPrivilegeByUserAndModule(authentication.getName(), "PRIVILEGE");
        if (!userPrivilege.getPrivi_update()) {
            return "Update not completed.You don't have permission..!";
        }

        // 2. need to check data existence
        // update karanna attempt karana privilege ID eka database eke innawada kiyala
        // check karanawa.
        Privilege extPrivilege = privilegeDao.getReferenceById(privilege.getId());
        if (extPrivilege == null) {
            return "Update not completed. Privilege Not Available.";
            // record ekak naththam update karanna ba
        }

        // 3. need to check duplicate
        // privilege name / code duplicate da kiyala check karanna puluwan

        // 4. try–catch block for error handling
        try {

            // 5. set auto-generated fields
            // privilege add karapu date tika update wenna ona naththam me line eka witharai
            // update karanne
            privilege.setAddeddatetime(LocalDateTime.now());

            // 6. perform update operation
            privilegeDao.save(privilege);

            // 7. handle dependencies if any
            // dependent tables update karanna wenna puluwan

            return "OK"; // update success wenawanam OK return karanawa

        } catch (Exception e) {

            // mokak hari error ekak awoth exception message return karanawa
            return "Update not completed. Some errors occurred: " + e.getMessage();
        }
    }

    @DeleteMapping(value = "/privilege/delete")
    @Override
    public String deleteData(@RequestBody Privilege privilege) {
        // @RequestBody -> frontend eken ena JSON data eka Privilege object ekakata map
        // karanawa.
        // e kiyanne request body eke thiyena fields tika automa Privilege class eke
        // fields walata bind wenawa.
        // me annotation eka naththam JSON data eka object ekakata convert wenne na.

        // 1. need to check loged user privilege
        // log wela inne user ta me privilege eka delete karanna puluwanda kiyala
        // check karanna one
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // Me userge PRIVILEGE module permission ganna
        Privilege userPrivilege = authController.getPrivilegeByUserAndModule(authentication.getName(), "PRIVILEGE");
        if (!userPrivilege.getPrivi_delete()) {
            return "Delete not completed.You don't have permission..!";
        }

        // 2. need to check data existance
        // me privilege id eka database eke innawada kiyala check karanawa
        Privilege extPrivilege = privilegeDao.getReferenceById(privilege.getId());
        if (extPrivilege == null) {
            return "Delete not completed.Privilege Not Found ..";
            // data naththam delete karanna ba
        }
        // 3.try catch
        try {
            // 4.set auto generated task

            // 5.operation
            privilegeDao.delete(privilege);
            // dependancies

            return "OK"; // delete success unama me return wenawa
        } catch (Exception e) {
            // mokak hari issue ekak awama me error message eka return wenawa
            return "Delete not completed. Some errors occurred: " + e.getMessage();
        }

    }
}