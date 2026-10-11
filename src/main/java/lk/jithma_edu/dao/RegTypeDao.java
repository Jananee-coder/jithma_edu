package lk.jithma_edu.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.jithma_edu.entity.RegType;

// JpaRepository use karala CRUD methods automatic wenawa
// JpaRepository<Entity, PrimaryKeyType>
public interface RegTypeDao extends JpaRepository<RegType, Integer> {

}