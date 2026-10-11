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
@Table(name = "user_has_role") // Table eke name eka define karanawa
@Data // Lombok use karanawa - getters/setters/toString() auto generate wenawa
@AllArgsConstructor // All arguments constructor ekak hadanawa
@NoArgsConstructor // Default constructor ekak hadanawa (JPA ta oni ekak)
public class UserHasRole {
    
@Id // part of the composite primary key
@ManyToOne // Many user-role records can refer to one user
@JoinColumn(name = "user_id", referencedColumnName = "id") // foreign key to User table
private User user_id;

@Id // part of the composite primary key
@ManyToOne // Many user-role records can refer to one role
@JoinColumn(name = "role_id", referencedColumnName = "id") // foreign key to Role table
private Role role_id;

}
