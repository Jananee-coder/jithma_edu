package lk.jithma_edu.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.jithma_edu.entity.Module;

//JpaRepository use karala CRUD methods (save, findById, findAll, deleteById) automatic wenawa
//JpaRepository<E, I> --->  entity + primary key type set karanawa
public interface ModuleDao extends JpaRepository<Module, Integer> {

    // login wela inna user ge id eka use karala e user ta SELECT permission nathi
    // modules hoyaganna
    // privilege table eken permission check karanawa
    // user_has_role table eken user ge roles gannawa
    // NOT IN use karala permission nathi modules witharai return karanawa

    // testing db
    /* @Query(value = "SELECT * FROM jithma_edu.module AS m WHERE m.id NOT IN (SELECT p.module_id FROM jithma_edu.privilege AS p WHERE p.privi_select = 1 AND p.role_id IN (SELECT uhr.role_id FROM jithma_edu.user_has_role AS uhr WHERE uhr.user_id = ?1))", nativeQuery = true)
    List<Module> getModuleByLoggedUser(Integer id); */

    //real db
    @Query(value = "SELECT * FROM jithma_edu_clean.module AS m WHERE m.id NOT IN (SELECT p.module_id FROM jithma_edu_clean.privilege AS p WHERE p.privi_select = 1 AND p.role_id IN (SELECT uhr.role_id FROM jithma_edu_clean.user_has_role AS uhr WHERE uhr.user_id = ?1))", nativeQuery = true)
    List<Module> getModuleByLoggedUser(Integer id);
    
}
