import React, { useState } from 'react';

export const AccordionContext = React.createContext();

export function AccordionProvider({ children }) {
  const [collapse, setCollapse] = useState(null);

  const toggleCollapse = input => setCollapse(collapse === input ? null : input);

  return (
    <AccordionContext.Provider value={{
      collapse,
      toggleCollapse,
    }}>
      {children}
    </AccordionContext.Provider>
  );
}
