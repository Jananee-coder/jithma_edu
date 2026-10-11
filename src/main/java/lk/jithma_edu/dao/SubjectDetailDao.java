package lk.jithma_edu.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.jithma_edu.entity.SubjectDetail;

//JpaRepository use karala CRUD methods (save, findById, findAll, deleteById) automatic wenawa
//JpaRepository<E, I> --->  entity + primary key type set karanawa
public interface SubjectDetailDao extends JpaRepository<SubjectDetail, Integer> {

    // grade ekata adala subjects okkoma gannawa
    @Query("SELECT cd.subjectdetail_id FROM ClassDetail cd WHERE cd.grade_id.id = ?1")
    List<SubjectDetail> getByGrade(Integer gradeId);
}
