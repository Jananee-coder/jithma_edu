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

import lk.jithma_edu.dao.AllocationStatusDao;
import lk.jithma_edu.dao.HallAllocationDao;
import lk.jithma_edu.dao.UserDao;
import lk.jithma_edu.entity.AllocationStatus;
import lk.jithma_edu.entity.HallAllocation;
import lk.jithma_edu.entity.Privilege;
import lk.jithma_edu.entity.User;

@RestController // me class eka REST controller ekak, data send / receive karanna use wenawa
// meka nathuuwa mapping wada krn na must need
public class HallAllocationController implements CommonController<HallAllocation> {

    @Autowired
    // @Autowired → Spring dependency injection.
    // Spring container eka hallAllocationDao instance ekak create karala me
    // variable
    // ekata
    // inject karanawa.
    private HallAllocationDao hallAllocationDao;

    @Autowired // hama ekakatama danna ona ekkata witharak ba
    private AllocationStatusDao allocationStatusDao;

    @Autowired // get authentication instance
    private AuthController authController;

    // get user instance
    @Autowired
    private UserDao userDao;

    // meka /hallallocation kiyala url ekt giyama hall allocation page eka load
    // wenawa
    @RequestMapping("/hallallocation")
    public ModelAndView hallAllocationPage() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        // me code eke aim eka: login una user ge details ganna
        // me line eken SecurityContext eken currently logged-in una user info gannawa

        // username eka hraha user object eka gnnawa
        User loggedUser = userDao.getByUsername(authentication.getName());

        // aluth ModelAndView ekak hadanawa
        ModelAndView hallAllocationUI = new ModelAndView();

        // view name eka set karanawa (hallallocation.html file eka)
        hallAllocationUI.setViewName("hallallocation.html");

        // login una user ge nama hall ekata pass karanawa
        hallAllocationUI.addObject("loggedusername", authentication.getName());

