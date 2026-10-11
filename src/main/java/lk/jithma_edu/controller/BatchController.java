package lk.jithma_edu.controller;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.jithma_edu.dao.BatchDao;
import lk.jithma_edu.dao.BatchStatusDao;
import lk.jithma_edu.dao.UserDao;
import lk.jithma_edu.entity.Batch;
import lk.jithma_edu.entity.BatchStatus;
import lk.jithma_edu.entity.Privilege;
import lk.jithma_edu.entity.User;

@RestController // me class eka REST controller ekak, data send / receive karanna use wenawa
// meka nathuuwa mapping wada krn na must need
public class BatchController implements CommonController<Batch> {

    @Autowired
    // @Autowired → Spring dependency injection.
    // Spring container eka BatchDao instance ekak create karala me variable
    // ekata
    // inject karanawa.
    private BatchDao batchDao;

    @Autowired // get instance batchstatus
    private BatchStatusDao batchStatusDao;

    @Autowired // get authentication instance
    private AuthController authController;

    // get user instance
    @Autowired
    private UserDao userDao;

    // meka /batch kiyala url ekt giyama batch page eka load wenawa
    @RequestMapping("/batch")
    public ModelAndView batchPage() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        // me code eke aim eka: login una user ge details ganna
        // me line eken SecurityContext eken currently logged-in una user info gannawa

        // username eka hraha user object eka gnnawa
        User loggedUser = userDao.getByUsername(authentication.getName());

        // aluth ModelAndView ekak hadanawa
        ModelAndView batchUI = new ModelAndView();

        // view name eka set karanawa (batch.html file eka)
        batchUI.setViewName("batch.html");

        // login una user ge nama batch ekata pass karanawa
        batchUI.addObject("loggedusername", authentication.getName());

        // title set
        batchUI.addObject("title", "Jithma Institute | Batch Management");

        // photo set
        batchUI.addObject("userphoto", loggedUser.getUserphoto());

