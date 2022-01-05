import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthProvider";
import { db } from "../firebase/config";
import { collection } from "firebase/firestore";
import { onSnapshot } from "firebase/firestore";

export const AssetContext = React.createContext();
export default function AssetProvider({ children }) {
  let {
    user: { uid },
  } = useContext(AuthContext);

  let userStorage = JSON.parse(localStorage.getItem("users"));
  var assetListtemp = [];
  var activitytListtemp = [];
  userStorage != null &&
    userStorage.map((doc) => {
      if (doc.uid === uid) {
        assetListtemp = doc.asset;
        activitytListtemp = doc.activity;
      }
    });
  const assetList = {
    list: assetListtemp,
    acti: activitytListtemp,
  };

  const [asset, setAsset] = useState(assetList);
  const [activity, setActivity] = useState(activitytListtemp);

  useEffect(() => {
    const newData = onSnapshot(collection(db, "users"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      // console.log("có thay đổi ở Fireabse")
      var assetListtemp = [];
      var activitytListtemp = [];
      data.map((doc) => {
        if (doc.uid === uid) {
          assetListtemp = doc.asset;
          activitytListtemp = doc.activity;
        }
      });
      const assetList = {
        list: assetListtemp,
        acti: activitytListtemp,
      };

      setAsset(assetList);
    });
    return newData;
  }, []);

  return (
    <AssetContext.Provider value={{ asset, activity }}>
      {children}
    </AssetContext.Provider>
  );
}
