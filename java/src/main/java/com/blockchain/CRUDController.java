package com.blockchain;

import java.io.IOException;
import java.util.concurrent.ExecutionException;

import org.json.JSONException;
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

  @PostMapping("/buy")
  public String buyCRUD(@RequestParam String uid, double value) throws InterruptedException, ExecutionException {
    return crudService.buyCRUD(uid, value);
  }

  @PostMapping("/send")
  public String sendCRUD(@RequestParam String uid1, String uid2, String token, double value) throws InterruptedException, ExecutionException {
    return crudService.sendCRUD(uid1, uid2, token, value);
  }

  @PostMapping("/swap")
  public String swapCRUD(@RequestParam String uid, String token1, double value, String token2) throws InterruptedException, ExecutionException, NumberFormatException, JSONException, IOException {
    return crudService.swapCRUD(uid, token1, value, token2);
  }

  @GetMapping("/check")
  public ResponseEntity<String> checkGetEndpoint() {
    return ResponseEntity.ok("Connect Server Successful!");
  }
}
