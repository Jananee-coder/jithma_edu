package lk.jithma_edu.dao;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.jithma_edu.entity.Student;
import lk.jithma_edu.entity.StudentRegistration;

//JpaRepository use karala CRUD methods (save, findById, findAll, deleteById) automatic wenawa
//JpaRepository<E, I> --->  entity + primary key type set karanawa
public interface StudentRegistrationDao extends JpaRepository<StudentRegistration, Integer> {

    @Query("SELECT sr FROM StudentRegistration sr WHERE sr.student_id.id = ?1 AND sr.batch_id.id = ?2")
    // SELECT sr -> StudentRegistration object eka return karanawa
    // sr.student_id.id = ?1 -> 1st parameter eka studentId
    // sr.batch_id.id = ?2 -> 2nd parameter eka batchId
    // me query eken specific student ekata adala specific batch registration record
    // eka gannawa
    StudentRegistration getStudentRegistrationByStudentAndBatch(int studentId, int batchId);

    // batch ekata adalwa studentla keeyak register wela innawada balana eka
    @Query("select count(sr) from StudentRegistration sr where sr.batch_id.id = ?1")
    Long getStudentCountByBatch(int batchId);

    // batch ekata adala FREE students count eka gannawa
    @Query("select count(sr) from StudentRegistration sr where sr.batch_id.id = ?1 and sr.regtype_id.id = 2")
    Long getFreeCountByBatch(int batchId);

    // selected student saha batch ekata adala registration eka gnnawa
    @Query("select sr from StudentRegistration sr where sr.student_id.id=?1 and sr.batch_id.id=?2")
    StudentRegistration getByStudentAndBatch(Integer studentId, Integer batchId);

    // student ge registered batch list eka gannawa
    @Query("select sr from StudentRegistration sr where sr.student_id.id=?1")
    List<StudentRegistration> getRegistrationsByStudent(Integer studentId);

    /*
     * @Query(value =
     * "SELECT * FROM student where id in (SELECT student_id FROM studentregistration where batch_id = ?1);"
     * , nativeQuery = true)
     * List<Student> getStudentsByBatches(Integer id);
     */

    // selected batch eke register wela inna namuth selected date eke present
    // attendance mark wela nathi students tika gannawa
    /*
     * @Query(value =
     * "SELECT student_id FROM studentregistration as s where batch_id = ?1 and not exists (SELECT student_id FROM attendance as a where DATE(adddatetime)=?2 and batch_id=?3 and attendancestatus=1 and s.student_id = a.student_id);"
     * , nativeQuery = true)
     * List<Student> getStudentsByBatches(Integer batchId, LocalDate today, Integer
     * attendanceBatchId);
     */

    // student table eken student details gannawa
    // studentregistration table eka use karala selected batch eke students filter karanawa
    // attendance table eke adata already attendance mark karapu students exclude karanawa
    // e nisa attendance nathi students witharak return karanawa
    @Query(value = "SELECT st.* FROM student st INNER JOIN studentregistration s ON st.id = s.student_id WHERE s.batch_id = ?1 AND NOT EXISTS (SELECT a.student_id FROM attendance a WHERE DATE(a.adddatetime)=?2 AND a.batch_id=?3 AND a.attendancestatus=1 AND st.id = a.student_id);", nativeQuery = true)
    List<Student> getStudentsByBatches(Integer batchId, LocalDate today, Integer attendanceBatchId);
}
