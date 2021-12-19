import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBBBOvXujcjLMffo43CK2JH83_rAE0A_Tk",
  authDomain: "e-wallet-c4ba1.firebaseapp.com",
  projectId: "e-wallet-c4ba1",
  storageBucket: "e-wallet-c4ba1.appspot.com",
  messagingSenderId: "999016407618",
  appId: "1:999016407618:web:34b123b45b6441ddb183db",
  measurementId: "G-0CSRF9WS7V"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  const auth = getAuth(app);
  const db = getFirestore(app); 

  export { auth, db };
