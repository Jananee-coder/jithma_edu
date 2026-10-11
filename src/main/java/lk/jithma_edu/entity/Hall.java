package lk.jithma_edu.entity;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity // Entity kiyala kiyanne me class eka DB table ekakata map wenawa
@Table(name = "hall") // Table eke name eka define karanawa
@Data // Lombok use karanawa - getters/setters/toString() auto generate wenawa
@AllArgsConstructor // All arguments constructor ekak hadanawa
@NoArgsConstructor // Default constructor ekak hadanawa (JPA ta oni ekak)
public class Hall {
    @Id // Primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    // ID auto increment wenawa (MySQL eke AUTO_INCREMENT wage)
    private Integer id;

    private String name; // hall name
    private String location;// hall location

    private Integer maxstucount;// maxiumum student count
    private Integer availabledeskcount;// available desk count
    private Integer maxdeskcount; // Maximum desks
    private Integer availableseats; // Available seats
    private Integer maximumseats;// Maximum seats

    private LocalDateTime addeddatetime; // Record added date & time
    private LocalDateTime updateddatetime; // Record updated date & time
    private LocalDateTime deleteddatetime; // Record deleted date & time

    private Integer addeduser;// User who added the record
    private Integer updateduser; // User who updated the record
    private Integer deleteduser; // User who deleted the record

    @ManyToOne // meka hall entity ekak hallstatus ekakata belong wenawa kiyala
    @JoinColumn(name = "hallstatus_id", referencedColumnName = "id")
    // hallstatus_id column eka Hall table eke id ekata link wenawa
    private HallStatus hallstatus_id; // Hall status ID

    @ManyToMany // hall and features has many to many relashionship
    @JoinTable(name = "hall_has_features", joinColumns = @JoinColumn(name = "hall_id"), inverseJoinColumns = @JoinColumn(name = "features_id"))
    private List<Features> featureslist;// methananin enne feture list ekak
}
