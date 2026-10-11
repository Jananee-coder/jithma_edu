package lk.jithma_edu.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.jithma_edu.entity.Role;

//JpaRepository use karala CRUD methods (save, findById, findAll, deleteById) automatic wenawa
//JpaRepository<E, I> --->  entity + primary key type set karanawa
public interface RoleDao extends JpaRepository<Role, Integer> {

    // Admin role eka hariyata exclude karala role list eka ganna query ekak
    @Query(value = "select r from Role r where r.name<> 'Admin'")
    List<Role> getAllRolesWithoutAdmin();

    // User id eka anuwa adala roles tika database eken gannawa
    @Query(value = "select r from Role r where r.id in (select uhr.role_id.id FROM UserHasRole uhr where uhr.user_id.id =?1)")
    List<Role> getRoleByUserId(Integer userid);

}
