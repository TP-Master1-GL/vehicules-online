// src/main/java/com/vehicules/security/CustomUserDetails.java
package com.vehicules.security;

import com.vehicules.core.entities.Client;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

public class CustomUserDetails implements UserDetails {
    
    private final Client client;
    private final String password;
    private final boolean enabled;
    private final String role;
    
    public CustomUserDetails(Client client, String password, boolean enabled, String role) {
        this.client = client;
        this.password = password;
        this.enabled = enabled;
        this.role = role;
    }
    
    public Long getId() {
        return client.getId();
    }
    
    public Client getClient() {
        return client;
    }
    
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role));
    }
    
    @Override
    public String getPassword() {
        return password;
    }
    
    @Override
    public String getUsername() {
        return client.getEmail();
    }
    
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }
    
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }
    
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }
    
    @Override
    public boolean isEnabled() {
        return enabled;
    }
}