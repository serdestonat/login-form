"use client";

import React from "react";

const Footer = ({ remainingTime }) => {
  return (
    <footer
      style={{
        display: "flex",
        flexDirection: "column",
        textAlign: "center",
        padding: "10px",
        backgroundColor: "#f1f1f1",
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
      }}
    >
      {remainingTime > 0 ? (
        <p>
          {Math.floor(remainingTime / 60)} dakika {remainingTime % 60} saniye
          sonra tekrar oy kullanabilirsiniz.
        </p>
      ) : (
        <p>Oy kullanabilirsiniz.</p>
      )}
    </footer>
  );
};

export default Footer;
