package lk.jithma_edu.dao;


import java.time.LocalTime;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.jithma_edu.entity.HallAllocation;

// JpaRepository use karala CRUD methods (save, findById, findAll, deleteById) automatic wenawa
// JpaRepository<E, I> ---> entity + primary key type set karanawa
public interface HallAllocationDao extends JpaRepository<HallAllocation, Integer> {

    @Query("select h from HallAllocation h where h.hall_id.id=?1 and h.weekday_id.id=?2 and h.starttime=?3")
    HallAllocation getByExactAllocation(Integer hallId, Integer weekdayId, LocalTime starttime);

}