        // e page eka return karanawa browser ekata
        return batchUI;
    }

    @GetMapping(value = "/batch/alldata")
    @Override
    public List<Batch> getAllData() {

        // Login wela thiyena user kenekda kiyala ganna
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // Me userge BATCH module permission ganna
        Privilege userPrivilege = authController.getPrivilegeByUserAndModule(authentication.getName(), "BATCH");

        // User ta PRIVI_SELECT true da kiyala check karanawa
        if (userPrivilege.getPrivi_select()) {

            // User ta select permission thiyenawa nam
            // database eken batch table eke thiyena okkoma records return karanawa
            return batchDao.findAll();

        } else {

            // Select permission naththam empty list ekak return karanawa
            return new ArrayList<>();
        }

    }

    // POST mapping ekak create karala batch record insert karanna
    @PostMapping(value = "/batch/insert")
    public String saveData(@RequestBody Batch batch) {
        // @RequestBody -> frontend eken ena JSON data eka Batch object ekakata
        // map
        // karanawa.
        // e kiyanne request body eke thiyena fields tika automa Batch class eke
        // fields walata bind wenawa.
        // me annotation eka naththam JSON data eka object ekakata convert wenne na.

        // 1. need to check loged user privilege
        // log wela inne userta me operation eka karanna permission thiyanawada balanawa
        // save krnna
        // meka naththam unauthorized user kenek save karanna ba.
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // Me userge BATCH module permission ganna
        Privilege userPrivilege = authController.getPrivilegeByUserAndModule(authentication.getName(), "BATCH");
        if (!userPrivilege.getPrivi_insert()) {
            return "Save not completed.You don't have permission..!";
        }

        // 2.need to check data existance
        Batch batchByBachname = batchDao.getBatchName(batch.getBatchname());
        if (batchByBachname != null) {
            // duplicate batch name found
            return "Batch name already exist..! " +
                    batch.getBatchname();
        }

        // 3.try catch
        try {

            // 4.set auto generted task
            batch.setAddeddatetime(LocalDateTime.now()); // current date-time set karanawa

            // login wela inna userge username eka gannawa
            String username = authentication.getName();

            // username eka use karala database eken login user object eka gannawa
            User loginUserObject = userDao.getByUsername(username);

            // batch record ekata add karapu userge ID eka set karanawa
            batch.setAddeduser(loginUserObject.getId());

            // 5.main save operation
            batchDao.save(batch);

            // save success unoth return message
            return "OK";

        } catch (Exception exception) {
            // mokak hari exception ekak awama me message eka return karanawa
            return "Save not completed : " + exception.getMessage();
        }
    }

    @PutMapping(value = "/batch/update")
    @Override
    public String updateData(@RequestBody Batch batch) {
        // @RequestBody -> frontend eken ena JSON data eka Batch object ekakata
        // map
        // karanawa.
        // e kiyanne request body eke thiyena fields tika automa Batch class eke
        // fields walata bind wenawa.
        // me annotation eka naththam JSON data eka object ekakata convert wenne na.

        // 1. need to check loged user privilege
        // log wela inne userta me operation eka karanna permission thiyanawada balanawa
        // save krnna
        // meka naththam unauthorized user kenek save karanna ba.
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // Me userge BATCH module permission ganna
        Privilege userPrivilege = authController.getPrivilegeByUserAndModule(authentication.getName(), "BATCH");
        if (!userPrivilege.getPrivi_update()) {
            return "Update not completed.You don't have permission..!";
        }
        // 2. need to check data existance
        // me batch id eka database eke innawada kiyala check karanwa
        Batch exBatch = batchDao.getReferenceById(batch.getId());
        if (exBatch == null) {
            return "Update not completed.Batch Detail Not Found ..";
            // data naththam delete karanna ba
        }
        // 3. need to check duplicate
        Batch batchByBachname = batchDao.getBatchName(batch.getBatchname());
        if (batchByBachname != null && batchByBachname.getId() != batch.getId()) {
            // duplicate batch name found
            return "Batch name already exist..! " +
                    batch.getBatchname();
        }

        // 4. try–catch block for error handling
        try {
            // 5.set auto generted task
            // auto-generated values set karanawa
            batch.setUpdateddatetime(LocalDateTime.now());
            // batch.setUpdateduser(1);

            // 6.main save operation
            batchDao.save(batch);

            // 7. handle dependencies
            // dependent tables update karanna wenna puluwan

            return "OK"; // update success wenawanam OK return karanawa

        } catch (Exception e) {

            // mokak hari error ekak awoth exception message return karanawa
            return "Update not completed. Some errors occurred: " + e.getMessage();
        }
    }

    @DeleteMapping(value = "/batch/delete")
    @Override
    public String deleteData(@RequestBody Batch batch) {
        // @RequestBody -> frontend eken ena JSON data eka Batch object ekakata map
        // karanawa.
        // e kiyanne request body eke thiyena fields tika automa Batch class eke
        // fields walata bind wenawa.
        // me annotation eka naththam JSON data eka object ekakata convert wenne na.

        // 1. need to check loged user privilege
        // log wela inne user ta me batch eka delete karanna puluwanda kiyala
        // check karanna one
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // Me userge BATCH module permission ganna
        Privilege userPrivilege = authController.getPrivilegeByUserAndModule(authentication.getName(), "BATCH");
        if (!userPrivilege.getPrivi_delete()) {
            return "Delete not completed.You don't have permission..!";
        }

        // 2. need to check data existance
        // me batch id eka database eke innawada kiyala check karanwa
        Batch exBatch = batchDao.getReferenceById(batch.getId());
        if (exBatch == null) {
            return "Delete not completed.Batch Not Found ..";
            // data naththam delete karanna ba
        }
        // 3.try catch
        try {
            // 4.set auto generted task

            // 5.operation
            // hard delete not good
            // batchStatusDao.delete(BATCH);

            // soft delete
            // methanadi delete krana kenage status eka delete kiyana ekata maru wena eka
            // wenne
            BatchStatus deleteStatus = batchStatusDao.getReferenceById(2);
            exBatch.setBatchstatus_id(deleteStatus);

            System.out.println(exBatch);
            batchDao.save(exBatch);

            // 6.check dependancies
            return "OK"; // delete success unama me return wenawa
        } catch (Exception e) {
            // mokak hari issue ekak awama me error message eka return wenawa
            return "Delete not completed. Some errors occurred: " + e.getMessage();
        }

    }

    /// create GET mapping for registered batch list for a specific student
    // example URL: /batch/registeredbatches?studentId=1
    @GetMapping(value = "/batch/registeredbatches", produces = "application/json")
    public List<Batch> getRegisteredBatches(@RequestParam int studentId) {
        // batchDao.getRegisteredBatchesByStudentId(studentId) → me student ekata
        // sambandha batch list eka gannawa
        return batchDao.getRegisteredBatchesByStudentId(studentId);
    }

    // selected teacher ta adala batches gannawa
    @GetMapping(value = "/batch/byteacher/{teacherId}", produces = "application/json")
    public List<Batch> getBatchByTeacher(@PathVariable("teacherId") Integer teacherId) {

        return batchDao.getBatchByTeacher(teacherId);
    }

    // Grade + Teacher walata adala batches ganna (PathVariable)
    @GetMapping(value = "/batch/bygradeandteacher/{gradeId}/{teacherId}", produces = "application/json")
    public List<Batch> getBatchByGradeAndTeacher(
            @PathVariable("gradeId") Integer gradeId,
            @PathVariable("teacherId") Integer teacherId) {

        return batchDao.getBatchByGradeAndTeacher(gradeId, teacherId);
    }

    // create GET mapping for today class batch list for a specific student
    // example URL: /batch/todayclasses?studentId=1
    @GetMapping(value = "/batch/todayclasses", produces = "application/json")
    public List<Batch> getTodayClasses(@RequestParam int studentId) {

        // system eken ada dawasa gannawa
        String dayname = LocalDate.now().getDayOfWeek()
                .getDisplayName(TextStyle.FULL, Locale.ENGLISH);

                System.out.println(batchDao.getTodayClassesByStudentId(studentId, dayname));

        // me student ekata ada class thiyana batch list eka gannawa
        return batchDao.getTodayClassesByStudentId(studentId, dayname);
    }


    // create GET mapping for today class batch list for a specific student
    // example URL: /batch/todayclasses?studentId=1
    @GetMapping(value = "/batchforcardchecker/todayclasses", produces = "application/json")
    public List<Batch> getTodayClassesForCardChecker(@RequestParam int studentId) {

        // system eken ada dawasa gannawa
        String dayname = LocalDate.now().getDayOfWeek()
                .getDisplayName(TextStyle.FULL, Locale.ENGLISH);

                System.out.println(batchDao.getTodayClassesByStudentId(studentId, dayname));

        // me student ekata ada class thiyana batch list eka gannawa
        return batchDao.getTodayClassesByStudentId(studentId, dayname);
    }



    // Grade + Subject + Teacher walata adala batches ganna (PathVariable)
    @GetMapping(value = "/batch/bygradesubjectteacher/{gradeId}/{subjectId}/{teacherId}", produces = "application/json")
    public List<Batch> getBatchByGradeSubjectAndTeacher(
            @PathVariable("gradeId") Integer gradeId,
            @PathVariable("subjectId") Integer subjectId,
            @PathVariable("teacherId") Integer teacherId) {

        return batchDao.getBatchByGradeSubjectAndTeacher(gradeId, subjectId, teacherId);
    }

    // grade + subject + teacher match wena
    // + student already register wela nathi batches only gannawa
    @GetMapping("/batch/availablebatches")
    public List<Batch> getAvailableBatches(
            @RequestParam Integer gradeId,
            @RequestParam Integer subjectId,
            @RequestParam Integer teacherId,
            @RequestParam Integer studentId) {

        return batchDao.getAvailableBatches(gradeId, subjectId, teacherId, studentId);
    }

    // get today's class details for notification
    @GetMapping("/batch/todayclasses")
    @ResponseBody
    public List<Batch> getTodayClasses() {

        // database eken ada class list eka gannawa
        return batchDao.findTodayClasses();

    }

}
