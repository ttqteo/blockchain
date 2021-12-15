import React, { useContext } from "react";
import { AuthContext } from './AuthProvider';

export const AssetContext = React.createContext();
export default function AssetProvider({ children }) {
  let { user: {uid} } = useContext(AuthContext);
  let userStorage = JSON.parse(localStorage.getItem("users"));
  var assetListtemp = []
  userStorage.map((doc) => {
      if(doc.uid === uid){
        assetListtemp = doc.asset;
      }
  })
  const assetList = {
    list: assetListtemp,
  }
  console.log(assetList,"AssetProvider")
  return (
    <AssetContext.Provider value = { {assetList} }>
      {children}
    </AssetContext.Provider>
  );
}

