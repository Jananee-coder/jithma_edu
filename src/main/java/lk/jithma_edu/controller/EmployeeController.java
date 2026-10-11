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
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.jithma_edu.dao.EmployeeDao;
import lk.jithma_edu.dao.EmployeeStatusDao;
import lk.jithma_edu.dao.RoleDao;
import lk.jithma_edu.dao.UserDao;
import lk.jithma_edu.entity.Employee;
import lk.jithma_edu.entity.EmployeeStatus;
import lk.jithma_edu.entity.Privilege;
import lk.jithma_edu.entity.Role;
import lk.jithma_edu.entity.User;

@RestController // me class eka REST controller ekak, data send / receive karanna use wenawa
// meka nathuuwa mapping wada krn na must need
public class EmployeeController implements CommonController<Employee> {

    @Autowired
    // @Autowired → Spring dependency injection.
    // Spring container eka EmployeeDao instance ekak create karala me variable
    // ekata
    // inject karanawa.

    private EmployeeDao employeeDao;
    // authentication object ekak hadagnnawa

    @Autowired
    private AuthController authController;

    @Autowired // hama ekakatama danna ona ekkata witharak ba
    private EmployeeStatusDao employeeStatusDao;

    // get user instance
    @Autowired
    private UserDao userDao;
    // get role instance
    @Autowired
    private RoleDao roleDao;
    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    // meka /employee kiyala url ekt giyama employee page eka load wenawa
    @RequestMapping("/employee")
    public ModelAndView employeePage() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        // me code eke aim eka: login una user ge details ganna
        // me line eken SecurityContext eken currently logged-in una user info gannawa

        // username eka hraha user object eka gnnawa
        User loggedUser = userDao.getByUsername(authentication.getName());

        // aluth ModelAndView ekak hadanawa
        ModelAndView employeeUI = new ModelAndView();

        // view name eka set karanawa (employee.html file eka)
        employeeUI.setViewName("employee.html");

        // login una user ge nama employee ekata pass karanawa
        employeeUI.addObject("loggedusername", authentication.getName());

