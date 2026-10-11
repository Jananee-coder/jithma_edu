package lk.jithma_edu.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.jithma_edu.entity.TeacherPayStatus;


// JpaRepository use karala CRUD methods (save, findById, findAll, deleteById) okkoma 
// automatic implement wenawa. Api handwritten methods danna ona na.
// JpaRepository<E, I> → E = Entity class, I = Primary key type.
public interface TeacherPayStatusDao extends JpaRepository<TeacherPayStatus, Integer> {
    
}
