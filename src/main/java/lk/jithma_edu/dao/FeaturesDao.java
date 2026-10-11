package lk.jithma_edu.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.jithma_edu.entity.Features;

//JpaRepository use karala CRUD methods (save, findById, findAll, deleteById) automatic wenawa
//JpaRepository<E, I> --->  entity + primary key type set karanawa
public interface FeaturesDao extends JpaRepository<Features, Integer> {

    // Query
    // 1.native => using databsename table anme
    // 2.JPQL (default active)=> using Entity class name ---Java Persistence Query
    // Language

    // Native query example
    // nativeQuery = true kiyanne JPA kiyanne me query eka **direct SQL query** ekak
    // wage run karanna
    // database table name saha column names use karanna puluwan

    // JPQL use karanne entity class name (Features) saha Java fields names
    // Database table name naththam
    // Me query eka hall ekata assign wela naha thiyena features ganna use karanawa
    // select new Features(f.id, f.name) => Features entity eke constructor call
    // karanawa id saha name set karanna
    // f.id not in (...) => HallHasFeatures table eken hall ekata already assign
    // wela thiyana features exclude karanawa
    @Query("select new Features(f.id, f.name) from Features f " +
            "where f.id not in (select hhf.features_id.id from HallHasFeatures hhf where hhf.hall_id.id = ?1)")
    List<Features> listFeaturesWithoutHall(Integer hallId);
    // hallId => hall ekata id pass karanawa, me id eken hall ekata assign wela nathi
    // features gannawa
}
