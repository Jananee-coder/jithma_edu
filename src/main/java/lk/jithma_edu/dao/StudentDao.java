package lk.jithma_edu.dao;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.jithma_edu.entity.Student;

// JpaRepository use karala CRUD methods (save, findById, findAll, deleteById) okkoma 
// automatic implement wenawa. Api handwritten methods danna ona na.
// JpaRepository<E, I> → E = Entity class, I = Primary key type.
public interface StudentDao extends JpaRepository<Student, Integer> {
    // 1.native => using databsename table anme
    // 2.JPQL (default active)=> using Entity class name ---Java Persistence Query
    // Language

    // Native query example
    // nativeQuery = true kiyanne JPA kiyanne me query eka **direct SQL query** ekak
    // wage run karanna
    // database table name saha column names use karanna puluwan
    // getNextStudentRegNo() → student table eke max(regno) balala next reg number
    // generate karanawa

    /*
     * @Query(value =
     * "SELECT coalesce(concat('ST', date_format(curdate(), '%y'), lpad(substring(max(s.regno), 5) + 1, 5, '0')), concat('ST',date_format(curdate(), '%y'), '00001')) FROM jithma_edu.student s"
     * , nativeQuery = true)
     * String getNextStudentRegNo();
     */

    // Testing db
    /*
     * @Query(value =
     * "SELECT concat('ST', date_format(curdate(), '%y'), lpad(coalesce(max(cast(substring(s.regno, 5) as unsigned)), 0) + 1, 5, '0')) FROM jithma_edu.student s WHERE s.regno LIKE concat('ST', date_format(curdate(), '%y'), '%')"
     * , nativeQuery = true)
     * String getNextStudentRegNo();
     */

    // Real db
    @Query(value = "SELECT concat('ST', date_format(curdate(), '%y'), lpad(coalesce(max(cast(substring(s.regno, 5) as unsigned)), 0) + 1, 5, '0')) FROM jithma_edu_clean.student s WHERE s.regno LIKE concat('ST', date_format(curdate(), '%y'), '%')", nativeQuery = true)
    String getNextStudentRegNo();

    // Step 1: 'ST'
    // meka fixed prefix ekak, student regno eka ST walin patan gannawa

    // Step 2: DATE_FORMAT(CURDATE(), '%y')
    // ada thiyena year eke last digits 2 gannawa // 2026 -> 26

    // Step 3: SUBSTRING(s.regno, 5)
    // regno eke 5weni character eken passe number part eka gannawa
    // mokada 1-2 = ST, 3-4 = year, 5 idan sequence number // ST2600001 -> 00001

    // Step 4: CAST(SUBSTRING(s.regno, 5) AS UNSIGNED)
    // number part eka string ekak widihata nemei integer ekak widihata ganan
    // karanna use karanawa // '00001' -> 1

    // Step 5: MAX(CAST(SUBSTRING(s.regno, 5) AS UNSIGNED))
    // current year eke thiyena loku ma sequence number eka gannawa

    // Step 6: COALESCE(MAX(...), 0)
    // current year eke records nathnam MAX() null wenawa e awasthawedi 0 gannawa

    // Step 7: COALESCE(MAX(...), 0) + 1
    // next student sequence number eka hadanawa // 4 -> 5, records nathnam 0 -> 1

    // Step 8: LPAD(number, 5, '0')
    // sequence number eka digits 5k wenna left side eken zeros add karanawa
    // 1 ->00001

    // Step 9: CONCAT('ST', DATE_FORMAT(CURDATE(), '%y'), LPAD(...))
    // ST + current year + padded sequence number ekata ekathu karala final regno
    // eka hadanawa
    // ST + 26 + 00001 -> ST2600001

    // Step 10: WHERE s.regno LIKE CONCAT('ST', DATE_FORMAT(CURDATE(), '%y'), '%')
    // current year ekata adala regno witharai filter karanne
    // LIKE kiyanne pattern match karana operator ekak, '%' kiyanne eeta passe
    // monawa unath match wenawa
    // 2026 nam ST26 walin patan ganna records witharai balanne

    // Step 11: meka nisa aluth awuruddak start unama previous year records ignore
    // wenawa
    // e nisa number eka auto reset wela new year ekata 00001 idala patan gannawa

    // Step 12: final result
    // current year eke last regno eka ST2600004 nam next eka ST2600005
    // current year eke record ekakuth nathnam next eka ST2600001

    @Query(value = "SELECT count(id) FROM studentpayment as s where student_id in (SELECT id FROM student where regno = ?1);", nativeQuery = true)
    String getStudentPayementCountByNumber(String studentRegNo);

    // JPQL use karanne entity class name (Employee) saha Java fields names
    // Database table name naththam
    // create query for get employee by given mobile no
    // @Query(value = "select s from Student s where s.whatsapno=?1")
    // Student getMobileno(String whatsapno);

    // gender eka anuwa student list eka database eken gannawa
    // example: Male dunnot Male students witharak return karanawa
    //List<Student> findByGender(String gender);

}
