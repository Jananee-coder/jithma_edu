package lk.jithma_edu.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity // Me class eka DB table ekakata map wenawa
@Table(name = "regtype") // Table name eka
@Data // getters/setters/toString() auto generate wenawa
@AllArgsConstructor // All args constructor
@NoArgsConstructor // Default constructor (JPA ta oni)
public class RegType {

    @Id // Primary key eka
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name; // Registration type name eka
}