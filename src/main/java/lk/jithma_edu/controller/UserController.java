package lk.jithma_edu.controller;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.jithma_edu.dao.UserDao;
import lk.jithma_edu.entity.Privilege;
import lk.jithma_edu.entity.User;

@RestController // me class eka REST controller ekak, data send / receive karanna use wenawa
// meka nathuuwa mapping wada krn na must need
public class UserController implements CommonController<User> {

    @Autowired
    // @Autowired → Spring dependency injection.
    // Spring container eka UserDao instance ekak create karala me variable ekata
    // inject karanawa.

    private UserDao userDao;

    @Autowired
    private AuthController authController;

    @Autowired
    // user hadeddi password eka save wenne encrypt wela
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    // create get mapping for get Role all data by user url:[ /role/byuser/{userid}]
    @GetMapping(value = "/user/byid/{userid}", produces = "application/json")
    public User getRoleByUserId(@PathVariable(name = "userid") Integer userid) {
        return userDao.getReferenceById(userid);
    }

    // meka /user kiyala url ekt giyama user page eka load wenawa
    @RequestMapping("/user")
    public ModelAndView userPage() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        // me code eke aim eka: login una user ge details ganna
        // me line eken SecurityContext eken currently logged-in una user info gannawa

        // username eka hraha user object eka gnnawa
        User loggedUser = userDao.getByUsername(authentication.getName());

        // aluth ModelAndView ekak hadanawa
        ModelAndView userUI = new ModelAndView();

        // view name eka set karanawa (user.html file eka)
        userUI.setViewName("user.html");

        // login una user ge nama user ekata pass karanawa
        userUI.addObject("loggedusername", authentication.getName());

        // title set
        userUI.addObject("title", "Jithma Institute | User Management");

        // photo set
        userUI.addObject("userphoto", loggedUser.getUserphoto());

