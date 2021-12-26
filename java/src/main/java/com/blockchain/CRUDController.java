package com.blockchain;

import java.io.IOException;
import java.security.NoSuchAlgorithmException;
import java.security.NoSuchProviderException;
import java.security.spec.InvalidKeySpecException;
import java.util.concurrent.ExecutionException;

import org.json.JSONException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CRUDController {
  public CRUDService crudService;

  public CRUDController(CRUDService crudService) {
    this.crudService = crudService;
  }

  @GetMapping("/signin")
  public String signinCRUD() throws InterruptedException, ExecutionException, NoSuchAlgorithmException, NoSuchProviderException, InvalidKeySpecException {
    return crudService.signinCRUD();
  }

  @PostMapping("/signup")
  public String signupCRUD(@RequestParam String uid) throws InterruptedException, ExecutionException, NoSuchAlgorithmException, NoSuchProviderException, InvalidKeySpecException {
    return crudService.signupCRUD(uid);
  }

  @PostMapping("/buy")
  public String buyCRUD(@RequestParam String uid, float value) throws InterruptedException, ExecutionException, JSONException, InvalidKeySpecException, NoSuchAlgorithmException, NoSuchProviderException {
    return crudService.buyCRUD(uid, value);
  }

  @PostMapping("/send")
  public String sendCRUD(@RequestParam String uid1, String uid2, String token, float value) throws InterruptedException, ExecutionException, JSONException, NoSuchAlgorithmException, InvalidKeySpecException, NoSuchProviderException, IOException {
    return crudService.sendCRUD(uid1, uid2, token, value);
  }

  @PostMapping("/swap")
  public String swapCRUD(@RequestParam String uid, String token1, float value, String token2) throws InterruptedException, ExecutionException, NumberFormatException, JSONException, IOException {
    return crudService.swapCRUD(uid, token1, value, token2);
  }

  @GetMapping("/check")
  public ResponseEntity<String> checkGetEndpoint() {
    return ResponseEntity.ok("Connect Server Successful!");
  }
}
