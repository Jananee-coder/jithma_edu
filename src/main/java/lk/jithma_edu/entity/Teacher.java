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
@Table(name = "teacher") // Table eke name eka define karanawa
@Data // Lombok use karanawa - getters/setters/toString() auto generate wenawa
@AllArgsConstructor // All arguments constructor ekak hadanawa
@NoArgsConstructor // Default constructor ekak hadanawa (JPA ta oni ekak)
public class Teacher {
    @Id // Primary key eka
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    // ID auto increment wenawa (MySQL eke AUTO_INCREMENT wage)
    private Integer id;

    private String teacherno;
    private String fullname;
    private String callingname;
    private String nic;
    private String gender;
    private LocalDate dob;
    private String address;
    private String mobilenobusiness;
    private String mobilenoprivate;
    private String email;
    private String qualification;
    private byte[] teacherphoto;
    private String schoolname;
    private String bankacnumber;
    private String bankbranch;
    private String bankholdername;

    private LocalDateTime addeddatetime;
    private LocalDateTime updateddatetime;
    private LocalDateTime deleteddatetime;

    private Integer addeduser;
    private Integer updateduser;
    private Integer deleteduser;

    @ManyToOne // meka Teacher entity ekak TeacherStatus ekakata belong wenawa kiyala
    @JoinColumn(name = "teacherstatus_id", referencedColumnName = "id")
    // teacherstatus_id column eka TeacherStatus table eke id ekata link wenawa
    private TeacherStatus teacherstatus_id;

    @ManyToOne // meka Teacher entity ekak Bank ekakata belong wenawa kiyala
    @JoinColumn(name = "bank_id", referencedColumnName = "id")
    // bank_id column eka Bank table eke id ekata link wenawa
    private Bank bank_id;

    @ManyToOne // meka Teacher entity ekak SubjectDetail ekakata belong wenawa kiyala
    @JoinColumn(name = "subjectdetail_id", referencedColumnName = "id")
    // subjectdetail_id column eka SubjectDetail table eke id ekata link
    // wenawa
    private SubjectDetail subjectdetail_id;

}
