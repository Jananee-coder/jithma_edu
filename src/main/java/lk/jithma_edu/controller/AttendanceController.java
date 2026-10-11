package lk.jithma_edu.controller;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
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
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.jithma_edu.dao.AttendanceDao;
import lk.jithma_edu.dao.UserDao;
import lk.jithma_edu.entity.Attendance;
import lk.jithma_edu.entity.Privilege;
import lk.jithma_edu.entity.User;

@RestController // me class eka REST controller ekak, data send / receive karanna use wenawa
// meka nathuuwa mapping wada krn na must need
public class AttendanceController implements CommonController<Attendance> {

    @Autowired
    // @Autowired → Spring dependency injection.
    // Spring container eka AttendanceDao instance ekak create karala me variable
    // ekata
    // inject karanawa.
    private AttendanceDao attendanceDao;

    // authentication object ekak hadagnnawa
    @Autowired
    private AuthController authController;

    // get user instance
    @Autowired
    private UserDao userDao;

    // meka /attendance kiyala url ekt giyama attendance page eka load wenawa
    @RequestMapping("/attendance")
    public ModelAndView classDetailPage() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        // me code eke aim eka: login una user ge details ganna
        // me line eken SecurityContext eken currently logged-in una user info gannawa

        // username eka hraha user object eka gnnawa
        User loggedUser = userDao.getByUsername(authentication.getName());

        // aluth ModelAndView ekak hadanawa
        ModelAndView attendanceUI = new ModelAndView();

        // view name eka set karanawa (attendance.html file eka)
        attendanceUI.setViewName("attendance.html");

        // login una user ge nama attendence ekata pass karanawa
        attendanceUI.addObject("loggedusername", authentication.getName());

        // title set
        attendanceUI.addObject("title", "Jithma Institute | Attendance Management");
        // photo set
        attendanceUI.addObject("userphoto", loggedUser.getUserphoto());

