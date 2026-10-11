package lk.jithma_edu.dao;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.jithma_edu.entity.Attendance;
import lk.jithma_edu.entity.Student;

public interface ReportDao extends JpaRepository<Student, Integer> {

        // selected batch ekata adala active students la ganna query eka
        @Query(value = "SELECT s.* FROM studentregistration sr INNER JOIN student s ON sr.student_id = s.id WHERE sr.batch_id=?1 AND sr.studentregstatus_id=1", nativeQuery = true)
        public List<Student> getBatchWiseStudentReport(Integer batchId);

        // get student attendance report by student and date range
        @Query(value = "select * from attendance a where a.student_id=?1 and a.batch_id=?2 and date(a.adddatetime) between ?3 and ?4 order by a.adddatetime", nativeQuery = true)
        List<Attendance> getStudentAttendanceReport(Integer studentId, Integer batchId, String fromDate, String toDate);

        // get batch attendance report by batch and date
        @Query(value = "select * from attendance a where a.batch_id=?1 and date(a.adddatetime)=?2", nativeQuery = true)
        List<Attendance> getBatchAttendanceReport(Integer batchId, String attendancedate);

        // get batch attendance report by batch and date
        @Query(value = "select * from studen a where a.teacherId=?1 and date(a.adddatetime)=?2", nativeQuery = true)
        List<Attendance> getDailyAnalyiticalReport(Integer teacherId);

        // Daily
        /*
         * @Query(value = "SELECT DATE(e.addeddatetime) AS report_date, " +
         * "b.batchname, e.totalbatchincome, e.totalservicecharge, e.finalamount " +
         * "FROM enrollment e " +
         * "INNER JOIN enrollment_has_batch ehb ON e.id=ehb.enrollment_id " +
         * "INNER JOIN batch b ON ehb.batch_id=b.id " +
         * "WHERE e.teacher_id=?1 AND DATE(e.addeddatetime)=?2", nativeQuery = true)
         * List<Object[]> getTeacherIncomeReportByDate(Integer teacherId, String
         * reportDate);
         */

        // Weekly
        /*
         * @Query(value = "SELECT WEEK(e.addeddatetime) AS week_no, " +
         * "b.batchname, e.totalbatchincome, e.totalservicecharge, e.finalamount " +
         * "FROM enrollment e " +
         * "INNER JOIN enrollment_has_batch ehb ON e.id=ehb.enrollment_id " +
         * "INNER JOIN batch b ON ehb.batch_id=b.id " +
         * "WHERE e.teacher_id=?1 " +
         * "AND DATE(e.addeddatetime) BETWEEN ?2 AND ?3", nativeQuery = true)
         * List<Object[]> getTeacherIncomeReportByWeek(Integer teacherId, String
         * startDate, String endDate);
         */

        // Monthly
        /*
         * @Query(value = "SELECT MONTHNAME(e.addeddatetime) AS month_name, " +
         * "b.batchname, e.totalbatchincome, e.totalservicecharge, e.finalamount " +
         * "FROM enrollment e " +
         * "INNER JOIN enrollment_has_batch ehb ON e.id=ehb.enrollment_id " +
         * "INNER JOIN batch b ON ehb.batch_id=b.id " +
         * "WHERE e.teacher_id=?1 " +
         * "AND MONTH(e.addeddatetime)=?2 " +
         * "AND YEAR(e.addeddatetime)=?3", nativeQuery = true)
         * List<Object[]> getTeacherIncomeReportByMonth(Integer teacherId, Integer
         * month, Integer year);
         */

        // Annual
        /*
         * @Query(value = "SELECT YEAR(e.addeddatetime) AS year_name, " +
         * "b.batchname, e.totalbatchincome, e.totalservicecharge, e.finalamount " +
         * "FROM enrollment e " +
         * "INNER JOIN enrollment_has_batch ehb ON e.id=ehb.enrollment_id " +
         * "INNER JOIN batch b ON ehb.batch_id=b.id " +
         * "WHERE e.teacher_id=?1 " +
         * "AND YEAR(e.addeddatetime)=?2", nativeQuery = true)
         * List<Object[]> getTeacherIncomeReportByYear(Integer teacherId, Integer year);
         */

        /*
         * SELECT Orders.OrderID, Customers.CustomerName, Orders.OrderDate
         * FROM Orders
         * INNER JOIN Customers ON Orders.CustomerID=Customers.CustomerID;
         */

        /*
         * dao-> /* Query for get item count by given start date , end date and item_id
         * ------------------------------
         */
        /*
         * @Query(value =
         * "SELECT monthname(po.adddatetime), sum(poi.qty) FROM saloonproject.purchaseorder as po inner join saloonproject.purchaseorder_has_item as poi on po.id=poi.purchaseorder_id where poi.item_id= ?1 and date(po.adddatetime) between ?2 and ?3 group by monthname(po.adddatetime)"
         * , nativeQuery = true)
         * public List getItemListPurchaseCountByItemSDateEDateMonthly(Integer itemid,
         * String sdate, String edate);
         */
        // get batch total payment by selected date
        @Query(value = "SELECT COALESCE(SUM(sp.paidamount),0) FROM studentpayment sp INNER JOIN studentregistration sr ON sp.studentregistration_id=sr.id WHERE sr.batch_id=?1 AND DATE(sp.addeddatetime)=?2", nativeQuery = true)
        BigDecimal getBatchDailyIncome(Integer batchId, String date);

