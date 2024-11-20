import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define the type for the AssetContext
interface AssetContextType {
  assets: Record<string, string>; // Mapping of asset names to local URIs
  addAsset: (name: string, localUri: string) => void;
}

// Default value for the context
const defaultValue: AssetContextType = {
  assets: {},
  addAsset: () => {}, // Default as a no-op function
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

  return (
    <AssetContext.Provider value={{ assets, addAsset }}>
      {children}
    </AssetContext.Provider>
  );
};

// Custom hook to use the AssetContext
export const useAssets = (): AssetContextType => useContext(AssetContext); 