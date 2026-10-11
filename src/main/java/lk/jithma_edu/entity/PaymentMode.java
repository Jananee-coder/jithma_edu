package lk.jithma_edu.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity // This class is mapped to a database table
@Table(name = "paymentmode") // Name of the table in the database
@Data // Lombok annotation to generate getters, setters, toString, etc.
@AllArgsConstructor // Constructor with all fields
@NoArgsConstructor // Default constructor required by JPA

public class PaymentMode {

    @Id // Primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    // Auto-increment ID (MySQL AUTO_INCREMENT)
    private Integer id;

    private String name;
    // Payment mode (example: Online, Physical)

}