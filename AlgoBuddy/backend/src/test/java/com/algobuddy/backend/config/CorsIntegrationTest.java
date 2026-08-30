package com.algobuddy.backend.config;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.HttpHeaders;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Integration-level smoke test that verifies the CORS filter is correctly
 * wired into the live security filter chain.
 *
 * <p>Unit-level logic (wildcard rejection, scheme validation, etc.) is already
 * covered exhaustively by {@link CorsConfigTest}. This test only confirms that
 * pre-flight requests are handled end-to-end by the running servlet context.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)
@AutoConfigureMockMvc
public class CorsIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void testAllowedOriginPreflight() throws Exception {
        mockMvc.perform(options("/api/v1/practice/progress")
                .header(HttpHeaders.ORIGIN, "http://localhost:3000")
                .header(HttpHeaders.ACCESS_CONTROL_REQUEST_METHOD, "GET"))
                .andExpect(status().isOk())
                .andExpect(header().string(
                        HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, "http://localhost:3000"));
    }

    @Test
    public void testBlockedOriginPreflight() throws Exception {
        mockMvc.perform(options("/api/v1/practice/progress")
                .header(HttpHeaders.ORIGIN, "http://evil.com")
                .header(HttpHeaders.ACCESS_CONTROL_REQUEST_METHOD, "GET"))
                .andExpect(status().isForbidden());
    }
}
