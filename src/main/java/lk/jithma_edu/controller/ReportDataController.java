package lk.jithma_edu.controller;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.jithma_edu.dao.ReportDao;
import lk.jithma_edu.dao.StudentPaymentDao;
import lk.jithma_edu.entity.Attendance;
import lk.jithma_edu.entity.Student;
@RestController // me class eka REST controller ekak, data send / receive karanna use wenawa
// meka nathuuwa mapping wada krn na must need
public class ReportDataController {

    @Autowired
    // @Autowired → Spring dependency injection.
    // Spring container eka ReportDao instance ekak create karala me variable ekata
    // inject karanawa.

    private ReportDao reportDao;

    @Autowired
    private StudentPaymentDao studentPaymentDao;

    // selected batch ekata adala active students list eka ganna
    @GetMapping("report/batchwisestudentreport/{batchid}")
    public List<Student> getBatchWiseStudentReport(@PathVariable Integer batchid) {
        return reportDao.getBatchWiseStudentReport(batchid);
    }

    // get student attendance report by student, batch and date range
    @GetMapping(value = "report/studentattendancereport/{studentid}/{batchid}/{fromdate}/{todate}", produces = "application/json")
    public List<Attendance> studentAttendanceReport(
            @PathVariable Integer studentid,
            @PathVariable Integer batchid,
            @PathVariable String fromdate,
            @PathVariable String todate) {

        return reportDao.getStudentAttendanceReport(studentid, batchid, fromdate, todate);
    }

    // get batch attendance report by batch and date
    @GetMapping(value = "/report/batchattendancereport/{batchid}/{attendancedate}", produces = "application/json")
    public List<Attendance> batchAttendanceReport(
            @PathVariable Integer batchid,
            @PathVariable String attendancedate) {

        return reportDao.getBatchAttendanceReport(batchid, attendancedate);
    }

    // GET http://localhost:8080/report/batchdailyincome/1/2026-06-07
    // get batch daily income
    @GetMapping(value = "/report/batchdailyincome/{batchid}/{date}", produces = "application/json")
    public BigDecimal getBatchDailyIncome(
            @PathVariable Integer batchid,
            @PathVariable String date) {

        return reportDao.getBatchDailyIncome(batchid, date);
    }

    // GET http://localhost:8080/report/batchpaymentcount/1/2026-06-07
    // get batch daily payment count
    @GetMapping(value = "/report/batchpaymentcount/{batchid}/{date}", produces = "application/json")
    public Long getBatchDailyPaymentCount(
            @PathVariable Integer batchid,
            @PathVariable String date) {

        return reportDao.getBatchDailyPaymentCount(batchid, date);
    }

    // GET http://localhost:8080/report/batchmonthlyincome/1/2026/06
    // get batch monthly income
    @GetMapping(value = "/report/batchmonthlyincome/{batchid}/{year}/{month}", produces = "application/json")
    public BigDecimal getBatchMonthlyIncome(
            @PathVariable Integer batchid,
            @PathVariable Integer year,
            @PathVariable Integer month) {

        return reportDao.getBatchMonthlyIncome(batchid, year, month);
    }

    // GET http://localhost:8080/report/batchmonthlypaymentcount/1/2026/06
    // get batch monthly payment count
    @GetMapping(value = "/report/batchmonthlypaymentcount/{batchid}/{year}/{month}", produces = "application/json")
    public Long getBatchMonthlyPaymentCount(
            @PathVariable Integer batchid,
            @PathVariable Integer year,
            @PathVariable Integer month) {

        return reportDao.getBatchMonthlyPaymentCount(batchid, year, month);
    }

    // GET http://localhost:8080/report/batchyearlyincome/1/2026
    // get batch yearly income
    @GetMapping(value = "/report/batchyearlyincome/{batchid}/{year}", produces = "application/json")
    public BigDecimal getBatchYearlyIncome(
            @PathVariable Integer batchid,
            @PathVariable Integer year) {

        return reportDao.getBatchYearlyIncome(batchid, year);
    }

