package lk.jithma_edu.dao;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.jithma_edu.entity.Attendance;


// JpaRepository use karala CRUD methods (save, findById, findAll, deleteById) automatic wenawa
// JpaRepository<E, I> ---> entity + primary key type set karanawa
public interface AttendanceDao extends JpaRepository<Attendance, Integer> {

    //@Query("select a from Attendance a where a.student_id = ?1 and a.batch_id = ?2")
    //Attendance getByStudentAndDateAndBatch(Student student_id, Batch batch_id);

    // get attendance dates by batch
    @Query(value = "select distinct date(a.adddatetime) from attendance a where a.batch_id=?1 order by date(a.adddatetime) desc", nativeQuery = true)
    List<String> getAttendanceDatesByBatch(Integer batchId);

    // student, batch saha selected date range ekata adala attendance record ekak
    // hoyanawa
    @Query("SELECT a FROM Attendance a WHERE a.student_id.id = ?1 AND a.batch_id.id = ?2 AND a.adddatetime BETWEEN ?3 AND ?4")

    // found unoth existing attendance object eka return karanawa
    // record ekak nathnam null return wenawa
    Attendance getByStudentAndBatchAndDate(
            Integer studentId, // attendance record eka hoyana student id eka
            Integer batchId, // attendance record eka hoyana batch id eka
            LocalDateTime startDate, // adala dinaye patan ganna welawa (00:00)
            LocalDateTime endDate // adala dinaye awasanaya (23:59)
    );

}
