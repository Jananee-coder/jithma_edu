package lk.jithma_edu.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.jithma_edu.entity.TeacherPayMethod;


//JpaRepository use karala CRUD methods (save, findById, findAll, deleteById) automatic wenawa
//JpaRepository<E, I> --->  entity + primary key type set karanawa
public interface TeacherPayMethodDao extends JpaRepository<TeacherPayMethod , Integer>{
    
}
