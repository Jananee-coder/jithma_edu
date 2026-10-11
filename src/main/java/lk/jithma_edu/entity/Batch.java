package lk.jithma_edu.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
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
@Table(name = "batch") // Table eke name eka define karanawa
@Data // Lombok use karanawa - getters/setters/toString() auto generate wenawa
@AllArgsConstructor // All arguments constructor ekak hadanawa
@NoArgsConstructor // Default constructor ekak hadanawa (JPA ta oni ekak)
public class Batch {

    @Id // Primary key eka
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    // ID auto increment wenawa (MySQL eke AUTO_INCREMENT wage)
    private Integer id;

    private String batchname;
    private Integer currentyear;// YEAR (2026)
    private BigDecimal monthfee; // DECIMAL(10,2)
    private BigDecimal servicecharge; // DECIMAL(10,2)
    private Integer freecardp;
    private Integer duration; // INT
    private LocalDate startdate; // DATE
    private LocalTime starttime;// DATETIME
    private LocalTime endtime;// DATETIME

    private LocalDateTime addeddatetime;
    private LocalDateTime updateddatetime;
    private LocalDateTime deleteddatetime;

    private Integer addeduser;
    private Integer updateduser;
    private Integer deleteduser;

    @ManyToOne // meka batch entity ekak batch status ekakata belong wenawa kiyala
    @JoinColumn(name = "batchstatus_id", referencedColumnName = "id")
    // batchstatus_id column eka BatchStatus table eke id ekata link wenawa
    private BatchStatus batchstatus_id;

    @ManyToOne // meka batch entity ekak weekday ekakata belong wenawa kiyala
    @JoinColumn(name = "weekday_id", referencedColumnName = "id")
    // weekday_id column eka Weekday table eke id ekata link wenawa
    private Weekday weekday_id;

    @ManyToOne // meka batch entity ekak classdetail ekakata belong wenawa kiyala
    @JoinColumn(name = "classdetail_id", referencedColumnName = "id")
    // classdetail_id column eka ClassDetail table eke id ekata link wenawa
    private ClassDetail classdetail_id;

    @ManyToOne // meka batch entity ekak classtype ekakata belong wenawa kiyala
    @JoinColumn(name = "classtype_id", referencedColumnName = "id")
    // classtype_id column eka ClassType table eke id ekata link wenawa
    private ClassType classtype_id;
}
