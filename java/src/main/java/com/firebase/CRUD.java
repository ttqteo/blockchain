package com.firebase;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class CRUD {
  private String uid;
  private String displayName;
  private String email;
  public String getUid() {
    return uid;
  }
  public void setUid(String uid) {
    this.uid = uid;
  }
  public String getDisplayName() {
    return displayName;
  }
  public void setDisplayName(String displayName) {
    this.displayName = displayName;
  }
  public String getEmail() {
    return email;
  }
  public void setEmail(String email) {
    this.email = email;
  }
  
}
