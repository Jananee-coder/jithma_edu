package lk.jithma_edu.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.jithma_edu.dao.UserDao;
import lk.jithma_edu.entity.User;

@RestController // me class eka REST controller ekak, data send / receive karanna use wenawa
// meka nathuuwa mapping wada krn na must need
public class ReportUIController {

    // get user instance
    @Autowired
    private UserDao userDao;

    // meka /batchwisestudentreport kiyala url ekt giyama
    // Batch-wise Student Report page eka load wenawa
    @RequestMapping("/batchwisestudentreport")
    public ModelAndView batchWiseStudentReportPage() {

        // currently login wela inna user ge details gannawa
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // username eka hraha user object eka gnnawa
        User loggedUser = userDao.getByUsername(authentication.getName());

        // ModelAndView object ekak create karanawa
        ModelAndView batchWiseStudentReportUI = new ModelAndView();

        // load wena html page eka set karanawa
        batchWiseStudentReportUI.setViewName("reportbatchwisestudent.html");

        // login una user ge username eka page ekata yawanaawa
        batchWiseStudentReportUI.addObject("loggedusername", authentication.getName());

        // page title eka set karanawa
        batchWiseStudentReportUI.addObject("title", "Jithma Institute | Batch-wise Student Report");

        // photo set
        batchWiseStudentReportUI.addObject("userphoto", loggedUser.getUserphoto());

        // final page eka browser ekata return karanawa
        return batchWiseStudentReportUI;
    }

    // meka /studentattendancereport kiyala url ekt giyama
    // Student Attendance Report page eka load wenawa
    @RequestMapping("/studentattendancereport")
    public ModelAndView studentAttendanceReportPage() {

        // currently login wela inna user ge details gannawa
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // username eka hraha user object eka gnnawa
        User loggedUser = userDao.getByUsername(authentication.getName());

        // ModelAndView object ekak create karanawa
        ModelAndView studentAttendanceReportUI = new ModelAndView();

        // load wena html page eka set karanawa
        studentAttendanceReportUI.setViewName("reportstudentattendance.html");

        // login una user ge username eka page ekata yawanaawa
        studentAttendanceReportUI.addObject("loggedusername", authentication.getName());

        // page title eka set karanawa
        studentAttendanceReportUI.addObject("title", "Jithma Institute | Student Attendance Report");

        // photo set
        studentAttendanceReportUI.addObject("userphoto", loggedUser.getUserphoto());

        // final page eka browser ekata return karanawa
        return studentAttendanceReportUI;
    }

    // /batchattendancereport kiyala url ekata giyama
    // Batch Attendance Report page eka load wenawa

    @RequestMapping("/batchattendancereport")
    public ModelAndView batchAttendanceReportPage() {

        // currently login wela inna user ge details gannawa
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // username eka haraha user object eka gannawa
        User loggedUser = userDao.getByUsername(authentication.getName());

        // ModelAndView object ekak create karanawa
        ModelAndView batchAttendanceReportUI = new ModelAndView();

        // load wena html page eka set karanawa
        batchAttendanceReportUI.setViewName("reportbatchattendance.html");

        // login una user ge username eka page ekata yawanaawa
        batchAttendanceReportUI.addObject("loggedusername", authentication.getName());

        // page title eka set karanawa
        batchAttendanceReportUI.addObject("title", "Jithma Institute | Batch Attendance Report");

        // user photo set karanawa
        batchAttendanceReportUI.addObject("userphoto", loggedUser.getUserphoto());

        // final page eka browser ekata return karanawa
        return batchAttendanceReportUI;
    }

    // /batchattendancereport kiyala url ekata giyama
    // Batch Attendance Report page eka load wenawa

    @RequestMapping("/dailypaymentanalyticalreport")
    public ModelAndView dailyPaymentAnalyticalReport() {

        // currently login wela inna user ge details gannawa
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // username eka haraha user object eka gannawa
        User loggedUser = userDao.getByUsername(authentication.getName());

        // ModelAndView object ekak create karanawa
        ModelAndView dailyPaymentAnalyticalUI = new ModelAndView();

        // load wena html page eka set karanawa
        dailyPaymentAnalyticalUI.setViewName("reportdailypaymentanalytical.html");

        // login una user ge username eka page ekata yawanaawa
        dailyPaymentAnalyticalUI.addObject("loggedusername", authentication.getName());

        // page title eka set karanawa
        dailyPaymentAnalyticalUI.addObject("title", "Jithma Institute | Daily Payment Analytical Report");

        // user photo set karanawa
        dailyPaymentAnalyticalUI.addObject("userphoto", loggedUser.getUserphoto());

        // final page eka browser ekata return karanawa
        return dailyPaymentAnalyticalUI;
    }

