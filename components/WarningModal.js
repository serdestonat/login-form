// components/WarningModal.js
import React from "react";

const WarningModal = ({ isOpen, message, onClose }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Bulanık arka plan */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)", // Safari desteği için
          zIndex: 999,
        }}
        onClick={onClose} // Arkaplana tıklayarak kapatma
      />

      {/* Modal Kartı */}
      <div
        style={{
          position: "fixed",
          top: "45%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "white",
          padding: "25px",
          borderRadius: "15px",
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
          zIndex: 1000,
          width: "320px",
          textAlign: "center",
        }}
      >
        <p
          style={{
            margin: "0 0 20px 0",
            fontSize: "1.1rem",
            color: "#333",
            lineHeight: "1.5",
          }}
        >
          {message}
        </p>
        <button
          onClick={onClose}
          style={{
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            padding: "10px 25px",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "1rem",
            transition: "background-color 0.2s",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")}
        >
          Tamam
        </button>
      </div>
    </>
  );
};

export default WarningModal;
