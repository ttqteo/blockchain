import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAPg0GM2Iw9FEZhCFdAkUZ5pIEvJ9atQJg",
  authDomain: "fir-js-java.firebaseapp.com",
  projectId: "fir-js-java",
  storageBucket: "fir-js-java.appspot.com",
  messagingSenderId: "159218018403",
  appId: "1:159218018403:web:237c7ba0a64b96e72a3056",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };
