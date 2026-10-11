package lk.jithma_edu.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.jithma_edu.entity.Privilege;

// JpaRepository use karala CRUD methods (save, findById, findAll, deleteById) okkoma 
// automatic implement wenawa. Api handwritten methods danna ona na.
// JpaRepository<E, I> → E = Entity class, I = Primary key type.
public interface PrivilegeDao extends JpaRepository<Privilege, Integer> {

    // Custom query ekak. Me query eka Privilege table eken role id + module id
    // match wenawanam e Privilege record eka return karanawa.
    // '?1' → first parameter (roleid), '?2' → second parameter (moduleid)
    @Query(value = "select p from Privilege p where p.role_id.id = ?1 and p.module_id.id = ?2")
    Privilege getByRoleModule(Integer roleid, Integer moduleid);

    // Me query eka user kenekuta module ekak sambandawa thiyena permission 4
    // (select, insert, update, delete)
    // combine karala bit_or() walin permission set ekak return karanawa.
    // bit_or() → booleans combine karala final permission result ekak denna.
    // Username ekata adalawa roles ganna, e roles walin e module ekata adalawa
    // thiyena privilege combine karanawa.

    // Testing DB
    // @Query(value = "SELECT bit_or(p.privi_select) ,bit_or(p.privi_insert),bit_or(p.privi_update),bit_or(p.privi_delete) FROM jithma_edu.privilege as p where p.module_id in (select m.id from  jithma_edu.module as m where m.name=?2)and  p.role_id in (select uhr.role_id from  jithma_edu.user_has_role as uhr where uhr.user_id in (select u.id from jithma_edu.user as u where u.username=?1));", nativeQuery = true)

    // Real DB

       @Query(value = "SELECT bit_or(p.privi_select) ,bit_or(p.privi_insert),bit_or(p.privi_update),bit_or(p.privi_delete) FROM jithma_edu_clean.privilege as p where p.module_id in (select m.id from  jithma_edu_clean.module as m where m.name=?2)and  p.role_id in (select uhr.role_id from  jithma_edu_clean.user_has_role as uhr where uhr.user_id in (select u.id from jithma_edu_clean.user as u where u.username=?1));", nativeQuery = true)

    String getPrivilegeByUserAndModule(String username, String modulename);
}
