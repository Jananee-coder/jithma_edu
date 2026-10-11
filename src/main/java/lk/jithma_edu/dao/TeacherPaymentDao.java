package lk.jithma_edu.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.jithma_edu.entity.TeacherPayment;

//JpaRepository use karala CRUD methods (save, findById, findAll, deleteById) automatic wenawa
//JpaRepository<E, I> --->  entity + primary key type set karanawa
public interface TeacherPaymentDao extends JpaRepository<TeacherPayment, Integer> {

  // check same enrollment id have many teacher payment
  @Query("select tp from TeacherPayment tp where tp.enrollment_id.id=?1")
  TeacherPayment getByEnrollmentWithTeacherPayment(Integer enrollmentId);

  //Testing db

  /* @Query(value = "SELECT concat('B', date_format(curdate(), '%y'), lpad(coalesce(max(cast(substring(t.billno, 5) as unsigned)), 0) + 1, 5, '0')) FROM jithma_edu.teacherpayment t WHERE t.billno LIKE concat('B', date_format(curdate(), '%y'), '%')", nativeQuery = true)
  String getNextBillNo(); */

  //Real db
  @Query(value = "SELECT concat('B', date_format(curdate(), '%y'), lpad(coalesce(max(cast(substring(t.billno, 5) as unsigned)), 0) + 1, 5, '0')) FROM jithma_edu_clean.teacherpayment t WHERE t.billno LIKE concat('B', date_format(curdate(), '%y'), '%')", nativeQuery = true)
  String getNextBillNo();

  // Step 1: 'B'
  // meka fixed prefix ekak, bill number eka B walin patan gannawa
  // ex: B2600001

  // Step 2: DATE_FORMAT(CURDATE(), '%y')
  // ada thiyena year eke last digits 2 gannawa
  // 2026 -> 26

  // Step 3: SUBSTRING(t.billno, 5)
  // billno eke 5weni character eken passe number part eka gannawa
  // mokada 1 = B, 2-3 = year, 4-5 = prefix structure
  // ex: B2600001 -> 00001

  // Step 4: CAST(SUBSTRING(t.billno, 5) AS UNSIGNED)
  // number part eka string ekak widihata nemei integer ekak widihata convert
  // karanawa
  // '00001' -> 1

  // Step 5: MAX(CAST(SUBSTRING(t.billno, 5) AS UNSIGNED))
  // current year eke thiyena largest bill sequence number eka gannawa

  // Step 6: COALESCE(MAX(...), 0)
  // current year eke records nathnam MAX() null wenawa
  // e awasthawedi 0 gannawa

  // Step 7: COALESCE(MAX(...), 0) + 1
  // next bill sequence number eka hadanawa
  // ex: 4 -> 5, records nathnam 0 -> 1

  // Step 8: LPAD(number, 5, '0')
  // sequence number eka digits 5k wenna left side eken zeros add karanawa
  // 1 -> 00001

  // Step 9: CONCAT('B', DATE_FORMAT(CURDATE(), '%y'), LPAD(...))
  // B + current year + padded sequence number ekata ekathu karala final billno
  // hadanawa
  // ex: B + 26 + 00001 -> B2600001

  // Step 10: WHERE t.billno LIKE CONCAT('B', DATE_FORMAT(CURDATE(), '%y'), '%')
  // current year ekata adala bill numbers witharai filter karanne
  // LIKE kiyanne pattern match operator ekak
  // '%' kiyanne anything after that pattern

  // Step 11: meka nisa aluth awuruddak start unama previous year records ignore
  // wenawa
  // e nisa number eka auto reset wela new year ekata 00001 idala patan gannawa

  // Step 12: final result
  // current year eke last billno eka B2600004 nam next eka B2600005
  // current year eke record ekakuth nathnam next eka B2600001
}
