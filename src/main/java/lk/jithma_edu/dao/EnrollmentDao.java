package lk.jithma_edu.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.jithma_edu.entity.Enrollment;

// JpaRepository use karala CRUD methods (save, findById, findAll, deleteById) okkoma 
// automatic implement wenawa. Api handwritten methods danna ona na.
// JpaRepository<E, I> → E = Entity class, I = Primary key type.
public interface EnrollmentDao extends JpaRepository<Enrollment, Integer> {

    // check same teacher + same month enrollment ekak already thiyanawada
    @Query("select e from Enrollment e where e.teacher_id.id=?1 and e.enrollmentmonth=?2")
    Enrollment getByTeacherAndMonth(Integer id, String enrollmentmonth);

    @Query("SELECT e FROM Enrollment e WHERE e.teacher_id.id=?1 AND e.enrollmentstatus_id.id=1")
    public List<Enrollment> getPendingEnrollmentsByTeacher(Integer teacherid);

    

}
