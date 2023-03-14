package com.example.demo;

import com.example.demo.enumuration.Status;
import com.example.demo.model.Server;
import com.example.demo.repo.ServerRepo;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;


import java.util.Arrays;

@SpringBootApplication
public class ServerApplication {

	public static void main(String[] args) {
		SpringApplication.run(ServerApplication.class, args);
	}

    @Bean
    CommandLineRunner run(ServerRepo serverRepo) {
        return args -> {
          serverRepo.save(new Server(null, "192.168.43.77", "Ubuntu Linux", "16 GB", "Dell Tower",
                  "http://localhost:8080/server/image/Server 1.png", Status.SERVER_DAWN));
            serverRepo.save(new Server(null, "192.164.1.130", "Windows", "8 GB", "Personal PC",
                    "http://localhost:8080/server/image/Server 4.png", Status.SERVER_UP));
            serverRepo.save(new Server(null, "197.184.171.141", "Mac", "64 GB", "Web Server",
                    "http://localhost:8080/server/image/Server 4.png", Status.SERVER_DAWN));
            serverRepo.save(new Server(null, "192.123.1.161", "Windows", "32 GB", "Mail Server",
                    "http://localhost:8080/server/image/Server 2.png", Status.SERVER_UP));
            serverRepo.save(new Server(null, "192.118.1.118", "Windows", "8 GB", "Web Server",
                    "http://localhost:8080/server/image/Server 3.png", Status.SERVER_DAWN));
            serverRepo.save(new Server(null, "192.129.1.113", "Mac", "16 GB", "Mobile Server",
                    "http://localhost:8080/server/image/Server 1.png", Status.SERVER_DAWN));
        };
    }

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource urlBasedCorsConfigurationSource = new UrlBasedCorsConfigurationSource();
        CorsConfiguration corsConfiguration = new CorsConfiguration();
        corsConfiguration.setAllowCredentials(true);
        corsConfiguration.setAllowedOrigins(Arrays.asList("http://localhost:3000", "http://localhost:4200"));
        corsConfiguration.setAllowedHeaders(Arrays.asList("Origin", "Access-Control-Allow-Origin", "Content-Type", "Accept", "Jwt-token", "Authorization",
                "Origin, Accept", "X-Requested-With", "Access-Control-Request-Method", "Access-Control-Request-Headers"));
        corsConfiguration.setExposedHeaders(Arrays.asList("Origin", "Content-Type", "Accept", "Jwt-Token", "Authorization", "Access-Control-Allow-origin",
                "Access-Control-Allow-Origin", "Access-Control-Allow-Credentials", "Filename"));
        corsConfiguration.setAllowedMethods(Arrays.asList("GET", "POST", "DELETE", "PATCH", "OPTIONS"));
        urlBasedCorsConfigurationSource.registerCorsConfiguration("/**", corsConfiguration);
        return new CorsFilter(urlBasedCorsConfigurationSource);
    }

//    @Bean
//    public WebMvcConfigurer corsConfigurer() {
//        return new WebMvcConfigurer() {
//            @Override
//            public void addCorsMappings(CorsRegistry registry) {
//                registry.addMapping("/**")
//                        .allowedOrigins("*")
//                        .allowedMethods("GET", "POST", "PUT", "DELETE")
//                        .allowedHeaders("*")
//                        .allowCredentials(true);
//            }
//        };
//    }

}