        // title set
        employeeUI.addObject("title", "Jithma Institute | Employee Management");
        // photo set
        employeeUI.addObject("userphoto", loggedUser.getUserphoto());
        // e page eka return karanawa browser ekata
        return employeeUI;
    }

    @GetMapping(value = "/employee/alldata")
    @Override
    public List<Employee> getAllData() {

        // Login wela thiyena user kenekda kiyala ganna
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        System.out.println(" Employee controller authentication "+authentication);

        // Me userge EMPLOYEE module permission ganna
        Privilege userPrivilege = authController.getPrivilegeByUserAndModule(authentication.getName(), "EMPLOYEE");

       System.out.println(" Employee controller user Privilege "+userPrivilege);

        // User ta PRIVI_SELECT true da kiyala check karanawa
        if (userPrivilege.getPrivi_select()) {

            // User ta select permission thiyenawa nam OKKOMA employees return karanawa
            return employeeDao.findAll();

        } else {

            // Select permission naththam empty list ekak return karanawa
            return new ArrayList<>();
        }
    }

    // POST mapping ekak create karala employee record insert karanna
    @PostMapping(value = "/employee/insert")
    @Override
    public String saveData(@RequestBody Employee employee) {
        // @RequestBody -> frontend eken ena JSON data eka Employee object ekakata map
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

        // Me userge EMPLOYEE module permission ganna
        Privilege userPrivilege = authController.getPrivilegeByUserAndModule(authentication.getName(), "EMPLOYEE");
        if (!userPrivilege.getPrivi_insert()) {
            return "Save not completed.You don't have permission..!";
        }

        // 2.need to check data existance
        // dmobile,email,nic wala combination Already thiyenawada kiyala check karanawa

        // mobile number ekata duplicate ekak innawada kiyala balanna
        Employee empByMobile = employeeDao.getByMobileNo(employee.getMobileno());
        if (empByMobile != null) {
            // duplicate mobile found
            return "Mobile no already exist..! " + employee.getMobileno();
        }

        // NIC number duplicate check
        Employee empByNic = employeeDao.getByNic(employee.getNic());
        if (empByNic != null) {
            return "NIC no already exist..! " + employee.getNic();
        }

        // email duplicate check
        Employee empByEmail = employeeDao.getByEmail(employee.getEmail());
        if (empByEmail != null) {
            return "Email already exist..! " + employee.getEmail();
        }
        // 3.try catch
        try {

            // 4.set auto generted task
            employee.setAddeddatetime(LocalDateTime.now()); // current date-time set karanawa

            // login wela inna userge username eka gannawa
            String username = authentication.getName();

            // username eka use karala database eken login user object eka gannawa
            User loginUserObject = userDao.getByUsername(username);

            // employee record ekata add karapu userge ID eka set karanawa
            employee.setAddeduser(loginUserObject.getId());

            // debug output - login username eka balaganna
            // System.out.println("username balamu " + username);

            // debug output - login user ID eka balaganna
            // System.out.println("user id ekth balamu " + loginUserObject.getId());

            // next employee number set karanawa (EMP00001, EMP00002 wage)
            // getNextNumber() method eka employeeDao eke implement karala thiyanna one
            employee.setEmpno(employeeDao.getNextNumber());

            // 5.main save operation
            Employee newEmployee = employeeDao.save(employee);

            // dependancies
            // create user account
            User extUserByEmail = userDao.getByUserEmail(employee.getEmail());
            if (employee.getDesignation_id().getUseraccount() && extUserByEmail == null) {

                User empUser = new User();
                // autowired(UserDao,RoleDao,BCryptPasswordEncoder)
                // save success unoth return message

                empUser.setUsername(employee.getEmpno());
                empUser.setPassword(bCryptPasswordEncoder.encode(employee.getNic()));
                empUser.setEmail(employee.getEmail());
                empUser.setUserstatus(true);
                empUser.setUserphoto(employee.getPhoto());
                empUser.setEmployee_id(newEmployee);
                empUser.setAddeddatetime(LocalDateTime.now());

                Role empRole = roleDao.getReferenceById(employee.getDesignation_id().getRoleid());
                List<Role> userRoles = new ArrayList<>();
                userRoles.add(empRole);
                empUser.setRoles(userRoles);

                userDao.save(empUser);
                System.out.println("User account created..");

            } else {
                System.out.println("User account not created.The email has a user account..");
            }

            return "OK";

        } catch (Exception exception) {
            // mokak hari exception ekak awama me message eka return karanawa
            return "Save not completed : " + exception.getMessage();
        }

    }

    // PUT mapping ekak create karala employee record update karanna
    @PutMapping(value = "/employee/update")
    @Override
    public String updateData(@RequestBody Employee employee) {
        // @RequestBody -> frontend eken ena JSON data eka Employee object ekakata map
        // karanawa.
        // e kiyanne request body eke thiyena fields tika automa Employee class eke
        // fields walata bind wenawa.
        // me annotation eka naththam JSON data eka object ekakata convert wenne na.

        // 1. need to check loged user privilege
        // log wela inne userta me operation eka karanna permission thiyanawada balanawa
        // update krnna
        // meka naththam unauthorized user kenek update karanna ba.
        // Login wela thiyena user kenekda kiyala ganna
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // Me userge EMPLOYEE module permission ganna
        Privilege userPrivilege = authController.getPrivilegeByUserAndModule(authentication.getName(), "EMPLOYEE");
        if (!userPrivilege.getPrivi_update()) {
            return "Update not completed.You don't have permission..!";
        }

        // 2.need to check data existance
        // me employee id eka database eke innawada kiyala check karanwa
        Employee extEmployee = employeeDao.getReferenceById(employee.getId());
        if (extEmployee == null) {
            return "Update not completed.Employee Not Found ..";
            // data naththam update karanna ba
        }
        // 3. need to check duplicate
        Employee empByMobile = employeeDao.getByMobileNo(employee.getMobileno());
        if (empByMobile != null && empByMobile.getId() != employee.getId()) {
            return "Mobile no all ready exit..! " + employee.getMobileno();
        }
        // create empByNic variable and get employee by using nic no
        Employee empByNic = employeeDao.getByNic(employee.getNic());
        if (empByNic != null && empByNic.getId() != employee.getId()) {
            return "Nic no all ready exit..!" + employee.getNic();
        }
        Employee empByEmail = employeeDao.getByEmail(employee.getEmail());
        if (empByEmail != null && empByEmail.getId() != employee.getId()) {
            return "Email  all ready exit..!" + employee.getEmail();
        }

        // 4. try–catch block for error handling
        try {
            // 5.set auto generted task
            // auto-generated values set karanawa
            employee.setUpdateddatetime(LocalDateTime.now());
            // employee.setUpdateduser(1);

            // 6.main save operation
            employeeDao.save(employee);

            // 7. handle dependencies
            // dependent tables update karanna wenna puluwan
            if (employee.getEmployeestatus_id().getName().equals("Working")) {
                User empuser = userDao.getByEmployee_id(extEmployee.getId());
                if (empuser != null) {

                    // Employee status eka "Working" nam,
                    // adala user ge status eka active karanawa
                    empuser.setUserstatus(Boolean.TRUE);
                    // user photo save
                    empuser.setUserphoto(employee.getPhoto());
                    userDao.save(empuser);
                }
            }

            if (employee.getEmployeestatus_id().getName().equals("Resign")
                    || employee.getEmployeestatus_id().getName().equals("Deleted")) {
                User empuser = userDao.getByEmployee_id(extEmployee.getId());
                if (empuser != null) {
                    // user photo save
                    empuser.setUserphoto(employee.getPhoto());
                    // Employee status eka "Resign" hari "Deleted" nam,
                    // adala user ge status eka inactive karanawa
                    empuser.setUserstatus(Boolean.FALSE);
                    userDao.save(empuser);
                }
            }

            return "OK"; // update success wenawanam OK return karanawa

        } catch (Exception e) {

            // mokak hari error ekak awoth exception message return karanawa
            return "Update not completed. Some errors occurred: " + e.getMessage();
        }
    }

    // DELETE mapping ekak create karala employee record delete karanna
    @DeleteMapping(value = "/employee/delete")
    @Override
    public String deleteData(@RequestBody Employee employee) {
        // @RequestBody -> frontend eken ena JSON data eka Employee object ekakata map
        // karanawa.
        // e kiyanne request body eke thiyena fields tika automa Employee class eke
        // fields walata bind wenawa.
        // me annotation eka naththam JSON data eka object ekakata convert wenne na.

        // 1. need to check loged user privilege
        // log wela inne userta me operation eka karanna permission thiyanawada balanawa
        // save krnna
        // meka naththam unauthorized user kenek delete karanna ba.
        // Login wela thiyena user kenekda kiyala ganna
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // Me userge EMPLOYEE module permission ganna
        Privilege userPrivilege = authController.getPrivilegeByUserAndModule(authentication.getName(), "EMPLOYEE");
        if (!userPrivilege.getPrivi_delete()) {
            return "Delete not completed.You don't have permission..!";
        }

        // 2.need to check data existance
        // me employee id eka database eke innawada kiyala check karanwa
        Employee extEmployee = employeeDao.getReferenceById(employee.getId());
        if (extEmployee == null) {
            return "Delete not completed.Employee Not Found ..";
            // data naththam delete karanna ba
        }
        // 3.try catch
        try {
            // 4.set auto generted task

            // 5.operation
            // hard delete not good
            // employeeDao.delete(employee);

            // soft delete
            // methanadi delete krana kenage status eka delete kiyana ekata maru wena eka
            // wenne

            // soft delete
            // methanadi delete krana kenage status eka delete kiyana ekata maru wena eka
            // wenne
            EmployeeStatus deleteStatus = employeeStatusDao.getReferenceById(3);
            extEmployee.setEmployeestatus_id(deleteStatus);

            System.out.println(extEmployee);
            employeeDao.save(extEmployee);
            employee.setDeleteddatetime(LocalDateTime.now());

            // 6.check dependancies
            User empuser = userDao.getByEmployee_id(extEmployee.getId());
            if (empuser != null) {
                // Employee kenekta adala user kenek innoth,
                // e user ge status eka inactive karanawa
                empuser.setUserstatus(Boolean.FALSE);
                userDao.save(empuser);
            }

            return "OK"; // delete success unama me return wenawa
        } catch (Exception e) {
            // mokak hari issue ekak awama me error message eka return wenawa
            return "Delete not completed. Some errors occurred: " + e.getMessage();
        }
    }

    // create get mapping for get employee list without user
    // account[/employee/listwithoutuseraccount]
    @GetMapping(value = "/employee/listwithoutuseraccount", produces = "application/json")
    public List<Employee> getemployeeListWithoutUserAccount() {
        return employeeDao.getemployeeListWithoutUserAccount();
    }
}
