package lk.jithma_edu.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data // Lombok use karanawa - getters/setters/toString() auto generate wenawa
@AllArgsConstructor // All args constructor ekak hadanawa
@NoArgsConstructor // Default constructor ekak hadanawa (JPA ta oni ekak)
public class ChangeUser {

    private String username;
    private String oldusername;
    private String newpassword;
    private String useremail;
    private byte[] userphoto;
}
