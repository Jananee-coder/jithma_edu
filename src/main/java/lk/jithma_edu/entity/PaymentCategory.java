package lk.jithma_edu.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity // me class eka DB table ekakata map wenawa
@Table(name = "paymentcategory") // DB table eke name eka
@Data // Lombok use karala getters/setters/toString() auto generate wenawa
@AllArgsConstructor // all fields walata constructor ekak hadanawa
@NoArgsConstructor // JPA ta oni default constructor eka

public class PaymentCategory {

    @Id // primary key eka
    @GeneratedValue(strategy = GenerationType.IDENTITY) 
    // MySQL AUTO_INCREMENT wage id eka auto generate wenawa
    private Integer id;

    private String name; 
    // payment category name eka (example: Monthly Fee, Admission Fee, Exam Fee)

}