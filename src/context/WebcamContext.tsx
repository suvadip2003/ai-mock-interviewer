// src/context/WebcamContext.tsx

import React, { createContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';

// Define the shape of the context data
interface WebcamContextType {
  isWebCamEnabled: boolean;
  setIsWebCamEnabled: Dispatch<SetStateAction<boolean>>;
}

// Create the context with a default value
export const WebcamContext = createContext<WebcamContextType>({
  isWebCamEnabled: false,
  setIsWebCamEnabled: () => {},
});

// Create a provider component
export const WebcamProvider = ({ children }: { children: ReactNode }) => {
  const [isWebCamEnabled, setIsWebCamEnabled] = useState(false);

  return (
    <WebcamContext.Provider value={{ isWebCamEnabled, setIsWebCamEnabled }}>
      {children}
    </WebcamContext.Provider>
  );
};