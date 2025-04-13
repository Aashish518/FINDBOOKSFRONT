import React from "react";
import "../components-css/Alert.css";
import { useAlert } from "../Context/AlertContext";

export const Alert = () => {
  const { alert, setAlert } = useAlert();

  if (!alert.visible) return null;

  return (
    <div className="alert-container">
      <div className={`alert-box ${alert.type}`}>
        <p>{alert.message}</p>
        <button className="close-btn" onClick={() => setAlert({ ...alert, visible: false })}>
          &times;
        </button>
      </div>
    </div>
  );
};
