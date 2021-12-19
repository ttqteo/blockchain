package com.firebase;

import java.util.concurrent.ExecutionException;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CRUDController {
  public CRUDService crudService;

  public CRUDController(CRUDService crudService) {
    this.crudService = crudService;
  }

  @PostMapping("/create")
  public String createCRUD(@RequestBody CRUD crud) throws InterruptedException, ExecutionException {
    return crudService.createCRUD(crud);
  }

  @GetMapping("/get")
  public CRUD getCRUD(@RequestParam String uid) throws InterruptedException, ExecutionException {
    return crudService.getCRUD(uid);
  }

  @PutMapping("/update")
  public String updateCRUD(@RequestBody CRUD crud) throws InterruptedException, ExecutionException {
    return crudService.updateCRUD(crud);
  }

  @PutMapping("/delete")
  public String deleteCRUD(@RequestParam String uid) throws InterruptedException, ExecutionException {
    return crudService.deleteCRUD(uid);
  }

  @GetMapping("/test")
  public ResponseEntity<String> testGetEndpoint() {
    return ResponseEntity.ok("Connect Server Successful!");
  }
}
