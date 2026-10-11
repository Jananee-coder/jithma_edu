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

import lk.jithma_edu.dao.HallDao;
import lk.jithma_edu.dao.HallStatusDao;
import lk.jithma_edu.dao.UserDao;
import lk.jithma_edu.entity.Hall;
import lk.jithma_edu.entity.HallStatus;
import lk.jithma_edu.entity.Privilege;
import lk.jithma_edu.entity.User;

@RestController // me class eka REST controller ekak, data send / receive karanna use wenawa
// meka nathuuwa mapping wada krn na must need
public class HallController implements CommonController<Hall> {

    @Autowired
    // @Autowired → Spring dependency injection.
    // Spring container eka HallDao instance ekak create karala me variable
    // ekata
    // inject karanawa.
    private HallDao hallDao;

    @Autowired // hama ekakatama danna ona ekkata witharak ba
    private HallStatusDao hallStatusDao;

    @Autowired // get authentication instance
    private AuthController authController;

    // get user instance
    @Autowired
    private UserDao userDao;

    // meka /hall kiyala url ekt giyama hall page eka load wenawa
    @RequestMapping("/hall")
    public ModelAndView hallPage() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        // me code eke aim eka: login una user ge details ganna
        // me line eken SecurityContext eken currently logged-in una user info

        // username eka hraha user object eka gnnawa
        User loggedUser = userDao.getByUsername(authentication.getName());

        // aluth ModelAndView ekak hadanawa
        ModelAndView hallUI = new ModelAndView();

        // view name eka set karanawa (hall.html file eka)
        hallUI.setViewName("hall.html");

        // login una user ge nama hall ekata pass karanawa
        hallUI.addObject("loggedusername", authentication.getName());

        // title set
        hallUI.addObject("title", "Jithma Institute | Hall Management");

        // photo set
        hallUI.addObject("userphoto", loggedUser.getUserphoto());

