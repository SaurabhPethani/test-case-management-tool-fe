import React, { createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

// Create the context
const NavigationContext = createContext(null);

// Create a provider component
export const NavigationContextProvider = ({ children }) => {
  const navigate = useNavigate();
  
  return (
    <NavigationContext.Provider value={{ navigate }}>
      {children}
    </NavigationContext.Provider>
  );
};

// Custom hook to use the Navigation context
export const useNavigation = () => {
    const context = useContext(NavigationContext);
    if (!context) {
      throw new Error('useNavigation must be used within a NavigationContextProvider');
    }
    return context;
  };
