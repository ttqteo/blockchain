import React, {useEffect, useState, useRef, memo } from 'react';
import { useNavigate } from 'react-router-dom';  
import { auth } from '../firebase/config';
import { Spin } from 'antd';
import { db } from "../firebase/config";
import { collection, getDocs,setDoc,doc } from "firebase/firestore";
// import { addDocument } from "../firebase/services";

export const AuthContext = React.createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState({});
  let navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const balance = useRef(0)
  async function readData(uid){
      let arrs = [];
      const querySnapshot = await getDocs(collection(db, "users"));
      querySnapshot.forEach((doc) => {
        arrs = [...arrs, doc.data()];
      });
      arrs.map(arr => {
          if (arr.uid ===uid){
            return  balance.current =  arr.balance;
          }
      })
  }
  useEffect(() => {
    const unsubscibed = auth.onAuthStateChanged((user) => {
      if (user) {
          const { displayName, email, uid, photoURL } = user;
          readData(uid)
          console.log(balance.current)
        setUser({
          displayName,
          email,
          uid,
          photoURL,
          balance: balance.current,
        });
        setIsLoading(false);
        navigate("/");
        return;
      }
        // reset user info
        setUser({});
        setIsLoading(false);
        navigate("/login");
    });

    // clean function
    return () => {
      unsubscibed();
    };
  }, [navigate]);
  
  return (
    <AuthContext.Provider value={{ user }}>
      {isLoading ? <Spin style={{ position: "fixed", inset: 0 }} /> : children}
    </AuthContext.Provider>
  );
}


export default memo(AuthProvider)