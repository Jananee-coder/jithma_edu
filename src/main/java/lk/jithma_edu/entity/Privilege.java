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
@Table(name = "privilege") // Table eke name eka define karanawa
@Data // Lombok use karanawa - getters/setters/toString() auto generate wenawa
@AllArgsConstructor // All arguments constructor ekak hadanawa
@NoArgsConstructor // Default constructor ekak hadanawa (JPA ta oni ekak)
public class Privilege {

    @Id // Primary key eka
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    // ID auto increment wenawa (MySQL eke AUTO_INCREMENT wage)
    private Integer id;

    private Boolean privi_select; // data select karanna permission eka
    private Boolean privi_insert; // data insert karanna permission eka
    private Boolean privi_update; // data update karanna permission eka
    private Boolean privi_delete; // data delete karanna permission eka

    private LocalDateTime addeddatetime; // record eka add karapu date/time eka
    private LocalDateTime updateddatetime; // record eka update karapu date/time eka

    
    @ManyToOne // meka  Privilege entity ekak module ekakata belong wenawa kiyala
    @JoinColumn(name = "module_id", referencedColumnName = "id")
    // module_id column eka Module table eke id ekata link wenawa
    private Module module_id;

    @ManyToOne // meka  Privilege entity ekak role ekakata belong wenawa kiyala
    @JoinColumn(name = "role_id", referencedColumnName = "id")
    // role_id column eka Role table eke id ekata link wenawa
    private Role role_id;
}
