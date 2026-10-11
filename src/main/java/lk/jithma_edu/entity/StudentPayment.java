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
@Table(name = "studentpayment") // Table eke name eka define karanawa
@Data // Lombok use karala getters/setters/toString() auto generate wenawa
@AllArgsConstructor // All arguments constructor ekak hadanawa
@NoArgsConstructor // Default constructor ekak hadanawa (JPA ta oni ekak)
public class StudentPayment {

    @Id // Primary key eka
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    // ID auto increment wenawa (MySQL eke AUTO_INCREMENT wage)
    private Integer id;

    private String paymentno; // Payment number (char(10))
    private String paymonth; // Payment month (char(12))
    private BigDecimal totalamount; // Total amount of the payment (decimal(10,2))
    private BigDecimal paidamount; // Amount actually paid (decimal(10,2))
    private BigDecimal balanceamount; // Remaining balance (decimal(10,2))
    private String referenceno;

    private LocalDateTime addeddatetime; // Timestamp when the payment was added
    private Integer addeduser; // ID of the user who added this payment

    @ManyToOne // meka StudentRegistration entity ekata belong wenawa
    @JoinColumn(name = "studentregistration_id", referencedColumnName = "id")
    private StudentRegistration studentregistration_id;

    @ManyToOne // meka Student entity ekata belong wenawa
    @JoinColumn(name = "student_id", referencedColumnName = "id")
    private Student student_id;

    @ManyToOne // meka PaymentMethod entity ekata belong wenawa (Cash, Card, Bank)
    @JoinColumn(name = "paymentmethod_id", referencedColumnName = "id")
    private PaymentMethod paymentmethod_id;

    @ManyToOne // meka PaymentCategory entity ekata belong wenawa (Monthly Fee, Exam Fee)
    @JoinColumn(name = "paymentcategory_id", referencedColumnName = "id", unique = true)
    private PaymentCategory paymentcategory_id;

    @ManyToOne // meka PaymentMode entity ekata belong wenawa (Online, Physical)
    @JoinColumn(name = "paymentmode_id", referencedColumnName = "id")
    private PaymentMode paymentmode_id;

}