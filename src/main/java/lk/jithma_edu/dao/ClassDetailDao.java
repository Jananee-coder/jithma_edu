package lk.jithma_edu.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.jithma_edu.entity.ClassDetail;
import lk.jithma_edu.entity.Teacher;

//JpaRepository use karala CRUD methods (save, findById, findAll, deleteById) automatic wenawa
//JpaRepository<E, I> --->  entity + primary key type set karanawa
public interface ClassDetailDao extends JpaRepository<ClassDetail, Integer> {
    // Query
    // 1.native => using databsename table anme
    // 2.JPQL (default active)=> using Entity class name ---Java Persistence Query
    // Language

    // Native query example
    // nativeQuery = true kiyanne JPA kiyanne me query eka **direct SQL query** ekak
    // wage run karanna
    // database table name saha column names use karanna puluwan

    // JPQL use karanne entity class name (ClassDetail) saha Java fields names
    // Database table name naththam
    // create query for get classdetail by given classname
    @Query(value = "select cd from ClassDetail cd where cd.classname=?1")
    ClassDetail getClassname(String classname);

    // list krnawa active ClassDetail names
    @Query("SELECT new ClassDetail(cd.id, cd.classname) " +
            "FROM ClassDetail cd WHERE cd.classdetailstatus_id.id = 1")
    List<ClassDetail> getActiveClassDetails();

    // selected grade ekata adala teachers DB eken ganna
    @Query(value = "SELECT DISTINCT t.* FROM teacher t INNER JOIN classdetail cd ON cd.teacher_id=t.id WHERE cd.grade_id=?1", nativeQuery = true)
    List<Teacher> getTeachersByGrade(Integer gradeId);

    // selected grade ekata adala teachers DB eken ganna
    @Query(value = "SELECT DISTINCT t.* FROM teacher t INNER JOIN classdetail cd ON cd.teacher_id=t.id WHERE cd.subjectdetail_id=?1", nativeQuery = true)
    List<Teacher> getTeachersBySubject(Integer subjectId);

}