        // get batch payment count by selected date
        @Query(value = "SELECT COUNT(sp.id) FROM studentpayment sp INNER JOIN studentregistration sr ON sp.studentregistration_id=sr.id WHERE sr.batch_id=?1 AND DATE(sp.addeddatetime)=?2", nativeQuery = true)
        Long getBatchDailyPaymentCount(Integer batchId, String date);

        // get batch total payment by selected month
        @Query(value = "SELECT COALESCE(SUM(sp.paidamount),0) FROM studentpayment sp INNER JOIN studentregistration sr ON sp.studentregistration_id=sr.id WHERE sr.batch_id=?1 AND YEAR(sp.addeddatetime)=?2 AND MONTH(sp.addeddatetime)=?3", nativeQuery = true)
        BigDecimal getBatchMonthlyIncome(Integer batchId, Integer year, Integer month);

        // get batch payment count by selected month
        @Query(value = "SELECT COUNT(sp.id) FROM studentpayment sp INNER JOIN studentregistration sr ON sp.studentregistration_id=sr.id WHERE sr.batch_id=?1 AND YEAR(sp.addeddatetime)=?2 AND MONTH(sp.addeddatetime)=?3", nativeQuery = true)
        Long getBatchMonthlyPaymentCount(Integer batchId, Integer year, Integer month);

        // get batch payment count by selected year
        @Query(value = "SELECT COUNT(sp.id) FROM studentpayment sp INNER JOIN studentregistration sr ON sp.studentregistration_id=sr.id WHERE sr.batch_id=?1 AND YEAR(sp.addeddatetime)=?2", nativeQuery = true)
        Long getBatchYearlyPaymentCount(Integer batchId, Integer year);

        // get batch total payment by selected year
        @Query(value = "SELECT COALESCE(SUM(sp.paidamount),0) FROM studentpayment sp INNER JOIN studentregistration sr ON sp.studentregistration_id=sr.id WHERE sr.batch_id=?1 AND YEAR(sp.addeddatetime)=?2", nativeQuery = true)
        BigDecimal getBatchYearlyIncome(Integer batchId, Integer year);

        // get batch payment count by selected date range
        @Query(value = "SELECT COUNT(sp.id) FROM studentpayment sp INNER JOIN studentregistration sr ON sp.studentregistration_id=sr.id WHERE sr.batch_id=?1 AND DATE(sp.addeddatetime) BETWEEN ?2 AND ?3", nativeQuery = true)
        Long getBatchDateRangePaymentCount(Integer batchId, String fromDate, String toDate);

        // get batch total payment by selected date range
        @Query(value = "SELECT COALESCE(SUM(sp.paidamount),0) FROM studentpayment sp INNER JOIN studentregistration sr ON sp.studentregistration_id=sr.id WHERE sr.batch_id=?1 AND DATE(sp.addeddatetime) BETWEEN ?2 AND ?3", nativeQuery = true)
        BigDecimal getBatchDateRangeIncome(Integer batchId, String fromDate, String toDate);

        // get manager cash collection report by user and date range

        @Query(value = "SELECT u.username, DATE(sp.addeddatetime), COUNT(sp.id), SUM(sp.totalamount) FROM studentpayment sp INNER JOIN user u ON u.id = sp.addeduser WHERE sp.addeddatetime BETWEEN ?1 AND ?2 GROUP BY u.username, DATE(sp.addeddatetime) ORDER BY DATE(sp.addeddatetime)", nativeQuery = true)
        public List getManagerCashCollection(String fromDate, String toDate);

        // get role wise daily cash collection by logged user and selected date
        @Query(value = "SELECT s.regno, s.fullname, pc.name, pm.name, DATE(sp.addeddatetime), sp.totalamount FROM studentpayment sp INNER JOIN student s ON s.id = sp.student_id INNER JOIN paymentcategory pc ON pc.id = sp.paymentcategory_id INNER JOIN paymentmethod pm ON pm.id = sp.paymentmethod_id INNER JOIN `user` u ON u.id = sp.addeduser WHERE u.username=?1 AND DATE(sp.addeddatetime)=?2", nativeQuery = true)
        public List getRoleWiseCashCollection(String username, String date);

        /*
         * @Query(value =
         * "SELECT sp.* FROM studentpayment sp WHERE DATE(sp.addeddatetime) BETWEEN ?1 AND ?2"
         * , nativeQuery = true)
         * List<StudentPayment> getManagerCashCollection(String fromDate, String
         * toDate);
         */

}
