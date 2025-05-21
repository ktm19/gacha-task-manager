import React, { useState } from "react";
import ReactDOM from "react-dom/client";

const LargeButtonPage = () => {
  const [textColor, setTextColor] = useState("black");
  const [isPressed, setIsPressed] = useState(false);
  const predefinedColors = [
    "red", "blue", "green", "pink", "orange", "yellow",
    "black", "purple", "brown", "cyan", "lime", "maroon", "gray", "tan"
  ];

  const generateRandomColor = () => 
    predefinedColors[Math.floor(Math.random() * predefinedColors.length)];

  return (
    <div style={{ padding: "20px" }}>
      <button
        style={{
          fontSize: "24px",
          color: textColor,
          padding: "10px 20px",
          backgroundColor: isPressed ? "lightgray" : "white",
          border: "2px solid black",
          cursor: "pointer"
        }}
        onClick={() => {
          setTextColor(generateRandomColor());
          setIsPressed(!isPressed);
        }}
      >
        Press me
      </button>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root"))
  .render(<LargeButtonPage />);
