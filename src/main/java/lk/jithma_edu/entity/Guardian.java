package lk.jithma_edu.entity;

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
@Table(name = "guardian") // Table eke name eka define karanawa
@Data // Lombok use karanawa - getters/setters/toString() auto generate wenawa
@AllArgsConstructor // All arguments constructor ekak hadanawa
@NoArgsConstructor // Default constructor ekak hadanawa (JPA ta oni ekak)
public class Guardian {

    @Id // Primary key eka
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    // ID auto increment wenawa (MySQL eke AUTO_INCREMENT wage)
    private Integer id;
    private String guardianname;
    private String address;
    private String mobileno;
    private String nic;
    private String otherguardian;
    private LocalDateTime addeddatetime;
    private LocalDateTime updateddeletetime;
    private LocalDateTime deleteddatetime;
    private Integer addeduser;
    private Integer updateduser;
    private Integer deleteduser;

    @ManyToOne // meka guardian entity ekak guardiantype ekakata belong wenawa kiyala
    @JoinColumn(name = "guardiantype_id", referencedColumnName = "id")
    // guardiantype_id column eka GuardianType table eke id ekata link wenawa
    private GuardianType guardiantype_id;

    @ManyToOne // meka guardian entity ekak guardianstatus ekakata belong wenawa kiyala
    @JoinColumn(name = "guardianstatus_id", referencedColumnName = "id")
    // guardianstatus_id column eka GuardianStatus table eke id ekata link wenawa
    private GuardianStatus guardianstatus_id;
}