        // e page eka return karanawa browser ekata
        return userUI;
    }

    @GetMapping(value = "/user/alldata", produces = "application/json")
    @Override
    public List<User> getAllData() {
        // me method eka /user/alldata kiyala url eken call karama
        // database eke thiyena okkoma Role data return karanawa JSON format ekata.

        // Login wela thiyena user kenekda kiyala ganna
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // Me userge USER module permission ganna
        Privilege userPrivilege = authController.getPrivilegeByUserAndModule(authentication.getName(), "USER");

        // User ta PRIVI_SELECT true da kiyala check karanawa
        if (userPrivilege.getPrivi_select()) {

            // User ta select permission thiyenawa nam OKKOMA USERS return karanawa
            return userDao.getSelectedColumn();

        } else {

            // Select permission naththam empty list ekak return karanawa
            return new ArrayList<>();
        }

    }

    @PostMapping(value = "/user/insert")
    @Override
    public String saveData(@RequestBody User user) {
        // @RequestBody -> frontend eken ena JSON data eka User object ekakata map
        // karanawa.
        // e kiyanne request body eke thiyena fields tika automa User class eke
        // fields walata bind wenawa.
        // me annotation eka naththam JSON data eka object ekakata convert wenne na.

        // 1. need to check loged user privilege
        // log wela inne user ta me user eka save karanna puluwanda kiyala check
        // karanna one
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // Me userge USER module permission ganna
        Privilege userPrivilege = authController.getPrivilegeByUserAndModule(authentication.getName(), "USER");
        if (!userPrivilege.getPrivi_insert()) {
            return "Save not completed.You don't have permission..!";
        }
        // 2.need to check data existance

        User extUserByEmail = userDao.getByUserEmail(user.getEmail());
        if (extUserByEmail != null) {
            return "User Email Already Exists..";
        }
        User extUserByEmployee = userDao.getByEmployee_id(user.getEmployee_id().getId());
        if (extUserByEmployee != null) {
            return "Employee Email Already Exists..";
        }
        // 3.try catch
        try {
            // 4.set auto generated task
            user.setAddeddatetime(LocalDateTime.now());
            user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));

            // 5.operation
            userDao.save(user);
            // dependancies

            return "OK"; // post success unama me return wenawa
        } catch (Exception e) {
            // mokak hari issue ekak awama me error message eka return wenawa
            return "Save not completed. Some errors occurred: " + e.getMessage();

        }
    }

    @PutMapping(value = "/user/update")
    @Override
    public String updateData(@RequestBody User user) {
        // @RequestBody -> frontend eken ena JSON data eka User object ekakata map
        // karanawa.
        // e kiyanne request body eke thiyena fields tika automa User class eke
        // fields walata bind wenawa.
        // me annotation eka naththam JSON data eka object ekakata convert wenne na.

        // 1. need to check loged user privilege
        // log wela inne userta me operation eka karanna permission thiyanawada balanawa
        // update krnna
        // meka naththam unauthorized user kenek update karanna ba.
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // Me userge USER module permission ganna
        Privilege userPrivilege = authController.getPrivilegeByUserAndModule(authentication.getName(), "USER");
        if (!userPrivilege.getPrivi_update()) {
            return "Update not completed.You don't have permission..!";
        }

        // 2.need to check data existance
        // me user id eka database eke innawada kiyala check karanwa
        // need to chack exiistance
        User extUser = userDao.getReferenceById(user.getId());
        if (extUser == null) {
            return "Update not completed.User not found..!";
        }
        // 3. need to check duplicate
        User userByEmail = userDao.getByUserEmail(user.getEmail());
        if (userByEmail != null && userByEmail.getId() != user.getId()) {
            return "Mobile no all ready exit..! " + user.getEmail();
        }

        // 4. try–catch block for error handling
        try {
            // 5.set auto generted task
            // auto-generated values set karanawa
            // Frontend eken password naathnam DB password eka preserve karanna
            if (user.getPassword() == null || user.getPassword().trim().isEmpty()) {
                user.setPassword(extUser.getPassword());
            }

            user.setAddeddatetime(extUser.getAddeddatetime());
            user.setUpdateddatetime(LocalDateTime.now());

            // save updated user
            userDao.save(user);

            // 6.main save operation
            // userDao.save(user);
            // 7. handle dependencies
            // dependent tables update karanna wenna puluwan

            return "OK"; // update success wenawanam OK return karanawa

        } catch (Exception e) {

            // mokak hari error ekak awoth exception message return karanawa
            return "Update not completed. Some errors occurred: " + e.getMessage();
        }

    }

    @DeleteMapping(value = "/user/delete")
    @Override
    public String deleteData(@RequestBody User user) {
        // @RequestBody -> frontend eken ena JSON data eka user object ekakata map
        // karanawa.
        // e kiyanne request body eke thiyena fields tika automa user class eke
        // fields walata bind wenawa.
        // me annotation eka naththam JSON data eka object ekakata convert wenne na.

        // 1. need to check loged user privilege
        // log wela inne user ta me privilege eka delete karanna puluwanda kiyala
        // check karanna one
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // Me userge USER module permission ganna
        Privilege userPrivilege = authController.getPrivilegeByUserAndModule(authentication.getName(), "USER");
        if (!userPrivilege.getPrivi_delete()) {
            return "Delete not completed.You don't have permission..!";
        }

        // 2. need to check data existance
        // me user id eka database eke innawada kiyala check karanwa
        User extUser = userDao.getReferenceById(user.getId());
        if (extUser == null) {
            return "Delete not completed.User Not Found ..";
            // data naththam delete karanna ba
        }

        // 3.try catch
        try {
            // 4.set auto generted task
            // auto set value
            // DB password preserve karanna, null error avoid karanna
            if (extUser.getPassword() == null || extUser.getPassword().trim().isEmpty()) {
                extUser.setPassword(extUser.getPassword());
            }

            // 5.operation
            // hard delete not good
            // userDao.delete(extUser);

            // soft delete
            // methanadi delete krana kenage status eka delete kiyana ekata maru wena eka
            // wenne

            user.setDeleteddatetime(LocalDateTime.now());
            // Set deleteddatetime and status
            extUser.setDeleteddatetime(LocalDateTime.now());
            extUser.setUserstatus(false);

            // Save soft deleted user (all changes together)
            userDao.save(extUser);

            // 6.check dependancies
            return "OK"; // delete success unama me return wenawa
        } catch (Exception e) {
            // mokak hari issue ekak awama me error message eka return wenawa
            return "Delete not completed. Some errors occurred: " + e.getMessage();
        }
    }
}