    // GET http://localhost:8080/report/batchyearlypaymentcount/1/2026
    // get batch yearly payment count
    @GetMapping(value = "/report/batchyearlypaymentcount/{batchid}/{year}", produces = "application/json")
    public Long getBatchYearlyPaymentCount(
            @PathVariable Integer batchid,
            @PathVariable Integer year) {

        return reportDao.getBatchYearlyPaymentCount(batchid, year);
    }

    // GET http://localhost:8080/report/batchdaterangeincome/1/2026-01-01/2026-07-29

    // get batch income by date range
    @GetMapping(value = "/report/batchdaterangeincome/{batchid}/{fromdate}/{todate}", produces = "application/json")
    public BigDecimal getBatchDateRangeIncome(
            @PathVariable Integer batchid,
            @PathVariable String fromdate,
            @PathVariable String todate) {

        return reportDao.getBatchDateRangeIncome(batchid, fromdate, todate);
    }

    // GET
    // http://localhost:8080/report/batchdaterangepaymentcount/1/2026-01-01/2026-07-29

    // get batch payment count by date range
    @GetMapping(value = "/report/batchdaterangepaymentcount/{batchid}/{fromdate}/{todate}", produces = "application/json")
    public Long getBatchDateRangePaymentCount(
            @PathVariable Integer batchid,
            @PathVariable String fromdate,
            @PathVariable String todate) {

        return reportDao.getBatchDateRangePaymentCount(batchid, fromdate, todate);
    }

    @RequestMapping(value = "/report/mounthlyincome/{date}")
    public String getIncomeByMonth(@PathVariable("date") String month) {

        // System.out.println("---------------------------------");
        // System.out.println(month);
        // System.out.println("---------------------------------");
        String monthlyIncome = studentPaymentDao.getTotalIncomeByMonth(month);

        if (monthlyIncome == null) {
            monthlyIncome = "0";
        }

        return monthlyIncome;

    }

    // http://localhost:8080/managercashcollection/2026-07-01/2026-07-31
    // get manager cash collection report by selected date range
    @GetMapping("/managercashcollection/{fromDate}/{toDate}")
    public List getManagerCashCollection(
            @PathVariable String fromDate,
            @PathVariable String toDate) {

        // get cash collection details between selected dates
        return reportDao.getManagerCashCollection(fromDate, toDate);
    }

    // http://localhost:8080/rolewisecashcollection/2026-07-30
    // get role wise daily cash collection report by selected date
    @GetMapping("/rolewisecashcollection/{date}")
    public List getRoleWiseCashCollection(
            @PathVariable String date,Authentication authentication) {

        // login wela inna user name eka gannawa
        String loggedUser = authentication.getName();

        // logged user ge selected date cash collection details gannawa
        return reportDao.getRoleWiseCashCollection(loggedUser, date);
    }

    // http://localhost:8080/report/teacherincome?teacherid=1&sdate=2026-07-01&edate=2026-07-31&type=Weekly

    /*
     * @GetMapping(value = "/report/teacherincome", params = { "teacherid", "sdate",
     * "edate", "type" })
     * public List<Object[]> getTeacherIncomeReport(
     * 
     * @RequestParam(name = "teacherid") Integer teacherid,
     * 
     * @RequestParam(name = "sdate") String sdate,
     * 
     * @RequestParam(name = "edate") String edate,
     * 
     * @RequestParam(name = "type") String type) {
     * // Daily
     * if (type.equals("Daily")) {
     * return reportDao.getTeacherIncomeReportByDate(teacherid, sdate);
     * }
     * // Weekly
     * else if (type.equals("Weekly")) {
     * return reportDao.getTeacherIncomeReportByWeek(teacherid, sdate, edate);
     * }
     * 
     * // Monthly
     * else if (type.equals("Monthly")) {
     * 
     * // sdate = 2026-07-01
     * String[] data = sdate.split("-");
     * 
     * Integer year = Integer.parseInt(data[0]);
     * Integer month = Integer.parseInt(data[1]);
     * 
     * return reportDao.getTeacherIncomeReportByMonth(teacherid, month, year);
     * 
     * }
     * 
     * // Annual
     * else if (type.equals("Annual")) {
     * 
     * // sdate = 2026
     * Integer year = Integer.parseInt(sdate);
     * return reportDao.getTeacherIncomeReportByYear(teacherid, year);
     * }
     * 
     * return null;
     * }
     * 
     */

}