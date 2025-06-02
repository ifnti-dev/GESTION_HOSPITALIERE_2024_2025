package com.gestion_hospitaliere.UeEntreprise.controller.pharmacy;

import com.gestion_hospitaliere.UeEntreprise.model.Pharmacy.StockProduit;
import com.gestion_hospitaliere.UeEntreprise.service.pharmacy.StockProduitService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/stocks")
public class StockProduitController {

    private final StockProduitService stockService;

    public StockProduitController(StockProduitService stockService) {
        this.stockService = stockService;
    }

    @GetMapping
    public List<StockProduit> getAllStocks() {
        return stockService.getAllStocks();
    }

    @GetMapping("/{id}")
    public ResponseEntity<StockProduit> getStockById(@PathVariable Long id) {
        return ResponseEntity.ok(stockService.getStockById(id));
    }

    @PostMapping
    public StockProduit createStock(@RequestBody StockProduit stock) {
        return stockService.createStock(stock);
    }

    @PutMapping("/{id}")
    public ResponseEntity<StockProduit> updateStock(@PathVariable Long id, @RequestBody StockProduit stockDetails) {
        return ResponseEntity.ok(stockService.updateStock(id, stockDetails));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStock(@PathVariable Long id) {
        stockService.deleteStock(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/medicament/{medicamentId}")
    public List<StockProduit> getStocksByMedicament(@PathVariable Long medicamentId) {
        return stockService.getStocksByMedicament(medicamentId);
    }

    @GetMapping("/expires")
    public List<StockProduit> getExpiredStocks(@RequestParam String date) {
        return stockService.getExpiredStocks(LocalDate.parse(date));
    }

    @GetMapping("/lot/{lot}")
    public List<StockProduit> getStocksByLot(@PathVariable String lot) {
        return stockService.getStocksByLot(lot);
    }
}

