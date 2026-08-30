package com.algobuddy.backend.config;

import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class CorsConfigTest {

    @Test
    public void testAllowedOriginsSingle() {
        SecurityConfig config = new SecurityConfig();
        ReflectionTestUtils.setField(config, "allowedOrigins", "https://algobuddy.me");
        ReflectionTestUtils.setField(config, "environment", "prod");

        List<String> origins = config.resolveAllowedOrigins();
        assertEquals(1, origins.size());
        assertEquals("https://algobuddy.me", origins.get(0));
    }

    @Test
    public void testAllowedOriginsMultiple() {
        SecurityConfig config = new SecurityConfig();
        ReflectionTestUtils.setField(config, "allowedOrigins", "http://localhost:3000, https://algobuddy.me,https://another-frontend.app ");
        ReflectionTestUtils.setField(config, "environment", "prod");

        List<String> origins = config.resolveAllowedOrigins();
        assertEquals(3, origins.size());
        assertTrue(origins.contains("http://localhost:3000"));
        assertTrue(origins.contains("https://algobuddy.me"));
        assertTrue(origins.contains("https://another-frontend.app"));
    }

    @Test
    public void testWildcardIsRejected() {
        SecurityConfig config = new SecurityConfig();
        ReflectionTestUtils.setField(config, "allowedOrigins", "*,https://algobuddy.me");
        ReflectionTestUtils.setField(config, "environment", "prod");

        List<String> origins = config.resolveAllowedOrigins();
        assertEquals(1, origins.size());
        assertEquals("https://algobuddy.me", origins.get(0));
    }

    @Test
    public void testTrailingSlashIsTrimmed() {
        SecurityConfig config = new SecurityConfig();
        ReflectionTestUtils.setField(config, "allowedOrigins", "https://algobuddy.me/");
        ReflectionTestUtils.setField(config, "environment", "prod");

        List<String> origins = config.resolveAllowedOrigins();
        assertEquals(1, origins.size());
        assertEquals("https://algobuddy.me", origins.get(0));
    }

    @Test
    public void testInvalidSchemeIsRejected() {
        SecurityConfig config = new SecurityConfig();
        ReflectionTestUtils.setField(config, "allowedOrigins", "ftp://algobuddy.me,https://algobuddy.me");
        ReflectionTestUtils.setField(config, "environment", "prod");

        List<String> origins = config.resolveAllowedOrigins();
        assertEquals(1, origins.size());
        assertEquals("https://algobuddy.me", origins.get(0));
    }

    @Test
    public void testEmptyOriginsFallbackInDev() {
        SecurityConfig config = new SecurityConfig();
        ReflectionTestUtils.setField(config, "allowedOrigins", "");
        ReflectionTestUtils.setField(config, "environment", "dev");

        List<String> origins = config.resolveAllowedOrigins();
        assertEquals(1, origins.size());
        assertEquals("http://localhost:3000", origins.get(0));
    }

    @Test
    public void testEmptyOriginsBlockAllInProd() {
        SecurityConfig config = new SecurityConfig();
        ReflectionTestUtils.setField(config, "allowedOrigins", "");
        ReflectionTestUtils.setField(config, "environment", "production");

        List<String> origins = config.resolveAllowedOrigins();
        assertTrue(origins.isEmpty());
    }
}