        // e page eka return karanawa browser ekata
        return attendanceUI;
    }

    @GetMapping(value = "/attendance/alldata")
    @Override
    public List<Attendance> getAllData() {
        // Login wela thiyena user kenekda kiyala ganna
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // Me userge ATTENDANCE module permission ganna
        Privilege userPrivilege = authController.getPrivilegeByUserAndModule(authentication.getName(), "ATTENDANCE");

        // User ta PRIVI_SELECT true da kiyala check karanawa
        if (userPrivilege.getPrivi_select()) {

            // User ta select permission thiyenawa nam OKKOMA attendance return karanawa
            return attendanceDao.findAll();

        } else {

            // Select permission naththam empty list ekak return karanawa
            return new ArrayList<>();
        }
    }

    @PostMapping(value = "/attendance/insert")
    @Override
    public String saveData(@RequestBody Attendance attendance) {
        // @RequestBody -> frontend eken ena JSON data eka Attendance object ekakata
        // map karanawa.
        // e kiyanne request body eke thiyena fields tika automa Attendance class eke
        // fields walata bind wenawa.
        // me annotation eka naththam JSON data eka object ekakata convert wenne na.

        // 1. need to check loged user privilege
        // log wela inne user ta me attendance eka delete karanna puluwanda kiyala
        // check krnna one
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // Me userge ATTENDANCE module permission ganna
        Privilege userPrivilege = authController.getPrivilegeByUserAndModule(authentication.getName(), "ATTENDANCE");
        if (!userPrivilege.getPrivi_insert()) {
            return "Save not completed.You don't have permission..!";
        }

        /// 2. need to check attendance existence
        // selected student, batch saha ada dinata attendance record ekak thiyenawada
        // kiyala check karanawa
        Attendance attendanceByStudentDateBatch = attendanceDao.getByStudentAndBatchAndDate(
                attendance.getStudent_id().getId(),
                attendance.getBatch_id().getId(),
                LocalDate.now().atStartOfDay(), // ada dinaye start time (00:00)
                LocalDate.now().atTime(LocalTime.MAX) // ada dinaye end time (23:59:59)
        );

        // attendance record ekak already thiyenawanam duplicate save karanne naha
        if (attendanceByStudentDateBatch != null) {

            // existing attendance record ekak thiyena nisa error message ekak return
            // karanawa
            return "Attendance already exists for this student in selected batch today..!";
        }

        // 3.try catch
        try {

            // 4.set auto generted task
            attendance.setAdddatetime(LocalDateTime.now()); // current date-time set karanawa

            attendance.setAttendancestatus(1); // PRESENT

            // login wela inna userge username eka gannawa
            String username = authentication.getName();

            // username eka use karala database eken login user object eka gannawa
            User loginUserObject = userDao.getByUsername(username);

            // attendance record ekata add karapu userge ID eka set karanawa
            attendance.setAddeduser(loginUserObject.getId());

            // 5.main save operation
            attendanceDao.save(attendance);

            // save success unoth return message
            return "OK";

        } catch (Exception exception) {
            // mokak hari exception ekak awama me message eka return karanawa
            return "Save not completed : " + exception.getMessage();
        }
    }

    @PutMapping(value = "/attendance/update")
    @Override
    public String updateData(@RequestBody Attendance attendance) {

        // @RequestBody -> frontend eken ena JSON data eka Attendance object ekakata map
        // karanawa
        // request body eke fields tika Attendance entity eke fields walata bind wenawa

        // 1. need to check logged user privilege
        // login wela inne user ta attendance update karanna permission thiyenawada
        // kiyala check karanawa
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // logged userge ATTENDANCE module privilege gannawa
        Privilege userPrivilege = authController.getPrivilegeByUserAndModule(
                authentication.getName(),
                "ATTENDANCE");

        // update permission nathnam update operation eka stop karanawa
        if (!userPrivilege.getPrivi_update()) {
            return "Update not completed.You don't have permission..!";
        }

        // 2. need to check data existence
        // update karana attendance id eka database eke thiyenawada kiyala check
        // karanawa
        Attendance exAttendance = attendanceDao.getReferenceById(attendance.getId());

        // attendance record eka nathnam update karanna ba
        if (exAttendance == null) {
            return "Update not completed.Attendance Not Found ..";
        }

        // 3. need to check duplicate attendance
        // update karana student, batch saha ada dinata wena attendance record ekak
        // thiyenawada kiyala check karanawa
        Attendance attendanceByStudentDateBatch = attendanceDao.getByStudentAndBatchAndDate(
                attendance.getStudent_id().getId(),
                attendance.getBatch_id().getId(),
                LocalDate.now().atStartOfDay(), // ada dinaye start time (00:00)
                LocalDate.now().atTime(LocalTime.MAX) // ada dinaye end time (23:59:59)
        );

        // wena attendance record ekak thiyenawanam duplicate prevent karanawa
        // habai update karana record eka nemei nam witharak duplicate kiyala return
        // karanawa
        if (attendanceByStudentDateBatch != null
                && attendanceByStudentDateBatch.getId() != attendance.getId()) {

            return "Attendance already exists for this student in selected batch today..!";
        }

        // 4. try-catch block for error handling
        try {

            // 5. set auto generated task
            // update karapu datetime eka set karanawa
            attendance.setUpdateddatetime(LocalDateTime.now());

            // 6. main save operation
            // updated attendance record eka database eke save karanawa
            attendanceDao.save(attendance);

            // update success message
            return "OK";

        } catch (Exception e) {

            // error ekak awoth exception message return karanawa
            return "Update not completed. Some errors occurred: " + e.getMessage();
        }
    }

    @DeleteMapping(value = "/attendance/delete")
    @Override
    public String deleteData(@RequestBody Attendance attendance) {
        // @RequestBody -> frontend eken ena JSON data eka Attendance object ekakata
        // map karanawa.
        // e kiyanne request body eke thiyena fields tika automa Attendance class eke
        // fields walata bind wenawa.
        // me annotation eka naththam JSON data eka object ekakata convert wenne na.

        // 1. need to check loged user privilege
        // log wela inne user ta me attendance eka delete karanna puluwanda kiyala
        // check krnna one
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // Me userge ATTENDANCE module permission ganna
        Privilege userPrivilege = authController.getPrivilegeByUserAndModule(authentication.getName(), "ATTENDANCE");
        if (!userPrivilege.getPrivi_delete()) {
            return "Delete not completed.You don't have permission..!";
        }
        // 2. need to check data existance
        // me attendance id eka database eke innawada kiyala check karanwa
        Attendance exAttendance = attendanceDao.getReferenceById(attendance.getId());
        if (exAttendance == null) {
            return "Delete not completed.Class Detail Not Found ..";
            // data naththam delete karanna ba
        }
        // 3.try catch
        try {
            // 4.set auto generted task

            // 5.operation
            // hard delete not good
            attendanceDao.delete(attendance);

            // 6.check dependancies
            return "OK"; // delete success unama me return wenawa
        } catch (Exception e) {
            // mokak hari issue ekak awama me error message eka return wenawa
            return "Delete not completed. Some errors occurred: " + e.getMessage();
        }

    }

    // selected batch ta adala attendance dates gannawa
    @GetMapping(value = "/attendance/datesbybatch/{batchId}", produces = "application/json")
    public List<String> getAttendanceDatesByBatch(@PathVariable Integer batchId) {

        return attendanceDao.getAttendanceDatesByBatch(batchId);

    }
}
