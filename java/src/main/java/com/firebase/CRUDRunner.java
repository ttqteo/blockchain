package com.firebase;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class CRUDRunner {
  public static void main(String[] args) throws IOException {
    ClassLoader classLoader = CRUDRunner.class.getClassLoader();

    File file = new File(classLoader.getResource("serviceAccountKey.json").getFile());
    FileInputStream serviceAccount = new FileInputStream(file.getAbsolutePath());
    GoogleCredentials credentials = GoogleCredentials.fromStream(serviceAccount);
    
    FirebaseOptions options = FirebaseOptions.builder().setCredentials(credentials).build();
    FirebaseApp.initializeApp(options);

    SpringApplication.run(CRUDRunner.class, args);
  }
}
