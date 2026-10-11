package lk.jithma_edu.dao;

import java.time.LocalTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.jithma_edu.entity.Batch;

// JpaRepository use karala CRUD methods (save, findById, findAll, deleteById) okkoma 
// automatic implement wenawa. Api handwritten methods danna ona na.
// JpaRepository<E, I> → E = Entity class, I = Primary key type.
public interface BatchDao extends JpaRepository<Batch, Integer> {
        // Query
        // 1.native => using databsename table anme
        // 2.JPQL (default active)=> using Entity class name ---Java Persistence Query
        // Language

        // Native query example
        // nativeQuery = true kiyanne JPA kiyanne me query eka **direct SQL query** ekak
        // wage run karanna
        // database table name saha column names use karanna puluwan

        // JPQL use karanne entity batch name (Batch) saha Java fields names
        // Database table name naththam
        // create query for get batch by given batchname
        @Query(value = "select b from Batch b where b.batchname=?1")
        Batch getBatchName(String batchname);

        // Specific student ekata sambandha registered batches ganima
        // Input: studentId (Student entity ekata primary key)
        // Output: List<Batch> → me student ekata sambandha thiyana batch okkoma
        // Assumption: StudentRegistration entity eke 'student_id' saha 'batch_id'
        // fields thiyenawa
        // Example: List<Batch> batches = batchDao.getRegisteredBatchesByStudentId(1);
        @Query("SELECT sr.batch_id FROM StudentRegistration sr WHERE sr.student_id.id = ?1")
        List<Batch> getRegisteredBatchesByStudentId(int studentId);

        @Query("select b from Batch b where b.classdetail_id.teacher_id.id=?1")
        List<Batch> getBatchByTeacher(int teacherId);

        // get batches by grade + teacher (via classdetail)
        @Query("select b from Batch b where b.classdetail_id.grade_id.id = ?1 and b.classdetail_id.teacher_id.id = ?2")
        List<Batch> getBatchByGradeAndTeacher(int gradeId, int teacherId);

        // Student nta ada class thiyanawada -- registered batches filter
        @Query("SELECT sr.batch_id FROM StudentRegistration sr WHERE sr.student_id.id=?1 AND sr.batch_id.weekday_id.name=?2")
        List<Batch> getTodayClassesByStudentId(int studentId, String dayname);

        // selected grade + subject + teacher walata adala batches filter karanawa
        @Query("select b from Batch b where b.classdetail_id.grade_id.id = ?1 and b.classdetail_id.subjectdetail_id.id = ?2 and b.classdetail_id.teacher_id.id = ?3")
        List<Batch> getBatchByGradeSubjectAndTeacher(int gradeId, int subjectId, int teacherId);

        // grade + subject + teacher match wena batches
        // + student already register wela nathi batches only gannawa
        @Query("SELECT b FROM Batch b JOIN b.classdetail_id cd " +
                        "WHERE cd.grade_id.id = ?1 " +
                        "AND cd.subjectdetail_id.id = ?2 " +
                        "AND cd.teacher_id.id = ?3 " +
                        "AND NOT EXISTS (" +
                        "SELECT sr FROM StudentRegistration sr " +
                        "WHERE sr.student_id.id = ?4 AND sr.batch_id.id = b.id)")
        List<Batch> getAvailableBatches(Integer gradeId, Integer subjectId, Integer teacherId, Integer studentId);

        // get today's available classes for notification
        // batch table eke weekday_id eka use karala weekday table ekata join karanawa
        // today day eka database eken gannawa
        // weekday table eke name eka ekka compare karala ada thiyena batches return
        // karanawa

        @Query(value = "SELECT b.* " +
                        "FROM batch b " +
                        "INNER JOIN weekday w ON b.weekday_id = w.id " +
                        "WHERE w.name = DAYNAME(CURDATE())", nativeQuery = true)
        List<Batch> findTodayClasses();

        /*
         * @Query(value
         * ="SELECT * FROM batch where weekday_id = (SELECT id FROM weekday where name = ?1) and endtime < ?2;"
         * , nativeQuery = true)
         * List<Batch> getOldBatchesByWeekday(DayOfWeek weekDay,LocalTime time);
         */

        // me query eken karanne selected teacher kenekta adala batches tika ganna
        // batch table eke teacher_id direct nathi nisa classdetail table eka join
        // karanawa
        // classdetail table eke teacher_id use karala adala batches filter karanawa

        // SELECT *
        // batch table eka alias ekak widihata b kiyala define karanawa
        // FROM jithma_edu_clean.batch AS b
        // batch ekata adala classdetail details ganna join karanawa
        // INNER JOIN jithma_edu_clean.classdetail AS cd
        // batch table eke classdetail_id eka classdetail table eke id ekata match
        // karanawa
        // ON b.classdetail_id = cd.id
        // given teacher id ekata adala batches witharak return karanawa
        // WHERE cd.teacher_id = 1;

        @Query(value = "SELECT * FROM batch WHERE weekday_id = (SELECT id FROM weekday WHERE name = ?1) AND endtime < ?2", nativeQuery = true)
        List<Batch> getOldBatchesByWeekday(String weekDay, LocalTime time);

}