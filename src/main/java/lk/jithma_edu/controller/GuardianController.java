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

import lk.jithma_edu.dao.GuardianDao;
import lk.jithma_edu.dao.GuardianStatusDao;
import lk.jithma_edu.dao.UserDao;
import lk.jithma_edu.entity.Guardian;
import lk.jithma_edu.entity.GuardianStatus;
import lk.jithma_edu.entity.Privilege;
import lk.jithma_edu.entity.User;

@RestController // me class eka REST controller ekak, data send / receive karanna use wenawa
// meka nathuuwa mapping wada krn na must need
public class GuardianController implements CommonController<Guardian> {

    @Autowired
    // @Autowired → Spring dependency injection.
    // Spring container eka GuardianDao instance ekak create karala me variable
    // ekata
    // inject karanawa.
    private GuardianDao guardianDao;

    @Autowired // hama ekakatama danna ona ekkata witharak ba
    private GuardianStatusDao guardianStatusDao;

    @Autowired // get authentication instance
    private AuthController authController;

    // get user instance
    @Autowired
    private UserDao userDao;

    // meka /guardian kiyala url ekt giyama guardian page eka load wenawa
    @RequestMapping("/guardian")
    public ModelAndView guardianPage() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        // me code eke aim eka: login una user ge details ganna
        // me line eken SecurityContext eken currently logged-in una user info gannawa

        // username eka hraha user object eka gnnawa
        User loggedUser = userDao.getByUsername(authentication.getName());

        // aluth ModelAndView ekak hadanawa
        ModelAndView guardianUI = new ModelAndView();

        // view name eka set karanawa (guardian.html file eka)
        guardianUI.setViewName("guardian.html");

        // login una user ge nama guardain ekata pass karanawa
        guardianUI.addObject("loggedusername", authentication.getName());

        // title set
        guardianUI.addObject("title", "Jithma Institute | Guardian Management");

        // photo set
        guardianUI.addObject("userphoto", loggedUser.getUserphoto());

