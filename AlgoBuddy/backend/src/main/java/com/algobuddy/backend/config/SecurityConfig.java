package com.algobuddy.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.ForwardedHeaderFilter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private static final Logger log = LoggerFactory.getLogger(SecurityConfig.class);

    @Value("${app.allowed-origins:}")
    private String allowedOrigins;

    @Value("${app.environment:dev}")
    private String environment;

    List<String> resolveAllowedOrigins() {
        List<String> list = new ArrayList<>();
        if (allowedOrigins != null && !allowedOrigins.trim().isEmpty()) {
            for (String origin : allowedOrigins.split(",")) {
                origin = origin.trim();
                if (!origin.isEmpty()) {
                    if (origin.equals("*")) {
                        log.warn("CORS configuration contains wildcard '*', which is not allowed. Skipping.");
                        continue;
                    }
                    if (origin.endsWith("/")) {
                        origin = origin.substring(0, origin.length() - 1);
                    }
                    if (origin.startsWith("http://") || origin.startsWith("https://")) {
                        list.add(origin);
                    } else {
                        log.warn("Invalid CORS origin format: '{}'. Origins must start with http:// or https://. Skipping.", origin);
                    }
                }
            }
        }

        if (list.isEmpty()) {
            boolean isProd = environment != null && (environment.toLowerCase().contains("prod") || environment.toLowerCase().contains("production"));
            if (isProd) {
                log.error("No valid CORS allowed origins configured for production environment. All cross-origin requests will be blocked.");
            } else {
                log.info("No valid CORS allowed origins configured for development/test environment. Defaulting to 'http://localhost:3000'.");
                list.add("http://localhost:3000");
            }
        } else {
            log.info("CORS allowed origins configured: {}", list);
        }
        return list;
    }
    @Value("${supabase.url}")
    private String supabaseUrl;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session ->
                    session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(authz -> authz
                    .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
                    .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/v1/arena/leaderboard", "/api/v1/arena/daily-challenge").permitAll()
                    .anyRequest().authenticated())
            .oauth2ResourceServer(oauth2 -> oauth2
                    .jwt(jwt -> jwt.decoder(jwtDecoder())));

        return http.build();
    }

    @Bean
    public ForwardedHeaderFilter forwardedHeaderFilter() {
        return new ForwardedHeaderFilter();
    }

    @Bean
    public JwtDecoder jwtDecoder() {
        String jwkSetUri = supabaseUrl + "/auth/v1/.well-known/jwks.json";
        return NimbusJwtDecoder.withJwkSetUri(jwkSetUri)
                .jwsAlgorithm(org.springframework.security.oauth2.jose.jws.SignatureAlgorithm.ES256)
                .build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        List<String> resolvedOrigins = resolveAllowedOrigins();
        if (resolvedOrigins.isEmpty()) {
            configuration.setAllowedOrigins(Collections.emptyList());
        } else {
            configuration.setAllowedOrigins(resolvedOrigins);
        }
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("authorization", "content-type", "x-auth-token"));
        configuration.setExposedHeaders(Arrays.asList("x-auth-token"));
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
