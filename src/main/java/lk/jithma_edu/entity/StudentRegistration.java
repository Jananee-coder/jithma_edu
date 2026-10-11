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
@Table(name = "studentregistration") // Table eke name eka define karanawa
@Data // Lombok use karanawa - getters/setters/toString() auto generate wenawa
@AllArgsConstructor // All arguments constructor ekak hadanawa
@NoArgsConstructor // Default constructor ekak hadanawa (JPA ta oni ekak)
public class StudentRegistration {
    @Id // Primary key eka
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    // ID auto increment wenawa (MySQL eke AUTO_INCREMENT wage)
    private Integer id;

    private String regfee;// registration fee

    // add,update.delete time
    private LocalDateTime addeddatetime;
    private LocalDateTime updateddatetime;
    private LocalDateTime deleteddatetime;

    // who add,update,delete
    private Integer addeduser;
    private Integer updateduser;
    private Integer deleteduser;

    @ManyToOne // meka student registration ekak reg type ekakata belong wenawa
    @JoinColumn(name = "regtype_id", referencedColumnName = "id")
    // regtype_id column eka StudentRegistration table eke RegType table eke id
    // ekata link wenawa
    private RegType regtype_id;

    @ManyToOne // meka student entity ekak registration status ekakata belong wenawa kiyala
    @JoinColumn(name = "student_id", referencedColumnName = "id")
    // student_id column eka StudentRegistration table eke id ekata link wenawa
    private Student student_id;

    @ManyToOne // meka batch entity ekak registration status ekakata belong wenawa kiyala
    @JoinColumn(name = "batch_id", referencedColumnName = "id")
    // batch_id column eka StudentRegistration table eke id ekata link wenawa
    private Batch batch_id;

    @ManyToOne // meka studentregstatus entity ekak registration status ekakata belong wenawa
               // kiyala
    @JoinColumn(name = "studentregstatus_id", referencedColumnName = "id")
    // studentregstatus_id column eka StudentRegistration table eke id ekata link
    // wenawa
    private StudentRegStatus studentregstatus_id;
}