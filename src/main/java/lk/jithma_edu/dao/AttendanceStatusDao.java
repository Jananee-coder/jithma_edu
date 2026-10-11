package lk.jithma_edu.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.jithma_edu.entity.Attendance;

public interface AttendanceStatusDao extends JpaRepository<Attendance,Integer>{

}