        // e page eka return karanawa browser ekata
        return guardianUI;
    }

    @GetMapping(value = "/guardian/alldata")
    @Override
    public List<Guardian> getAllData() {

        // Login wela thiyena user kenekda kiyala ganna
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // Me userge GUARDIAN module permission ganna
        Privilege userPrivilege = authController.getPrivilegeByUserAndModule(authentication.getName(), "GUARDIAN");

        // User ta PRIVI_SELECT true da kiyala check karanawa
        if (userPrivilege.getPrivi_select()) {

            // User ta select permission thiyenawa nam
            // database eken guardian table eke thiyena okkoma records return karanawa
            return guardianDao.findAll();

        } else {

            // Select permission naththam empty list ekak return karanawa
            return new ArrayList<>();
        }

    }

    // POST mapping ekak create karala guadrian record insert karanna
    @PostMapping(value = "/guardian/insert")
    @Override
    public String saveData(@RequestBody Guardian guardian) {
        // @RequestBody -> frontend eken ena JSON data eka Guardian object ekakata map
        // karanawa.
        // JSON fields tika automatically Guardian class fields walata bind wenawa.
        // Me annotation eka naththam JSON convert wenne naha.

        // 1. need to check loged user privilege
        // log wela inne userta me operation eka karanna permission thiyanawada balanawa
        // save krnna
        // meka naththam unauthorized user kenek save karanna ba.
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // Me userge GUARDIAN module permission ganna
        Privilege userPrivilege = authController.getPrivilegeByUserAndModule(authentication.getName(), "GUARDIAN");
        if (!userPrivilege.getPrivi_insert()) {
            return "Save not completed.You don't have permission..!";
        }
        // 2.need to check data existance
        // dmobile,email,nic wala combination Already thiyenawada kiyala check karanawa

        // mobile number ekata duplicate ekak innawada kiyala balanna
        Guardian gudByMobile = guardianDao.getGuardianNo(guardian.getMobileno());
        if (gudByMobile != null) {
            // duplicate mobile found
            return "Mobile no already exist..! " + guardian.getMobileno();
        }

        // NIC number duplicate check
        Guardian gudByNic = guardianDao.getGuardianNic(guardian.getNic());
        if (gudByNic != null) {
            // duplicate nic found
            return "NIC no already exist..! " + guardian.getNic();
        }
        // 3.try catch
        try {

            // 4.set auto generted task
            guardian.setAddeddatetime(LocalDateTime.now()); // current date-time set karanawa

            // login wela inna userge username eka gannawa
            String username = authentication.getName();

            // username eka use karala database eken login user object eka gannawa
            User loginUserObject = userDao.getByUsername(username);

            // guardian record ekata add karapu userge ID eka set karanawa
            guardian.setAddeduser(loginUserObject.getId());

            // 5.main save operation
            guardianDao.save(guardian);

            // save success unoth return message
            return "OK";

        } catch (Exception exception) {
            // mokak hari exception ekak awama me message eka return karanawa
            return "Save not completed : " + exception.getMessage();
        }
    }

    // PUT mapping ekak create karala guardian record update karanna
    @PutMapping(value = "/guardian/update")
    @Override
    public String updateData(@RequestBody Guardian guardian) {
        // @RequestBody -> frontend eken ena JSON data eka Guardian object ekakata map
        // karanawa.
        // JSON fields tika automatically Guardian class fields walata bind wenawa.
        // Me annotation eka naththam JSON convert wenne naha.

        // 1. need to check loged user privilege
        // log wela inne userta me operation eka karanna permission thiyanawada balanawa
        // update krnna
        // meka naththam unauthorized user kenek update karanna ba.
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // Me userge GUARDIAN module permission ganna
        Privilege userPrivilege = authController.getPrivilegeByUserAndModule(authentication.getName(), "GUARDIAN");
        if (!userPrivilege.getPrivi_update()) {
            return "Update not completed.You don't have permission..!";
        }

        // 2.need to check data existance
        // me guardian id eka database eke innawada kiyala check karanwa
        Guardian extGuardian = guardianDao.getReferenceById(guardian.getId());
        if (extGuardian == null) {
            return "Update not completed.Guardian Not Found ..";
        }
        // 3. need to check duplicate
        // mobile number ekata duplicate ekak innawada kiyala balanna
        Guardian gudByMobile = guardianDao.getGuardianNo(guardian.getMobileno());
        if (gudByMobile != null && gudByMobile.getId() != guardian.getId()) {
            // duplicate mobile found
            return "Mobile no already exist..! " + guardian.getMobileno();
        }

        // NIC number duplicate check
        Guardian gudByNic = guardianDao.getGuardianNic(guardian.getNic());
        if (gudByNic != null && gudByNic.getId() != guardian.getId()) {
            // duplicate nic found
            return "NIC no already exist..! " + guardian.getNic();
        }
        // 4. try–catch block for error handling
        try {
            // 5.set auto generted task
            // auto-generated values set karanawa
            guardian.setUpdateddeletetime(LocalDateTime.now());
            // guardian.setUpdateduser(1);

            // 6.main save operation
            guardianDao.save(guardian);

            // 7. handle dependencies
            // dependent tables update karanna wenna puluwan

            return "OK"; // update success wenawanam OK return karanawa

        } catch (Exception e) {

            // mokak hari error ekak awoth exception message return karanawa
            return "Update not completed. Some errors occurred: " + e.getMessage();
        }
    }

    @DeleteMapping(value = "/guardian/delete")
    @Override
    public String deleteData(@RequestBody Guardian guardian) {
        // @RequestBody -> frontend eken ena JSON data eka Guardian object ekakata map
        // karanawa.
        // JSON fields tika automatically Guardian class fields walata bind wenawa.
        // Me annotation eka naththam JSON convert wenne naha.

        // 1. need to check loged user privilege
        // log wela inne user ta me gurdaian eka delete karanna puluwanda kiyala
        // check karanna one
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // Me userge GUARDIAN module permission ganna
        Privilege userPrivilege = authController.getPrivilegeByUserAndModule(authentication.getName(), "GUARDIAN");
        if (!userPrivilege.getPrivi_delete()) {
            return "Delete not completed.You don't have permission..!";
        }

        // 2. need to check data existance
        // me guardian id eka database eke innawada kiyala check karanwa
        Guardian extGuardian = guardianDao.getReferenceById(guardian.getId());
        if (extGuardian == null) {
            return "Delete not completed.Guardian Not Found ..";
            // data naththam delete karanna ba
        }

        // 3.try catch
        try {
            // 4.set auto generted task

            // 5.operation
            // hard delete not good
            // guardianDao.delete(guardian);

            // soft delete
            // methanadi delete krana kenage status eka delete kiyana ekata maru wena eka
            // wenne
            GuardianStatus deleteStatus = guardianStatusDao.getReferenceById(2);
            extGuardian.setGuardianstatus_id(deleteStatus);

            System.out.println(extGuardian);
            guardianDao.save(extGuardian);
            guardian.setDeleteddatetime(LocalDateTime.now());

            // 6.check dependancies
            return "OK"; // delete success unama me return wenawa
        } catch (Exception e) {
            // mokak hari issue ekak awama me error message eka return wenawa
            return "Delete not completed. Some errors occurred: " + e.getMessage();
        }
    }

}
