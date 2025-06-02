package com.gestion_hospitaliere.UeEntreprise.service.pharmacy;

import com.gestion_hospitaliere.UeEntreprise.model.Pharmacy.StockProduit;
import com.gestion_hospitaliere.UeEntreprise.repository.pharmacy.StockProduitRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
public class StockProduitService {

    private final StockProduitRepository stockRepository;

    public StockProduitService(StockProduitRepository stockRepository) {
        this.stockRepository = stockRepository;
    }

    public StockProduit createStock(StockProduit stock) {
        return stockRepository.save(stock);
    }

    public StockProduit updateStock(Long id, StockProduit stockDetails) {
        StockProduit stock = stockRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Stock non trouvé"));
        stock.setLot(stockDetails.getLot());
        stock.setQuantite(stockDetails.getQuantite());
        stock.setDatePeremption(stockDetails.getDatePeremption());
        return stockRepository.save(stock);
    }

    public List<StockProduit> getAllStocks() {
        return stockRepository.findAll();
    }

    public StockProduit getStockById(Long id) {
        return stockRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Stock non trouvé"));
    }

    public void deleteStock(Long id) {
        stockRepository.deleteById(id);
    }

    public List<StockProduit> getStocksByMedicament(Long medicamentId) {
        return stockRepository.findByMedicamentId(medicamentId);
    }

    public List<StockProduit> getExpiredStocks(LocalDate date) {
        return stockRepository.findByDatePeremptionBefore(date);
    }

    public List<StockProduit> getStocksByLot(String lot) {
        return stockRepository.findByLot(lot);
    }
}
