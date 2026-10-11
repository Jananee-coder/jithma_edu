package lk.jithma_edu.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.jithma_edu.entity.User;

//JpaRepository use karala CRUD methods (save, findById, findAll, deleteById) automatic wenawa
//JpaRepository<E, I> --->  entity + primary key type set karanawa
public interface UserDao extends JpaRepository<User, Integer> {

    // Email eka use karala user kenek hoyaganna
    @Query(value = "select u from User u where u.email=?1")
    User getByUserEmail(String email);

    // Employee ID eka use karala user kenek hoyaganna
    @Query(value = "select u from User u where u.employee_id.id=?1")
    User getByEmployee_id(Integer id);

    // Admin nathuwa, required columns witharak ganna user list eka
    @Query("SELECT new User(u.id, u.username, u.email, u.employee_id, u.userstatus) " +
            "FROM User u WHERE u.username <> 'Admin'")
    List<User> getSelectedColumn();

    // Username eka use karala user kenek hoyaganna
    @Query(value = "select u from User u where u.username=?1")
    User getByUsername(String username);


    @Query(value = "SELECT name FROM role where id = (SELECT role_id FROM user_has_role where user_id = (SELECT id FROM user where username = ?1));", nativeQuery = true)
    String getUserRoleByUserName(String name);

   
}
