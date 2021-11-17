import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBOHe_0LAfSr1akSSQK9TavOqGI9u5f-PM",
    authDomain: "chat-app-67eb8.firebaseapp.com",
    projectId: "chat-app-67eb8",
    storageBucket: "chat-app-67eb8.appspot.com",
    messagingSenderId: "100034404804",
    appId: "1:100034404804:web:0ca02a5e5d4f4cf7c30491",
    measurementId: "G-H78LBWJCE8",
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  const auth = getAuth(app);
  const db = getFirestore(app); 

  export { auth, db };