        // e page eka return karanawa browser ekata
        return hallUI;
    }

    @GetMapping(value = "/hall/alldata")
    @Override
    public List<Hall> getAllData() {
        // Login wela thiyena user kenekda kiyala ganna
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // Me userge HALL module permission ganna
        Privilege userPrivilege = authController.getPrivilegeByUserAndModule(authentication.getName(), "HALL");

        // User ta PRIVI_SELECT true da kiyala check karanawa
        if (userPrivilege.getPrivi_select()) {

            // User ta select permission thiyenawa nam
            // database eken hall table eke thiyena okkoma records return karanawa
            return hallDao.findAll();

        } else {

            // Select permission naththam empty list ekak return karanawa
            return new ArrayList<>();
        }

    }

    // POST mapping ekak create karala hall record insert karanna
    @PostMapping(value = "/hall/insert")
    @Override
    public String saveData(@RequestBody Hall hall) {
        // @RequestBody -> frontend eken ena JSON data eka Hall object ekakata
        // map karanawa.
        // e kiyanne request body eke thiyena fields tika automa Hall class eke
        // fields walata bind wenawa.
        // me annotation eka naththam JSON data eka object ekakata convert wenne na.

        // 1. need to check loged user privilege
        // log wela inne userta me operation eka karanna permission thiyanawada balanawa
        // save krnna
        // meka naththam unauthorized user kenek save karanna ba.
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // Me userge HALL module permission ganna
        Privilege userPrivilege = authController.getPrivilegeByUserAndModule(authentication.getName(), "HALL");
        if (!userPrivilege.getPrivi_insert()) {
            return "Save not completed.You don't have permission..!";
        }

        // 2.need to check data existance
        Hall hallByName = hallDao.getHallName(hall.getName());
        if (hallByName != null) {
            return "Hall name already exist..! " + hall.getName();
        }

        // 3.try catch
        try {

            // 4.set auto generted task
            hall.setAddeddatetime(LocalDateTime.now()); // current date-time set karanawa

            // login wela inna userge username eka gannawa
            String username = authentication.getName();

            // username eka use karala database eken login user object eka gannawa
            User loginUserObject = userDao.getByUsername(username);

            // hall record ekata add karapu userge ID eka set karanawa
            hall.setAddeduser(loginUserObject.getId());

            // 5.main save operation
            hallDao.save(hall);

            // save success unoth return message
            return "OK";

        } catch (Exception exception) {
            // mokak hari exception ekak awama me message eka return karanawa
            return "Save not completed : " + exception.getMessage();
        }
    }

    // PUT mapping ekak create karala hall record update karanna
    @PutMapping(value = "/hall/update")
    @Override
    public String updateData(@RequestBody Hall hall) {
        // @RequestBody -> frontend eken ena JSON data eka hall object ekakata map
        // karanawa.
        // e kiyanne request body eke thiyena fields tika automa Hall class eke
        // fields walata bind wenawa.
        // me annotation eka naththam JSON data eka object ekakata convert wenne na.

        // 1. need to check loged user privilege
        // log wela inne user ta me gurdaian eka delete karanna puluwanda kiyala
        // check karanna one
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // Me userge HALL module permission ganna
        Privilege userPrivilege = authController.getPrivilegeByUserAndModule(authentication.getName(), "HALL");
        if (!userPrivilege.getPrivi_update()) {
            return "Update not completed.You don't have permission..!";
        }
        // 2. need to check data existance
        // me hall id eka database eke innawada kiyala check karanwa
        Hall exHall = hallDao.getReferenceById(hall.getId());
        if (exHall == null) {
            return "Update not completed.Hall Not Found ..";
            // data naththam delete karanna ba

        }
        // 3. need to check duplicate
        Hall hallByName = hallDao.getHallName(hall.getName());
        if (hallByName != null && hallByName.getId() != hall.getId()) {
            // duplicate hall name found
            return "Hall name  already exist..! " + hall.getName();
        }

        // 4. try–catch block for error handling
        try {
            // 5.set auto generted task
            // auto-generated values set karanawa
            hall.setUpdateddatetime(LocalDateTime.now());
            // hall.setUpdateduser(1);

            // 6.main save operation
            hallDao.save(hall);

            // 7. handle dependencies
            // dependent tables update karanna wenna puluwan

            return "OK"; // update success wenawanam OK return karanawa

        } catch (Exception e) {

            // mokak hari error ekak awoth exception message return karanawa
            return "Update not completed. Some errors occurred: " + e.getMessage();
        }
    }

    @DeleteMapping(value = "/hall/delete")
    @Override
    public String deleteData(@RequestBody Hall hall) {
        // @RequestBody -> frontend eken ena JSON data eka hall object ekakata map
        // karanawa.
        // e kiyanne request body eke thiyena fields tika automa Hall class eke
        // fields walata bind wenawa.
        // me annotation eka naththam JSON data eka object ekakata convert wenne na.

        // 1. need to check loged user privilege
        // log wela inne user ta me gurdaian eka delete karanna puluwanda kiyala
        // check karanna one
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // Me userge HALL module permission ganna
        Privilege userPrivilege = authController.getPrivilegeByUserAndModule(authentication.getName(), "HALL");
        if (!userPrivilege.getPrivi_delete()) {
            return "Delete not completed.You don't have permission..!";
        }

        // 2. need to check data existance
        // me hall id eka database eke innawada kiyala check karanwa
        Hall exHall = hallDao.getReferenceById(hall.getId());
        if (exHall == null) {
            return "Delete not completed.Hall Not Found ..";
            // data naththam delete karanna ba
        }

        // 3.try catch
        try {
            // 4.set auto generted task

            // 5.operation
            // hard delete not good
            // hallDao.delete();

            // soft delete
            // methanadi delete krana kenage status eka delete kiyana ekata maru wena eka
            // wenne
            HallStatus deleteStatus = hallStatusDao.getReferenceById(2);
            exHall.setHallstatus_id(deleteStatus);

            System.out.println(exHall);
            hallDao.save(exHall);

            // 6.check dependancies
            return "OK"; // delete success unama me return wenawa
        } catch (Exception e) {
            // mokak hari issue ekak awama me error message eka return wenawa
            return "Delete not completed. Some errors occurred: " + e.getMessage();
        }
    }

}
