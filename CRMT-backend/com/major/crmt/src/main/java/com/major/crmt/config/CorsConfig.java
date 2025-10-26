package com.major.crmt.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/**")
        // allow any localhost dev port (vite or others) and common loopback
        .allowedOriginPatterns("http://localhost:*", "http://127.0.0.1:*", "http://[::1]:*")
        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
        .allowedHeaders("*")
        .exposedHeaders("Location", "X-User-Id", "Authorization")
        .allowCredentials(true);
    }
}
