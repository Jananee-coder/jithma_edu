package lk.jithma_edu.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

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
@Table(name = "teacherpayment") // Table eke name eka define karanawa
@Data // Lombok use karanawa - getters/setters/toString() auto generate wenawa
@AllArgsConstructor // All arguments constructor ekak hadanawa
@NoArgsConstructor // Default constructor ekak hadanawa (JPA ta oni ekak)
public class TeacherPayment {

    @Id // Primary key eka
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    // ID auto increment wenawa (MySQL eke AUTO_INCREMENT wage)
    private Integer id;

    private String billno;
    private BigDecimal enrollmentamount;
    private BigDecimal paidamount;
    private String refrenceno;
    private LocalDateTime addeddatetime;
    private Integer addeduser;

    @ManyToOne
    @JoinColumn(name = "teacher_id", referencedColumnName = "id")
    // Teacher table ekata foreign key relation eka
    private Teacher teacher_id;

    @ManyToOne
    @JoinColumn(name = "teacherpaystatus_id", referencedColumnName = "id")
    // TeacherPayStatus table ekata foreign key relation eka
    private TeacherPayStatus teacherpaystatus_id;

    @ManyToOne
    @JoinColumn(name = "enrollment_id", referencedColumnName = "id")
    // Enrollment record ekata foreign key relation eka
    private Enrollment enrollment_id;

    @ManyToOne
    @JoinColumn(name = "teacherpaymethod_id", referencedColumnName = "id")
    // TeacherPayMethod ekata foreign key relation eka
    private TeacherPayMethod teacherpaymethod_id;

}
