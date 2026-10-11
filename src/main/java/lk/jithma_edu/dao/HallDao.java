package lk.jithma_edu.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.jithma_edu.entity.Hall;

//JpaRepository use karala CRUD methods (save, findById, findAll, deleteById) automatic wenawa
//JpaRepository<E, I> --->  entity + primary key type set karanawa
public interface HallDao extends JpaRepository<Hall, Integer> {

    // Query
    // 1.native => using databsename table anme
    // 2.JPQL (default active)=> using Entity class name ---Java Persistence Query
    // Language

    // Native query example
    // nativeQuery = true kiyanne JPA kiyanne me query eka **direct SQL query** ekak
    // wage run karanna
    // database table name saha column names use karanna puluwan

    // JPQL use karanne entity class name (Hall) saha Java fields names
    // Database table name naththam
    // create query for get hall by given name
    @Query(value = "select h from Hall h where h.name=?1")
    Hall getHallName(String name);

}
