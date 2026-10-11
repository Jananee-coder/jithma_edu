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
@Table(name = "paymentmethod") // DB table eke name eka define karanawa
@Data // Lombok use karala getters/setters/toString() auto generate wenawa
@AllArgsConstructor // all fields walata constructor ekak hadanawa
@NoArgsConstructor // JPA ta oni default constructor eka

public class PaymentMethod {

    @Id // primary key eka
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    // ID eka auto increment wenawa (MySQL AUTO_INCREMENT wage)
    private Integer id;

    private String name;
    // payment method name eka (example: Cash, Card, Bank Transfer, Online)

}
