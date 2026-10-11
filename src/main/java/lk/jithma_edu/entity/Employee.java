package lk.jithma_edu.entity;

import java.time.LocalDate;
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
@Table(name = "employee") // Table eke name eka define karanawa
@Data // Lombok use karanawa - getters/setters/toString() auto generate wenawa
@AllArgsConstructor // All arguments constructor ekak hadanawa
@NoArgsConstructor // Default constructor ekak hadanawa (JPA ta oni ekak)
public class Employee {
    @Id // Primary key eka
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    // ID auto increment wenawa (MySQL eke AUTO_INCREMENT wage)
    private Integer id;
    private String empno;
    private String fullname;
    private String callingname;
    private String nic;
    private String gender;
    private LocalDate dob;
    private String email;
    private String civilstatus;
    private String mobileno;
    private String landno;
    private String address;
    private byte[] photo;

    private LocalDateTime addeddatetime;
    private LocalDateTime updateddatetime;
    private LocalDateTime deleteddatetime;

    private Integer addeduser;
    private Integer updateduser;
    private Integer deleteduser;

    @ManyToOne // meka employee entity ekak designaion ekakata belong wenawa kiyala
    @JoinColumn(name = "designation_id", referencedColumnName = "id")
    // designation_id column eka Designation table eke id ekata link wenawa
    private Designation designation_id;

    @ManyToOne // meka employee entity ekak employee status ekakata belong wenawa kiyala
    @JoinColumn(name = "employeestatus_id", referencedColumnName = "id")
    // employeestatus_id column eka EmployeeStatus table eke id ekata link wenawa
    private EmployeeStatus employeestatus_id;
}
