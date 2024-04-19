package com.coingeckoassessment.coingeckoassessment.model;


import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;

@Entity
@Getter
@Setter
public class Portfolio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Pattern(regexp = "Bitcoin|Ethereum", message = "Currency must be either Bitcoin or Ethereum")
    @NotNull
    private String currency;

    @Positive
    private double amount;

    @Positive
    private double purchasePrice;

    @NotNull
    private LocalDateTime purchaseTime;
}
