package lk.jithma_edu.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.jithma_edu.entity.Guardian;

// JpaRepository use karala CRUD methods (save, findById, findAll, deleteById) okkoma 
// automatic implement wenawa. Api handwritten methods danna ona na.
// JpaRepository<E, I> → E = Entity class, I = Primary key type.
public interface GuardianDao extends JpaRepository<Guardian, Integer> {
    // Query
    // 1.native => using databsename table anme
    // 2.JPQL (default active)=> using Entity class name ---Java Persistence Query
    // Language

    // Native query example
    // nativeQuery = true kiyanne JPA kiyanne me query eka **direct SQL query** ekak
    // wage run karanna
    // database table name saha column names use karanna puluwan

    // JPQL use karanne entity class name (Guardian) saha Java fields names
    // Database table name naththam
    // create query for get guardian by given mobile no
    @Query(value = "select g from Guardian g where g.mobileno=?1")
    Guardian getGuardianNo(String mobileno);

    // create query for get guardian by given nic
    @Query(value = "select g from Guardian g where g.nic=?1")
    Guardian getGuardianNic(String nic);

}