        // title set
        hallAllocationUI.addObject("title", "Jithma Institute | Hall Allocation Management");
        // photo set
        hallAllocationUI.addObject("userphoto", loggedUser.getUserphoto());
        // e page eka return karanawa browser ekata
        return hallAllocationUI;
    }

    @GetMapping(value = "hallallocation/alldata")
    @Override
    public List<HallAllocation> getAllData() {
        // Login wela thiyena user kenekda kiyala ganna
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // Me userge HALL ALLOCATION module permission ganna
        Privilege userPrivilege = authController.getPrivilegeByUserAndModule(authentication.getName(),
                "HALLALLOCATION");

        // User ta PRIVI_SELECT true da kiyala check karanawa
        if (userPrivilege.getPrivi_select()) {

            // User ta select permission thiyenawa nam OKKOMA hall allocations return
            // karanawa
            return hallAllocationDao.findAll();

        } else {

            // Select permission naththam empty list ekak return karanawa
            return new ArrayList<>();
        }
    }

    @PostMapping(value = "/hallallocation/insert")
    @Override
    public String saveData(@RequestBody HallAllocation hallAllocation) {

        // @RequestBody -> frontend eken ena JSON data eka hallAllocation object ekakata
        // map karanawa.
        // e kiyanne request body eke thiyena fields tika automa HallAllocation class
        // eke
        // fields walata bind wenawa.
        // me annotation eka naththam JSON data eka object ekakata convert wenne na.

        // 1. need to check loged user privilege
        // log wela inne user ta me hallallocation eka delete karanna puluwanda kiyala
        // check karanna one
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // Me userge HALL ALLOCATION module permission ganna
        Privilege userPrivilege = authController.getPrivilegeByUserAndModule(authentication.getName(),
                "HALLALLOCATION");
        if (!userPrivilege.getPrivi_insert()) {
            return "Save not completed.You don't have permission..!";
        }

        // 2.need to check data existance
        HallAllocation exHallAllocation = hallAllocationDao.getByExactAllocation(
                hallAllocation.getHall_id().getId(),
                hallAllocation.getWeekday_id().getId(),
                hallAllocation.getStarttime());

        if (exHallAllocation != null && !exHallAllocation.getId().equals(hallAllocation.getId())) {
            return "Hall already booked for this time..!";
        }
        // 3.try catch
        try {

            // 4.set auto generted task
            hallAllocation.setAddeddatetime(LocalDateTime.now()); // current date-time set karanawa

            // login wela inna userge username eka gannawa
            String username = authentication.getName();

            // username eka use karala database eken login user object eka gannawa
            User loginUserObject = userDao.getByUsername(username);

            // hallAllocation record ekata add karapu userge ID eka set karanawa
            hallAllocation.setAddeduser(loginUserObject.getId());

            // 5.main save operation
            hallAllocationDao.save(hallAllocation);

            // save success unoth return message
            return "OK";

        } catch (Exception exception) {
            // mokak hari exception ekak awama me message eka return karanawa
            return "Save not completed : " + exception.getMessage();
        }
    }

    @PutMapping(value = "/hallallocation/update")
    @Override
    public String updateData(@RequestBody HallAllocation hallAllocation) {

        // @RequestBody -> frontend eken ena JSON data eka hallAllocation object ekakata
        // map karanawa.
        // e kiyanne request body eke thiyena fields tika automa HallAllocation class
        // eke
        // fields walata bind wenawa.
        // me annotation eka naththam JSON data eka object ekakata convert wenne na.

        // 1. need to check loged user privilege
        // log wela inne user ta me hallallocation eka delete karanna puluwanda kiyala
        // check karanna one
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // Me userge HALL ALLOCATION module permission ganna
        Privilege userPrivilege = authController.getPrivilegeByUserAndModule(authentication.getName(),
                "HALLALLOCATION");
        if (!userPrivilege.getPrivi_update()) {
            return "Update not completed.You don't have permission..!";
        }
        // 2. need to check data existance
        // me hallallocation id eka database eke innawada kiyala check karanwa
        HallAllocation extHallAllocation = hallAllocationDao.getReferenceById(hallAllocation.getId());
        if (extHallAllocation == null) {
            return "Update not completed.Hall Not Found ..";
            // data naththam delete karanna ba

        }
        // 3. need to check duplicate
        HallAllocation exHallAllocation = hallAllocationDao.getByExactAllocation(
                hallAllocation.getHall_id().getId(),
                hallAllocation.getWeekday_id().getId(),
                hallAllocation.getStarttime());

        if (exHallAllocation != null &&
                exHallAllocation.getId() != hallAllocation.getId()) {

            return "Hall already booked for this time..!";
        }

        // 4. try–catch block for error handling
        try {
            // 5.set auto generted task
            // auto-generated values set karanawa
            hallAllocation.setUpdateddatetime(LocalDateTime.now());
            // hallAllocation.setUpdateduser(1);

            // 6.main save operation
            hallAllocationDao.save(hallAllocation);

            // 7. handle dependencies
            // dependent tables update karanna wenna puluwan

            return "OK"; // update success wenawanam OK return karanawa

        } catch (Exception e) {

            // mokak hari error ekak awoth exception message return karanawa
            return "Update not completed. Some errors occurred: " + e.getMessage();
        }
    }

    @DeleteMapping(value = "/hallallocation/delete")
    @Override
    public String deleteData(@RequestBody HallAllocation hallAllocation) {

        // @RequestBody -> frontend eken ena JSON data eka hallAllocation object ekakata
        // map karanawa.
        // e kiyanne request body eke thiyena fields tika automa HallAllocation class
        // eke
        // fields walata bind wenawa.
        // me annotation eka naththam JSON data eka object ekakata convert wenne na.

        // 1. need to check loged user privilege
        // log wela inne user ta me hallallocation eka delete karanna puluwanda kiyala
        // check karanna one
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // Me userge HALL ALLOCATION module permission ganna
        Privilege userPrivilege = authController.getPrivilegeByUserAndModule(authentication.getName(),
                "HALLALLOCATION");
        if (!userPrivilege.getPrivi_delete()) {
            return "Delete not completed.You don't have permission..!";
        }

        // 2. need to check data existance
        // me hallallocation id eka database eke innawada kiyala check karanwa
        HallAllocation exHallAllocation = hallAllocationDao.getReferenceById(hallAllocation.getId());
        if (exHallAllocation == null) {
            return "Delete not completed.Hall Allocation Not Found ..";
            // data naththam delete karanna ba
        }

        // 3.try catch
        try {

            // 4.set auto generated task

            // 5.operation
            // hard delete not good
            // hallAllocationDao.delete();

            // soft delete
            // methanadi delete krana kenage status eka delete kiyana ekata maru wena eka
            // wenne

            AllocationStatus deleteStatus = allocationStatusDao.getReferenceById(2);
            exHallAllocation.setAllocationstatus_id(deleteStatus);

            hallAllocation.setDeleteddatetime(LocalDateTime.now());
            System.out.println(exHallAllocation);
            hallAllocationDao.save(exHallAllocation);

            // 6.check dependancies
            return "OK"; // delete success unama me return wenawa

        } catch (Exception e) {
            // mokak hari issue ekak awama me error message eka return wenawa
            return "Delete not completed. Some errors occurred: " + e.getMessage();
        }
    }
}
