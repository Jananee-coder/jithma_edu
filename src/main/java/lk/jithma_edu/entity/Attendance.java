package lk.jithma_edu.entity;

import java.time.LocalDateTime;
import java.time.LocalTime;

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
@Table(name = "attendance") // Table eke name eka define karanawa
@Data // Lombok use karanawa - getters/setters/toString() auto generate wenawa
@AllArgsConstructor // All arguments constructor ekak hadanawa
@NoArgsConstructor // Default constructor ekak hadanawa (JPA ta oni ekak)
public class Attendance {
    @Id // Primary key eka
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    // ID auto increment wenawa (MySQL eke AUTO_INCREMENT wage)
    private Integer id;

    private LocalTime checkin;

    private LocalDateTime adddatetime;
    private LocalDateTime updateddatetime;
    private LocalDateTime deleteddatetime;

    private Integer addeduser;
    private Integer updateduser;
    private Integer deleteduser;
    private Integer attendancestatus;

    @ManyToOne // map batch_id
    @JoinColumn(name = "batch_id", referencedColumnName = "id")
    private Batch batch_id;

    @ManyToOne // map student_id
    @JoinColumn(name = "student_id", referencedColumnName = "id")
    private Student student_id;
    
    @ManyToOne // map studentpayment_id
    @JoinColumn(name = "studentpayment_id", referencedColumnName = "id")
    private StudentPayment studentpayment_id;
     



}
