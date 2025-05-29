// src/Context/SidebarContext.jsx
import React, { createContext, useContext, useState } from 'react';

const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = (value) => {
    if (typeof value === 'boolean') {
      setIsSidebarOpen(value);
    } else {
      setIsSidebarOpen((prev) => !prev);
    }
  };

  return (
    <SidebarContext.Provider value={{ isSidebarOpen, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => useContext(SidebarContext);
