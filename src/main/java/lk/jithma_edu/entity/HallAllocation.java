package lk.jithma_edu.entity;

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
@Table(name = "hallallocation") // Table eke name eka define karanawa
@Data // Lombok use karanawa - getters/setters/toString() auto generate wenawa
@AllArgsConstructor // All arguments constructor ekak hadanawa
@NoArgsConstructor // Default constructor ekak hadanawa (JPA ta oni ekak)

public class HallAllocation {

    @Id // Primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    // ID auto increment wenawa (MySQL eke AUTO_INCREMENT wage)
    private Integer id;

    private LocalTime starttime;
    private LocalTime endtime;
    private LocalDate date;

    private LocalDateTime addeddatetime;
    private LocalDateTime updateddatetime;
    private LocalDateTime deleteddatetime;

    private Integer addeduser;
    private Integer updateduser;
    private Integer deleteduser;

    @ManyToOne // meka hallallocation entity ekak batch ekakata belong wenawa
    @JoinColumn(name = "batch_id", referencedColumnName = "id")
    // batch_id column eka Batch table eke id ekata link wenawa
    private Batch batch_id;

    @ManyToOne // meka hallallocation entity ekak weekday ekakata belong wenawa
    @JoinColumn(name = "weekday_id", referencedColumnName = "id")
    // weekday_id column eka Weekday table eke id ekata link wenawa
    private Weekday weekday_id;

    @ManyToOne // meka hallallocation entity ekak allocation type ekakata belong wenawa
    @JoinColumn(name = "allocationtype_id", referencedColumnName = "id")
    // allocationtype_id column eka AllocationType table eke id ekata link wenawa
    private AllocationType allocationtype_id;

    @ManyToOne // meka hallallocation entity ekak allocation status ekakata belong wenawa
    @JoinColumn(name = "allocationstatus_id", referencedColumnName = "id")
    // allocationstatus_id column eka AllocationStatus table eke id ekata link
    // wenawa
    private AllocationStatus allocationstatus_id;

    @ManyToOne // meka hallallocation entity ekak hall ekakata belong wenawa
    @JoinColumn(name = "hall_id", referencedColumnName = "id")
    // hall_id column eka Hall table eke id ekata link wenawa
    private Hall hall_id;

}