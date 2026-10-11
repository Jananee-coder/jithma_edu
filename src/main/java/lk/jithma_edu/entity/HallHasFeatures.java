package lk.jithma_edu.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity // Entity kiyala kiyanne me class eka DB table ekakata map wenawa
@Table(name = "hall_has_features") // Table eke name eka define karanawa
@Data // Lombok use karanawa - getters/setters/toString() auto generate wenawa
@AllArgsConstructor // All arguments constructor ekak hadanawa
@NoArgsConstructor // Default constructor ekak hadanawa (JPA ta oni ekak)
public class HallHasFeatures {
    @Id // part of the composite primary key
    @ManyToOne // Many hall-features records can refer to one user
    @JoinColumn(name = "hall_id", referencedColumnName = "id") // foreign key to User table
    private Hall hall_id;

    @Id // part of the composite primary key
    @ManyToOne // Many hall-features records can refer to one role
    @JoinColumn(name = "features_id", referencedColumnName = "id") // foreign key to Role table
    private Features features_id;

    // Hall ekakata adala features list eka ganna widihata
    // query eka association table eka haraha execute wenne.
    // E nisa me association table ekata wenama entity ekak hadanawa.
    // Mehema karama UI eke (table, dropdown, checkbox wage)
    // features tika easy widihata fetch karala display karanna puluwan.

}
