import React from "react";

const WarningModal = ({ isOpen, message, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "45%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "white",
        padding: "20px",
        border: "1px solid gray",
        borderRadius: "10px",
        zIndex: 1000,
        display: "flex", // Flexbox kullan
        flexDirection: "column", // Dikey hizala
        alignItems: "center", // Yatayda ortala
      }}
    >
      <p
        style={{
          marginBottom: "10px",
          textAlign: "center",
          paddingBottom: "10px",
          borderBottom: "1px solid #ddd",
        }}
      >
        {message}
      </p>
      <button
        onClick={onClose}
        style={{ alignSelf: "center", padding: "5px", borderRadius: "7px" }}
      >
        Kapat
      </button>
    </div>
  );
};

export default WarningModal;
