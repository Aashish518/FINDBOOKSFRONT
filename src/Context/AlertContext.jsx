import { createContext, useContext, useState } from "react";

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState({ message: "", type: "", visible: false });

  const showAlert = (message, type) => {
    setAlert({ message, type, visible: true });

    setTimeout(() => {
      setAlert({ message: "", type: "", visible: false });
    }, 3000);
  };

  return (
    <AlertContext.Provider value={{ alert, showAlert, setAlert }}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlert = () => useContext(AlertContext);
