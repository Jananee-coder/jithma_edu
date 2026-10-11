package lk.jithma_edu.controller;

import java.util.List;

import org.springframework.security.core.Authentication;

import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.jithma_edu.dao.RoleDao;
import lk.jithma_edu.dao.UserDao;
import lk.jithma_edu.entity.Role;

@RestController // me class eka REST controller ekak, data send / receive karanna use wenawa
// meka nathuuwa mapping wada krn na must need
public class RoleController {
    @Autowired
    // @Autowired → Spring dependency injection.
    // Spring container eka RoleDao instance ekak create karala me variable ekata
    // inject karanawa.

    private RoleDao roleDao;

    @Autowired
    private UserDao userDao;

    @GetMapping(value = "/role/alldata", produces = "application/json")
    public List<Role> getAllData() {

        // me method eka /role/alldata kiyala url eken call karama
        // database eke thiyena okkoma Role data return karanawa JSON format ekata.

        return roleDao.findAll(); // DB eken okkoma records gannawa
    }

    // GET request ekak role data gananna, admin role eka hariyata exclude karala
    @GetMapping(value = "/role/alldatawithoutadmin", produces = "application/json")
    public List<Role> getRolesWithoutAdmin() {

        // roleDao use karala admin role ekak hariyata exclude karala role list eka
        // return karanawa
        return roleDao.getAllRolesWithoutAdmin();
    }

    @GetMapping(value = "/role/byuser/{userid}", produces = "application/json")
    public List<Role> getRoleByUserId(@PathVariable(name = "userid") Integer userid) {
        return roleDao.getRoleByUserId(userid);
    }

    @RequestMapping(value = "/rolecheck/whatisloggeduserrole")
    public String getLoggedUserRole() {

        // Currently login wela inna userge authentication details gannawa
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // Login username eka use karala userge role eka database eken gannawa
        String loggedUserRole = userDao.getUserRoleByUserName(authentication.getName());

        // User role eka console eke display karanawa
        System.out.println(loggedUserRole);

        // Logged user role eka frontend ekata return karanawa
        return loggedUserRole;

    }
}
