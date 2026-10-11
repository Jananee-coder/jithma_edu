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
@Table(name = "student") // Table eke name eka define karanawa
@Data // Lombok use karanawa - getters/setters/toString() auto generate wenawa
@AllArgsConstructor // All arguments constructor ekak hadanawa
@NoArgsConstructor // Default constructor ekak hadanawa (JPA ta oni ekak)
public class Student {
    @Id // Primary key eka
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    // ID auto increment wenawa (MySQL eke AUTO_INCREMENT wage)
    private Integer id;
    private String regno;
    private String fullname;
    private String callingname;
    private String nic;
    private String gender;
    private LocalDate dob;
    private String address;
    private String whatsapno;
    private String landno;
    private String schoolname;
    private byte[] photo;

    private LocalDateTime addeddatetime;
    private LocalDateTime updateddatetime;
    private LocalDateTime deleteddatetime;

    private Integer addeduser;
    private Integer updateduser;
    private Integer deleteduser;

    @ManyToOne // meka student entity ekak studentstatus ekakata belong wenawa kiyala
    @JoinColumn(name = "studentstatus_id", referencedColumnName = "id")
    // studentstatus_id column eka Student table eke id ekata link wenawa
    private StudentStatus studentstatus_id;

    @ManyToOne // meka student entity ekak guardian ekakata belong wenawa kiyala
    @JoinColumn(name = "guardian_id", referencedColumnName = "id")
    // guardian_id column eka Student table eke id ekata link wenawa
    private Guardian guardian_id;

}
