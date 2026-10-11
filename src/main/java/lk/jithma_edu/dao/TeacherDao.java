package lk.jithma_edu.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.jithma_edu.entity.Teacher;

// JpaRepository use karala CRUD methods (save, findById, findAll, deleteById) automatic wenawa
// JpaRepository<E, I> ---> Entity class eka saha Primary Key type eka define karanawa
public interface TeacherDao extends JpaRepository<Teacher, Integer> {

    // Query
    // 1. Native Query => database table name saha column names use karanawa
    // 2. JPQL (default active) => Entity class name saha Java field names use
    // karanawa

    // Native query example
    // nativeQuery = true kiyala dunnama JPA eka meka direct SQL query ekak wage run
    // karanawa
    // database table name saha column names use karanna puluwan

    // getNextTeacherNo() → teacher table eke max(teacherno) balala next teacher

    // max(t.teacherno)
    // teacher table eke thiyena highest teacherno eka gannawa Example -> TH00015
    // substring(max(t.teacherno),3)
    // "TH" prefix eka remove karala number part eka gannawa TH00015 -> 00015
    // +1
    // number eka next value ekata increase karanawa 00015 -> 16
    // lpad(...,5,'0')
    // number eka digits 5k wenna zero walin pad karanawa 16 -> 00016
    // concat('TH', ...)
    // new number ekata "TH" prefix eka add karanawa 00016 -> TH00016
    // coalesce(...,'TH00001')
    // table eka empty nam max value null wenawa
    // e welawata default teacher number eka widiyata TH00001 return karanawa

    // Testing db
    /*
     * @Query(value =
     * "SELECT coalesce(concat('TH',lpad(substring(max(t.teacherno),3)+1,5,'0')),'TH00001') FROM jithma_edu.teacher as t;"
     * , nativeQuery = true)
     * public String getNextTeacherNo();
     */

    // Real db
    @Query(value = "SELECT coalesce(concat('TH',lpad(substring(max(t.teacherno),3)+1,5,'0')),'TH00001') FROM jithma_edu_clean.teacher as t;", nativeQuery = true)
    public String getNextTeacherNo();

    // JPQL use karanne entity class name (Teacher) saha Java fields names
    // Database table name use karanne naha

    // create query for get teacher by given NIC
    @Query(value = "select t from Teacher t where t.nic=?1")
    Teacher getByNic(String nic);

    // create query for get teacher by given mobile number
    @Query(value = "select t from Teacher t where t.mobilenobusiness=?1")
    Teacher getByMobile(String mobilenobusiness);

    // create query for get teacher by given email
    @Query(value = "select t from Teacher t where t.email=?1")
    Teacher getByEmail(String email);

    // grade ekata saha subject ekata adala teachers gannawa
    @Query("SELECT DISTINCT cd.teacher_id FROM ClassDetail cd WHERE cd.grade_id.id = ?1 AND cd.subjectdetail_id.id = ?2")
    List<Teacher> getByGradeAndSubject(Integer gradeId, Integer subjectId);

    // type karana bank branch name eka teacher table eke hoyanawa
    // ex: "neg" dunnoth "Negombo Main Branch" wage values enawa
    // SQL -> LIKE '%neg%'
    List<Teacher> findByBankbranchContainingIgnoreCase(String bankbranch);

    // selected subject ekata adala teachers DB eken ganna
    @Query(value = "SELECT * FROM teacher WHERE subjectdetail_id = ?1", nativeQuery = true)
    List<Teacher> getTeachersBySubject(Integer subjectId);
}