package lk.jithma_edu.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lk.jithma_edu.dao.ModuleDao;
import lk.jithma_edu.dao.PrivilegeDao;
import lk.jithma_edu.dao.UserDao;
import lk.jithma_edu.entity.Privilege;
import lk.jithma_edu.entity.User;
import lk.jithma_edu.entity.Module;

@RestController
public class AuthController {

    @Autowired
    private PrivilegeDao privilegeDao;

    // get user instance
    @Autowired
    private UserDao userDao;

    // get module instance
    @Autowired
    private ModuleDao moduleDao;

    // logged user ta adala modules load karana endpoint eka
    @GetMapping(value = "/loggedusermodule")
    public List<Module> getLoggedUserModule() {

        // currently login wela inna user ge authentication details gannawa
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // authentication object eken username aran database eken logged user object eka
        // gannawa
        User loggedUser = userDao.getByUsername(auth.getName());

        // logged user ge roles walin ekak Admin nam
        // Admin ta module permissions apply karanne na
        // empty list ekak return karanawa nisa frontend eke modules okkoma display
        // wenawa
        if (loggedUser.getRoles()
                .stream()
                .anyMatch(role -> role.getName().equals("Admin"))) {

            return new ArrayList<Module>();

        } else

            // Admin neme nam
            // logged user ge id eka repository ekata yawala
            // e user ta adala modules database eken gannawa
            return moduleDao.getModuleByLoggedUser(loggedUser.getId());
    }

    @GetMapping(value = "/userprivilegebymodule", params = { "modulename" })
    // ================= FRONTEND =================
    // Logged in user kenekuta module ekata adalawa privileges ganna endpoint eka
    // Example: GET /userprivilegebymodule?modulename=EMPLOYEE
    public Privilege getPrivilegeByModule(@RequestParam("modulename") String modulename) {
        // Login una userge username eka ganna
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // Backend method call karala Privilege object eka ganna
        return getPrivilegeByUserAndModule(auth.getName(), modulename);
    }

    // ================= BACKEND =================
    // Username + module name adalawa Privilege object ekak return karanawa
    public Privilege getPrivilegeByUserAndModule(String username, String modulename) {

        // Privilege object ekak create karanawa
        Privilege privilege = new Privilege();
        // ===== Admin user ekata full access =====
        if (username.equalsIgnoreCase("admin")) {
            privilege.setPrivi_select(Boolean.TRUE);
            privilege.setPrivi_insert(Boolean.TRUE);
            privilege.setPrivi_update(Boolean.TRUE);
            privilege.setPrivi_delete(Boolean.TRUE);
        } else {

            // ===== Normal user ekata =====
            // DB eken permission string ekak ganna
            // Example DB result -> "1,0,1,0" (select, insert, update, delete)
            String privi = privilegeDao.getPrivilegeByUserAndModule(username, modulename);
            String[] privleges = privi.split(",");

            privilege.setPrivi_select(privleges[0].equals("1"));
            privilege.setPrivi_insert(privleges[1].equals("1"));
            privilege.setPrivi_update(privleges[2].equals("1"));
            privilege.setPrivi_delete(privleges[3].equals("1"));

        }

        return privilege;
    }
}
