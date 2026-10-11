package lk.jithma_edu.controller;


import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.jithma_edu.dao.AttendanceDao;
import lk.jithma_edu.dao.BatchDao;
import lk.jithma_edu.dao.RoleDao;
import lk.jithma_edu.dao.StudentRegistrationDao;
import lk.jithma_edu.dao.UserDao;
import lk.jithma_edu.entity.Attendance;
import lk.jithma_edu.entity.Batch;
import lk.jithma_edu.entity.ChangeUser;
import lk.jithma_edu.entity.Role;
import lk.jithma_edu.entity.Student;
import lk.jithma_edu.entity.User;

@RestController // me class eka REST controller ekak, data send / receive karanna use wenawa
// meka nathuuwa mapping wada krn na must need
public class LoginController {

    @Autowired
    private UserDao userDao;
    // UserDao -> database eken user data ganna

    @Autowired
    private RoleDao roleDao;
    // RoleDao -> database eken role data ganna

    @Autowired
    private BatchDao batchDao;

    @Autowired
    private StudentRegistrationDao studentRegistrationDao;


    @Autowired
    private AttendanceDao attendanceDao;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;
    // Password encode karanna BCrypt encoder inject karanawa

    // Create mapping for login page
    @RequestMapping("/login")
    public ModelAndView loginPage() {
        ModelAndView loginUI = new ModelAndView();
        loginUI.setViewName("login.html"); // login.html UI render karanawa
        // title set
        // loginUI.addObject("title", "BIT Project 2025 | Login");
        return loginUI;
    }

    // Create mapping for dashboard page
    @Transactional
    // database operations tika ekama transaction ekak widihata manage karanawa
    // error ekak awoth save wela thiyena changes rollback karanawa
    @RequestMapping("/dashboard")
    public ModelAndView dashboardPage() {

        // ada date eka gannawa
        LocalDate today = LocalDate.now();

        // ada dawase weekday eka gannawa
        // DayOfWeek enum eken ena value eka uppercase (FRIDAY) nisa
        // database eke save wela thiyena format ekata (Friday) convert karanawa
        String weekDay = today.getDayOfWeek()
                .toString()
                .substring(0, 1)
                + today.getDayOfWeek()
                        .toString()
                        .substring(1)
                        .toLowerCase();

        // danata time eka gannawa
        LocalTime time = LocalTime.now();

        // attendance checkin time nathi nisa 00:00 set karanawa
        LocalTime nullTime = LocalTime.parse("00:00");

        // current date and time eka gannawa
        LocalDate todayDate = LocalDate.now();
        LocalDateTime now = LocalDateTime.now();

        // ada dinaye start time eka (00:00)
        LocalDateTime startDate = todayDate.atStartOfDay();

        // ada dinaye end time eka (23:59:59)
        LocalDateTime endDate = todayDate.atTime(LocalTime.MAX);

        // adata adala old batches tika gannawa
        List<Batch> oldBatches = batchDao.getOldBatchesByWeekday(weekDay, time);

        // batch eka eka aran process karanawa
        for (Batch batch : oldBatches) {

            // selected batch eke register wela inna
            // namuth adala date eke attendance mark nokarapu students gannawa
            List<Student> studentList = studentRegistrationDao.getStudentsByBatches(
                    batch.getId(),
                    todayDate,
                    batch.getId());

            // attendance nathi student kenekta absent attendance record ekak create
            // karanawa
            for (Student oneStudent : studentList) {

                // ada student ge attendance record ekak already thiyenawada balanna
                Attendance existingAttendance = attendanceDao.getByStudentAndBatchAndDate(
                        oneStudent.getId(),
                        batch.getId(),
                        startDate,
                        endDate);

                // attendance record nathnam witharak absent record ekak create karanawa
                if (existingAttendance == null) {

                    Attendance attendance = new Attendance();

                    // student details set karanawa
                    attendance.setStudent_id(oneStudent);

                    // checkin time nathi nisa 00:00 set karanawa
                    attendance.setCheckin(nullTime);

                    // attendance status 0 = absent
                    attendance.setAttendancestatus(0);

                    // attendance add karana datetime eka set karanawa
                    attendance.setAdddatetime(now);

                    // attendance add karapu user set karanawa
                    attendance.setAddeduser(1);

                    // batch details set karanawa
                    attendance.setBatch_id(batch);

                    // attendance database eke save karanawa
                    attendanceDao.save(attendance);
                }
            }
        }

        // ---------------------------------------------------------

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        // me code eke aim eka: login una user ge details ganna
        // me line eken SecurityContext eken currently logged-in una user info gannawa

        // username eka hraha user object eka gnnawa
        User loggedUser = userDao.getByUsername(authentication.getName());

        ModelAndView dashboardUI = new ModelAndView();
        dashboardUI.setViewName("dashboard.html"); // dashboard.html UI render karanawa
        dashboardUI.addObject("loggedusername", authentication.getName());
        // login una user ge nama dashboard ekata pass karanawa
        // System.out.println(loggedUser.getUserphoto().toString());
        // title set
        dashboardUI.addObject("title", "Jithma Institute | Dashboard");
        // photo set
        // dashboardUI.addObject("loginuserid", loggedUser.getId());
        dashboardUI.addObject("userphoto", loggedUser.getUserphoto());

        /*
         * if (loggedUser.getRoles().stream()
         * .anyMatch(role -> role.getName().equals("Teacher"))) {
         * 
         * dashboardUI.setViewName("teacher/dashboard.html");
         * 
         * } else {
         * 
         * dashboardUI.setViewName("dashboard.html");
         * 
         * }
         */
        return dashboardUI;
    }

