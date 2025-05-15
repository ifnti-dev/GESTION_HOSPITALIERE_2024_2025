package com.gestion_hospitaliere.UeEntreprise.controller.hospitalisation;
import com.gestion_hospitaliere.UeEntreprise.model.HospitalisationService.ServiceHopital;
import com.gestion_hospitaliere.UeEntreprise.service.Hospitalisation.ServiceService;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/services")
public class ServiceHopitalController {
     @Autowired
    private final ServiceService serviceService;

   
    public ServiceHopitalController(ServiceService serviceService) {
        this.serviceService = serviceService;
    }

    // GET all services
    @GetMapping
    public ResponseEntity<List<ServiceHopital>> getAllServices() {
        List<ServiceHopital> services = serviceService.findAll();
        return new ResponseEntity<>(services, HttpStatus.OK);
    }

    // GET service by ID
    @GetMapping("/{id}")
    public ResponseEntity<ServiceHopital> getServiceById(@PathVariable Long id) {
        Optional<ServiceHopital> service = serviceService.findById(id);
        return service.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // POST create new service
    @PostMapping
    public ResponseEntity<ServiceHopital> createService(@RequestBody ServiceHopital serviceHopital) {
        ServiceHopital newService = serviceService.save(serviceHopital);
        return new ResponseEntity<>(newService, HttpStatus.CREATED);
    }

    // PUT update existing service
    @PutMapping("/{id}")
    public ResponseEntity<ServiceHopital> updateService(@PathVariable Long id, @RequestBody ServiceHopital serviceHopital) {
        return serviceService.findById(id)
                .map(existingService -> {
                    serviceHopital.setId(id); // Assurez-vous que l'ID est bien celui du path variable
                    ServiceHopital updatedService = serviceService.save(serviceHopital);
                    return new ResponseEntity<>(updatedService, HttpStatus.OK);
                })
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // DELETE service
  @DeleteMapping("/{id}")
public ResponseEntity<Object> deleteService(@PathVariable Long id) {
    return serviceService.findById(id)
            .map(service -> {
                serviceService.deleteById(id);
                return new ResponseEntity<Object>(HttpStatus.NO_CONTENT);
            })
            .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
}
}