    @RequestMapping("/monthlypaymentanalyticalreport")
    public ModelAndView monthlyPaymentAnalyticalReport() {

        // currently login wela inna user ge details gannawa
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // username eka haraha user object eka gannawa
        User loggedUser = userDao.getByUsername(authentication.getName());

        // ModelAndView object ekak create karanawa
        ModelAndView monthlyPaymentAnalyticalUI = new ModelAndView();

        // load wena html page eka set karanawa
        monthlyPaymentAnalyticalUI.setViewName("reportmonthlypaymentanalytical.html");

        // login una user ge username eka page ekata yawanaawa
        monthlyPaymentAnalyticalUI.addObject("loggedusername", authentication.getName());

        // page title eka set karanawa
        monthlyPaymentAnalyticalUI.addObject("title", "Jithma Institute | Monthly Payment Analytical Report");

        // user photo set karanawa
        monthlyPaymentAnalyticalUI.addObject("userphoto", loggedUser.getUserphoto());

        // final page eka browser ekata return karanawa
        return monthlyPaymentAnalyticalUI;

    }

    @RequestMapping("/yearlypaymentanalyticalreport")
    public ModelAndView yearlyPaymentAnalyticalReport() {

        // currently login wela inna user ge details gannawa
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // username eka haraha user object eka gannawa
        User loggedUser = userDao.getByUsername(authentication.getName());

        // ModelAndView object ekak create karanawa
        ModelAndView yearlyPaymentAnalyticalUI = new ModelAndView();

        // load wena html page eka set karanawa
        yearlyPaymentAnalyticalUI.setViewName("reportyearlypaymentanalytical.html");

        // login una user ge username eka page ekata yawanaawa
        yearlyPaymentAnalyticalUI.addObject("loggedusername", authentication.getName());

        // page title eka set karanawa
        yearlyPaymentAnalyticalUI.addObject("title", "Jithma Institute | Yearly Payment Analytical Report");

        // user photo set karanawa
        yearlyPaymentAnalyticalUI.addObject("userphoto", loggedUser.getUserphoto());

        // final page eka browser ekata return karanawa
        return yearlyPaymentAnalyticalUI;
    }

    @RequestMapping("/daterangepaymentanalyticalreport")
    public ModelAndView dateRangePaymentAnalyticalReport() {

        // currently login wela inna user ge details gannawa
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // username eka haraha user object eka gannawa
        User loggedUser = userDao.getByUsername(authentication.getName());

        // ModelAndView object ekak create karanawa
        ModelAndView dateRangePaymentAnalyticalUI = new ModelAndView();

        // load wena html page eka set karanawa
        dateRangePaymentAnalyticalUI.setViewName("reportdaterangepaymentanalytical.html");

        // login una user ge username eka page ekata yawanaawa
        dateRangePaymentAnalyticalUI.addObject("loggedusername", authentication.getName());

        // page title eka set karanawa
        dateRangePaymentAnalyticalUI.addObject("title", "Jithma Institute | Date Range Payment Analytical Report");

        // user photo set karanawa
        dateRangePaymentAnalyticalUI.addObject("userphoto", loggedUser.getUserphoto());

        // final page eka browser ekata return karanawa
        return dateRangePaymentAnalyticalUI;

    }

    @RequestMapping("/reportrolewisecashcollection")
    public ModelAndView receptionistCashCollectionReport() {

        // currently login wela inna user ge details gannawa
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // username eka haraha user object eka gannawa
        User loggedUser = userDao.getByUsername(authentication.getName());

        // ModelAndView object ekak create karanawa
        ModelAndView receptionistCashCollectionUI = new ModelAndView();

        // load wena html page eka set karanawa
        receptionistCashCollectionUI.setViewName("reportrolewisecashcollection.html");

        // login una user ge username eka page ekata yawanaawa
        receptionistCashCollectionUI.addObject("loggedusername", authentication.getName());

        // page title eka set karanawa
        receptionistCashCollectionUI.addObject("title", "Jithma Institute | Receptionist Daily Cash Collection Report");

        // user photo set karanawa
        receptionistCashCollectionUI.addObject("userphoto", loggedUser.getUserphoto());

        // final page eka browser ekata return karanawa
        return receptionistCashCollectionUI;

    }

    @RequestMapping("/managercashcollectionreport")
    public ModelAndView managerCashCollectionReport() {

        // currently login wela inna user ge details gannawa
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // username eka haraha user object eka gannawa
        User loggedUser = userDao.getByUsername(authentication.getName());

        // ModelAndView object ekak create karanawa
        ModelAndView managerCashCollectionUI = new ModelAndView();

        // load wena html page eka set karanawa
        managerCashCollectionUI.setViewName("reportmanagercashcollection.html");

        // login una user ge username eka page ekata yawanaawa
        managerCashCollectionUI.addObject(
                "loggedusername",
                authentication.getName());

        // page title eka set karanawa
        managerCashCollectionUI.addObject( "title","Jithma Institute | Manager Cash Collection Report");

        // user photo set karanawa
        managerCashCollectionUI.addObject("userphoto",loggedUser.getUserphoto());

        // final page eka browser ekata return karanawa
        return managerCashCollectionUI;

    }
}
