import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define the type for the AssetContext
interface AssetContextType {
  assets: Record<string, string>; // Mapping of asset names to local URIs
  addAsset: (name: string, localUri: string) => void;
  retrieveAsset: (name: string) => string;

}

// Default value for the context
const defaultValue: AssetContextType = {
  assets: {},
  addAsset: () => {}, // Default as a no-op function
  retrieveAsset: () => ''
};

// Create the context with a default value
const AssetContext = createContext<AssetContextType>(defaultValue);

// AssetProvider component to manage assets
export const AssetProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [assets, setAssets] = useState<Record<string, string>>({});

  // Function to add an asset to the state
  const addAsset = (name: string, localUri: string) => {
    setAssets((prev) => ({ ...prev, [name]: localUri }));
  };

  const retrieveAsset = (name: string) => {
    if (assets.hasOwnProperty(name)) {
        return assets[name]
    }
    return 'https://zak-rentals.s3.us-east-1.amazonaws.com/Question.png'
  };

  return (
    <AssetContext.Provider value={{ assets, addAsset, retrieveAsset }}>
      {children}
    </AssetContext.Provider>
  );
};

// Custom hook to use the AssetContext
export const useAssets = (): AssetContextType => useContext(AssetContext); 