    // Create mapping for changeprofile page
    @RequestMapping("/changeprofile")
    public ModelAndView changeProfilePage() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        // me code eke aim eka: login una user ge details ganna
        // me line eken SecurityContext eken currently logged-in una user info gannawa

        // username eka hraha user object eka gnnawa
        User loggedUser = userDao.getByUsername(authentication.getName());

        ModelAndView changeProfileUI = new ModelAndView();
        changeProfileUI.setViewName("changeprofile.html"); // changeprofile.html UI get
        changeProfileUI.addObject("loggedusername", authentication.getName());
        // login una user ge nama changeprofile ekata pass karanawa
        // title set
        changeProfileUI.addObject("title", "Jithma Institute | Change Profile");
        // photo set
        changeProfileUI.addObject("userphoto", loggedUser.getUserphoto());
        return changeProfileUI;
    }

    // Create mapping for error page
    @GetMapping("/errorpage")
    public ModelAndView errorPage() {
        ModelAndView errorpageUI = new ModelAndView();
        errorpageUI.setViewName("errorpage.html"); // errorpage.html UI render karanawa
        // title set
        errorpageUI.addObject("title", "Jithma Institute | Error Page");
        return errorpageUI;
    }

    // Create mapping to generate default admin user
    @GetMapping("/createadmin")
    public String generateAdmin() {

        // Database eken admin username eka check karanawa
        User adminUser = userDao.getByUsername("admin");

        if (adminUser == null) { // Admin user naththam create karanawa
            User newAdmin = new User();

            newAdmin.setUsername("admin"); // default username
            newAdmin.setPassword(bCryptPasswordEncoder.encode("1234")); // password encode karala save karanawa
            newAdmin.setUserstatus(Boolean.TRUE); // account active
            newAdmin.setEmail("admin@gmail.com");// email set karanawa
            newAdmin.setAddeddatetime(LocalDateTime.now()); // creation date set karanawa

            List<Role> roles = new ArrayList<>();
            roles.add(roleDao.getReferenceById(1)); // role ID 1 = Admin role assign karanawa
            newAdmin.setRoles(roles);

            userDao.save(newAdmin); // admin user DB ekata save karanawa
        }

        // Create admin passe login page ekata redirect karanawa using JS
        return "<script>window.location.replace('/login');</script>";
    }

    // Create mapping for changeprofile page
    @RequestMapping("/getloggeduser")
    public ChangeUser getLoggedUser() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        // me code eke aim eka: login una user ge details ganna
        // me line eken SecurityContext eken currently logged-in una user info gannawa

        // username eka hraha user object eka gnnawa
        User loggedUser = userDao.getByUsername(authentication.getName());

        ChangeUser changeUser = new ChangeUser(loggedUser.getUsername(), loggedUser.getUsername(), null,
                loggedUser.getEmail(), loggedUser.getUserphoto());

        return changeUser;
    }

    // Handle POST request for updating user profile
    @PostMapping("/changeprofile")
    public String changeProfileSave(@RequestBody ChangeUser changeUser) {

        // Get the currently authenticated user from Spring Security
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        try {

            // Get the existing user from the database using old username
            User user = userDao.getByUsername(changeUser.getOldusername());

            // Update username
            user.setUsername(changeUser.getUsername());

            // Update user profile photo
            user.setUserphoto(changeUser.getUserphoto());

            // Update user email
            user.setEmail(changeUser.getUseremail());

            // Check if user provided a new password
            if (changeUser.getNewpassword() != null) {

                // Check if the new password is the same as the old password
                if (bCryptPasswordEncoder.matches(changeUser.getNewpassword(), user.getPassword())) {

                    // If the password is the same, return error message
                    return "Save not Completed : Password already matches previous password..!";

                } else {

                    // Encode (encrypt) the new password before saving
                    user.setPassword(bCryptPasswordEncoder.encode(changeUser.getNewpassword()));
                }
            }

            // Save updated user details to database
            userDao.save(user);

            // Return success message
            return "OK";

        } catch (Exception e) {

            // If any error occurs, return error message
            return "Save not Completed : " + e.getMessage();
        }
    }

    
}
