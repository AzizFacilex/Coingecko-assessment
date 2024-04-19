package com.coingeckoassessment.coingeckoassessment;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories("com.coingeckoassessment.coingeckoassessment.*")
public class CoingeckoassessmentApplication {

	public static void main(String[] args) {
		SpringApplication.run(CoingeckoassessmentApplication.class, args);
	}

}
