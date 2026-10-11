package lk.jithma_edu.dao;

import java.math.BigDecimal;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.jithma_edu.entity.StudentPayment;

// JpaRepository use karala CRUD methods (save, findById, findAll, deleteById) automatic wenawa
// JpaRepository<E, I> --->  entity + primary key type set karanawa
public interface StudentPaymentDao extends JpaRepository<StudentPayment, Integer> {

    // Testing db

    /*
     * @Query(value =
     * "SELECT coalesce(concat(date_format(curdate(), '%y'), lpad(substring(max(sp.paymentno), 3) + 1, 8, '0')), concat(date_format(curdate(), '%y'), '00000001')) FROM jithma_edu.studentpayment sp"
     * , nativeQuery = true)
     * String getNextStudentPaymentNo();
     */

    // Real db
    @Query(value = "SELECT coalesce(concat(date_format(curdate(), '%y'), lpad(substring(max(sp.paymentno), 3) + 1, 8, '0')), concat(date_format(curdate(), '%y'), '00000001')) FROM jithma_edu_clean.studentpayment sp", nativeQuery = true)
    String getNextStudentPaymentNo();

    // DATE_FORMAT(CURDATE(), '%y') → last two digits of the current year.
    // SUBSTRING(MAX(sp.paymentno), 3) → numeric part of the largest payment number
    // (ignores year).
    // +1 → increment sequence for the next payment.
    // LPAD(..., 8, '0') → pad sequence to 8 digits with leading zeros.
    // COALESCE(..., default) → if no payment exists, use '2600000001'.

    @Query("select sp from StudentPayment sp where sp.studentregistration_id.id = ?1 and sp.paymonth = ?2")
    public StudentPayment getByRegistrationAndMonth(Integer registrationId, String paymonth);

    @Query("select sp from StudentPayment sp where sp.student_id.id=?1 and sp.paymentcategory_id.name='Admission Fee'")
    StudentPayment getAdmissionPayment(Integer studentId);

    // batch ekakata adala month income eka calculate karanawa
    @Query("SELECT sum(sp.totalamount) FROM StudentPayment sp WHERE sp.studentregistration_id.id IN (SELECT sr.id FROM StudentRegistration sr WHERE sr.batch_id.id = ?1) AND sp.paymonth = ?2")
    BigDecimal getIncomeByBatchAndMonth(Integer batchid, String month);

    // given batch ekata adala given month eke payment karapu unique students count
    // eka gannawa
    @Query("SELECT count(distinct sp.studentregistration_id.id) FROM StudentPayment sp WHERE sp.studentregistration_id.batch_id.id = ?1 AND sp.paymonth = ?2")
    Integer getPaidStudentCountByBatchAndMonth(Integer batchid, String month);

    // student + batch + month ekata adala payment eka gannawa
    @Query("select sp from StudentPayment sp where sp.student_id.id=?1 and sp.studentregistration_id.batch_id.id=?2 and sp.paymonth=?3")
    StudentPayment getStudentPayment(Integer studentId, Integer batchId, String month);

    // Admission Fee payment count eka saha Student Registration count eka ekathu
    // karala return karanawa
    // Result:
    // 0 = Admission Fee payment ne, Registration ne
    // 1 = Admission Fee payment thiyenawa ho Registration thiyenawa
    // 2 = Admission Fee payment saha Registration dekama thiyenawa
    @Query("SELECT (SELECT COUNT(sp) FROM StudentPayment sp WHERE sp.student_id.id=?1 AND sp.paymentcategory_id.name='Admission Fee') + (SELECT COUNT(sr) FROM StudentRegistration sr WHERE sr.student_id.id=?1)")
    Long checkStudentAdmissionStatus(Integer studentId);



    @Query(value="SELECT sum(totalamount) FROM studentpayment where MONTH(addeddatetime) = ?1;", nativeQuery = true)
    String getTotalIncomeByMonth(String month);

}
