package com.coingeckoassessment.coingeckoassessment.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import com.coingeckoassessment.coingeckoassessment.model.Portfolio;
import com.coingeckoassessment.coingeckoassessment.repository.PortfolioRepository;

import jakarta.validation.Valid;

import java.util.List;
@RestController
@RequestMapping("/portfolio")
public class PortfolioController {
    
    @Autowired
    private PortfolioRepository portfolioRepository;

    @PostMapping
    public ResponseEntity<?> savePortfolioEntry(@Valid @RequestBody Portfolio portfolio, BindingResult result) {
        if (result.hasErrors()) {
            return ResponseEntity.badRequest().body("Validation failed: " + result.getAllErrors());
        }
        Portfolio savedPortfolio = portfolioRepository.save(portfolio);
        return ResponseEntity.ok(savedPortfolio);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePortfolioEntry(@PathVariable Long id, @Valid @RequestBody Portfolio portfolio, BindingResult result) {
        if (result.hasErrors()) {
            return ResponseEntity.badRequest().body("Validation failed: " + result.getAllErrors());
        }
        portfolio.setId(id);
        Portfolio updatedPortfolio = portfolioRepository.save(portfolio);
        return ResponseEntity.ok(updatedPortfolio);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePortfolioEntry(@PathVariable Long id) {
        portfolioRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public List<Portfolio> getAllPortfolioEntries() {
        return portfolioRepository.findAll();
    }

    @GetMapping("/totalValue")
    public double getTotalPortfolioValue() {
        List<Portfolio> portfolioList = portfolioRepository.findAll();
        double totalValue = 0.0;
        for (Portfolio portfolio : portfolioList) {
            totalValue += portfolio.getAmount() * portfolio.getPurchasePrice();
        }
        return totalValue;
    }
}