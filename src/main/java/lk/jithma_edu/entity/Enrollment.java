package lk.jithma_edu.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity // Entity kiyala kiyanne me class eka DB table ekakata map wenawa
@Table(name = "enrollment") // Table eke name eka define karanawa
@Data // Lombok use karanawa - getters/setters/toString() auto generate wenawa
@AllArgsConstructor // All args constructor ekak hadanawa
@NoArgsConstructor // Default constructor ekak hadanawa (JPA ta oni ekak)
public class Enrollment {

    @Id // Primary key eka
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    // ID auto increment wenawa (MySQL eke AUTO_INCREMENT wage)
    private Integer id;

    private String enrollmentmonth;
    private BigDecimal totalbatchincome;
    private BigDecimal totalservicecharge;
    private BigDecimal totaladditionalcharge;
    private BigDecimal netamount;
    private BigDecimal finalamount;

    private LocalDateTime addeddatetime;
    private LocalDateTime updateddatetime;
    private LocalDateTime deleteddatetime;

    private Integer addeduser;
    private Integer updateduser;
    private Integer deleteduser;

    @ManyToOne // meka enrollment entity ekak enrollment status ekakata belong wenawa kiyala
    @JoinColumn(name = "enrollmentstatus_id", referencedColumnName = "id")
    // enrollmentstatus_id column eka EnrollmentStatus table eke id ekata link
    // wenawa
    private EnrollmentStatus enrollmentstatus_id;

    @ManyToOne // meka enrollment entity eka teacher ekakata belong wenawa kiyala
    @JoinColumn(name = "teacher_id", referencedColumnName = "id")
    // teacher_id column eka Teacher table eke id ekata link wenawa
    private Teacher teacher_id;

    @OneToMany(mappedBy = "enrollment_id", cascade = CascadeType.ALL, orphanRemoval = true)
    // CascadeType.ALL kiyanne me Enrollment object eka save karaddi eka athule thiyena
    // okkoma EnrollmentHasBatch list eke data tika automaticaly database ekata save wenna
    // orphanRemoval = true kiyanne list eken mokakhari record ekak remove kaloth
    // eka database eketh delete wenna kiyala.
    // assoiciation eke main side ekath ekka thama link krnne
    private List<EnrollmentHasBatch> enrollmentHasBatchList;
    // mehema krapuwama /enrollment/alldata wala Infinity recursion problem enawa
    // ################################
    /*
     * Could not write JSON: Document nesting depth (1001) exceeds the maximum
     * allowed (1000, from `StreamWriteConstraints.getMaxNestingDepth()`)]
     */
    // ################################
    // Methnadi error eka enne `Enrollment` saha `EnrollmentHasBatch` dekema foreign
    // key relation enrollment_id thiyena nisa JSON convert karaddi data eka nawatha
    // nawatha read wena `infinite recursion` ekak athi wena nisa. Eka nawathinne
    // na, digatama loop wenawa. Enisa object eka JSON bawata convert karanna ba
    // kiyala error eka enne.
    // `EnrollmentHasBatch` eke `enrollment_id` field eka JSON ignore karama
    // recursion eka nawathila error eka fix wenawa.

}
