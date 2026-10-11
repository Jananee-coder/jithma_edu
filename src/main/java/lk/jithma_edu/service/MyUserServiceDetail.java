package lk.jithma_edu.service;

import java.util.HashSet;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lk.jithma_edu.dao.UserDao;
import lk.jithma_edu.entity.Role;
import lk.jithma_edu.entity.User;

@Service
// me class eka Spring Service Bean ekak widihata register karanawa
// UserDetailsService implement karala login wela user ge details load karanna use karanawa
public class MyUserServiceDetail implements UserDetailsService {
    // implement kra UserDetailsService ta mokada eke thama username genna ganna
    // thiyana methd eka thiyenne

    @Autowired
    // UserDao -> database eken user object eka ganna interface eka
    private UserDao userDao;

    // override kra..illana type eka thama userDetails object ekak
    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // log wena userta adalawa userge name eka aragena user object detail ekak
        // return krnawa

        // methanin pass wena user object eka aragena database ekata connect wela oya
        // username ekata adala user object eka genath denawa
        // aran deela eyage thiyena user object eka use krla
        // username,password,status,roles anuwa user detail object ekak return karanwa

        // Login wenna try karana userge username eka use karala database eken
        // e username ekata adala User entity object eka gannawa
        User loggedUser = userDao.getByUsername(username);

        // User ge roles set eka Spring Security ta acceptable authority format ekata
        // convert karanna empty HashSet ekak hadanawa

        // User ge roles list eka Spring Security ta acceptable authority format ekata
        // convert karanawa.
        // Spring Security direct role objects use karanne na. Eya expect karanne
        // GrantedAuthority objects.
        // Ekai apata DB roles → SimpleGrantedAuthority walata convert karanna wenne.
        Set<GrantedAuthority> authorities = new HashSet<>();


        // loggedUser.getRoles() -> Database eken ena userge role list eka.
        // Ex: ["ADMIN", "USER"]
        // Hama role ekama loop karala SimpleGrantedAuthority object ekakata wrap
        // karanawa.
        // SimpleGrantedAuthority kiyanne Spring Security recognize karana
        // permission/role format eke object ekak.
        for (Role role : loggedUser.getRoles()) {

            // role.getName() -> database eken ena role name eka (e.g. "ADMIN")
            // New SimpleGrantedAuthority("ADMIN") -> Spring Security ta authority ekak
            // widiyata add karana format eka.
            // Me authorities set eka login check karaddi authorization walata use wenawa
            // (ex: hasRole, hasAuthority)
            authorities.add(new SimpleGrantedAuthority(role.getName()));
        }


        // Me return karana object eka tamai Spring Security login check karana main
        // object eka
        // Parameters:
        // username, password, account active da?, account expire wela nadda?,
        // credentials expire wela nadda?, account lock unada?, authorities
        return new org.springframework.security.core.userdetails.User(loggedUser.getUsername(),
                loggedUser.getPassword(), loggedUser.getUserstatus(), true, true, true, authorities);
    }

}
