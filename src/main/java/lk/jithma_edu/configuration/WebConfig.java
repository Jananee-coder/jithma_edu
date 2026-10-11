package lk.jithma_edu.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.ExceptionHandlingConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class WebConfig {

    // Security filter chain configure karanawa
    @Bean 
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        // Authorize requests (kon routes access karanna puluwan kiyala set karanawa)
        http.authorizeHttpRequests((auth) -> {
            auth.requestMatchers("/login").permitAll() // login page eka ayeth access karanna puluwan
                .requestMatchers("/createadmin").permitAll() // admin create page access free
                .requestMatchers("/bootstrap-5.2.3/**","/fontawesome-6.7.2/**","/js/**","/images/**","/modaljs/**","/styles/**","/sweetalert2/**").permitAll() // static resources free access
                .requestMatchers("/dashboard").hasAnyAuthority("Admin","Manager","Coordinator","Receptionist","Card-Checker") // dashboard view karanna puluwan roles//"Teacher"
                .requestMatchers("/userprivilegebymodule").hasAnyAuthority("Admin","Manager","Coordinator","Receptionist","Card-Checker") 
                .requestMatchers("/employee/**").hasAnyAuthority("Admin","Manager","Coordinator") // employee routes access karanna roles
                .requestMatchers("/user/**").hasAnyAuthority("Admin","Manager","Coordinator","Receptionist") // user routes access karanna roles
                .requestMatchers("/privilege/**").hasAnyAuthority("Admin","Manager","Coordinator") // privilege routes access karanna roles
                .requestMatchers("/guardian/**").hasAnyAuthority("Admin","Manager","Coordinator","Receptionist") // privilege routes access karanna roles
                .requestMatchers("/student/**").hasAnyAuthority("Admin","Manager","Coordinator","Receptionist","Card-Checker") // privilege routes access karanna roles
                .requestMatchers("/classdetail/**").hasAnyAuthority("Admin","Manager","Coordinator","Receptionist")   // class details related routes access karana roles
                .requestMatchers("/hall/**").hasAnyAuthority("Admin","Manager","Coordinator","Receptionist")   // hall related routes access karana roles 

                .requestMatchers("/hallallocation/**").hasAnyAuthority("Admin","Manager","Coordinator") // hall allocation management routes access roles
                .requestMatchers("/batch/byteacher/**").hasAnyAuthority("Admin","Manager","Coordinator","Receptionist","Card-Checker")
                .requestMatchers("/batch/bygradeandteacher/**").hasAnyAuthority("Admin","Manager","Coordinator","Receptionist","Card-Checker")

                .requestMatchers("/batch/registeredbatches").hasAnyAuthority("Admin","Manager","Coordinator","Receptionist","Card-Checker")

                .requestMatchers("/batch/**").hasAnyAuthority("Admin","Manager","Coordinator","Receptionist") // batch management routes access roles
                .requestMatchers("/studentregistration/**").hasAnyAuthority("Admin","Manager","Coordinator","Receptionist") // student registration routes access roles
                .requestMatchers("/enrollment/**").hasAnyAuthority("Admin","Manager","Coordinator") // enrollment management routes access roles
                .requestMatchers("/attendance/**").hasAnyAuthority("Admin","Manager","Coordinator","Receptionist","Card-Checker") // attendance management routes access roles
                .requestMatchers("/studentpayment/**").hasAnyAuthority("Admin","Manager","Coordinator","Receptionist") // student payment routes access roles
                .requestMatchers("/teacher/**").hasAnyAuthority("Admin","Manager","Coordinator","Receptionist","Card-Checker") // teacher management routes access roles
                .requestMatchers("/teacherpayment/**").hasAnyAuthority("Admin","Manager","Coordinator") // teacher payment routes access roles
                .requestMatchers("/report/**").hasAnyAuthority("Admin","Manager","Coordinator","Receptionist","Card-Checker") // report routes access roles


                .anyRequest().authenticated();   // mehema mention karala nathi ithuru okkoma routes walata login wela inna one
        })

        // Login form configuration
        .formLogin((login) -> {
            login.loginPage("/login") // custom login page
                 .defaultSuccessUrl("/dashboard", true) 
                 // login success wuznama redirect wenna
                 .failureUrl("/login?error") 
                 // login fail una login page ekata redirect
                 .usernameParameter("username") 
                 // login form username field
                 .passwordParameter("password"); 
                 // login form password field
        })

        // Logout configuration
        .logout((logout) -> {
            logout.logoutUrl("/logout") // logout url
                  .clearAuthentication(true) 
                  // logout kalama session clean wenawa
                  .logoutSuccessUrl("/login"); 
                  // logout una passe login page ekata redirect
        }).exceptionHandling((ExceptionHandlingConfigurer<HttpSecurity>error)->{
            error.accessDeniedPage("/errorpage");
        })
        //Cross-Site Request Forgery
        // CSRF disable karanawa (if API/post requests CSRF disable wenna one)
        //filter chain liwwama apita js ekakin data access krnna bari wenwa 
        //services okkoma js eken wenne only url eken krnne ui ui athara cloud wenna withrayi
        //js file apita acces krnna one nisa thama csrf disable krnna one 
        .csrf((csrf) -> {
            csrf.disable();
        });

        return http.build(); // filter chain eka build karala return karanawa
    }

    // Password encoder bean (BCrypt)
    // Spring ekata bean ekak create karanawa password encrypt karanna
    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
