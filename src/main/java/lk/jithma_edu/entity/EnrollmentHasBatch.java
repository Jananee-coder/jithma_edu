package lk.jithma_edu.entity;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity // Entity kiyala kiyanne me class eka DB table ekakata map wenawa
@Table(name = "enrollment_has_batch") // Table eke name eka define karanawa
@Data // Lombok use karanawa - getters/setters/toString() auto generate wenawa
@AllArgsConstructor // All args constructor ekak hadanawa
@NoArgsConstructor // Default constructor ekak hadanawa (JPA ta oni ekak)
public class EnrollmentHasBatch {

    @Id // Primary key eka
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    // ID auto increment wenawa (MySQL eke AUTO_INCREMENT wage)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "enrollment_id", referencedColumnName = "id")
    // enrollment_id column eka Enrollment table eke id ekata link wenawa
    @JsonIgnore
    private Enrollment enrollment_id;

    @ManyToOne
    @JoinColumn(name = "batch_id", referencedColumnName = "id")
    // batch_id column eka Batch table eke id ekata link wenawa
    private Batch batch_id;

    private BigDecimal batchfee;
    private Integer registercount;
    private Integer paidcount;
    private BigDecimal totalincome;
    private Integer totalfreecardcount;
    private Integer registeredfreecardcount;
    private Integer availablefreecardcount;
    private BigDecimal additionalcharges;
}
