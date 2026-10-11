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
@Table(name = "classdetail") // Table eke name eka define karanawa
@Data // Lombok use karanawa - getters/setters/toString() auto generate wenawa
@AllArgsConstructor // All arguments constructor ekak hadanawa
@NoArgsConstructor // Default constructor ekak hadanawa (JPA ta oni ekak)
public class ClassDetail {
    @Id // Primary key eka
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    // ID auto increment wenawa (MySQL eke AUTO_INCREMENT wage)
    private Integer id;
    private String classname;

    private LocalDateTime addeddatetime;
    private LocalDateTime updateddatetime;
    private LocalDateTime deleteddatetime;

    private Integer addeduser;
    private Integer updateduser;
    private Integer deleteduser;

    @ManyToOne // meka ClassDetail entity ekak Grade ekakata belong wenawa kiyala
    @JoinColumn(name = "grade_id", referencedColumnName = "id")
    // grade_id column eka Grade table eke id ekata link wenawa
    private Grade grade_id;

    @ManyToOne // meka ClassDetail entity ekak ClassDetailStatus ekakata belong wenawa kiyala
    @JoinColumn(name = "classdetailstatus_id", referencedColumnName = "id")
    // classdetailstatus_id column eka ClassDetailStatus table eke id ekata link
    // wenawa
    private ClassDetailStatus classdetailstatus_id;

    @ManyToOne // meka ClassDetail entity ekak SubjectDetail ekakata belong wenawa kiyala
    @JoinColumn(name = "subjectdetail_id", referencedColumnName = "id")
    // subjectdetail_id column eka SubjectDetail table eke id ekata link
    // wenawa
    private SubjectDetail subjectdetail_id;

    @ManyToOne // meka ClassDetail entity ekak Teacher ekakata belong wenawa kiyala
    @JoinColumn(name = "teacher_id", referencedColumnName = "id")
    // teacher_id column eka Teacher table eke id ekata link
    // wenawa
    private Teacher teacher_id;

    public ClassDetail(Integer id, String classname) {
        this.id = id;
        this.classname = classname;
    }
}
