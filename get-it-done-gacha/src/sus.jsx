import React, { useState } from "react";

const LargeButtonPage = () => {
  const [textColor, setTextColor] = useState("black");
  const [isPressed, setIsPressed] = useState(false);

  const predefinedColors = [
    "red",
    "blue",
    "green",
    "pink",
    "orange",
    "yellow",
    "black",
    "purple",
    "brown",
    "cyan",
    "lime",
    "maroon",
    "gray",
    "tan",
  ];

  const generateRandomColor = () => {
    return predefinedColors[
      Math.floor(Math.random() * predefinedColors.length)
    ];
  };

  const isRed = (color) => color === "red";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f0f0f0",
        paddingTop: "1vh", // Reduced from 2vh
      }}
    >
      <h1
        style={{
          fontFamily: "'Poppins', 'Arial Rounded MT Bold', Arial, sans-serif",
          fontSize: "clamp(3rem, 8vw, 6rem)",
          marginBottom: "0em", // Reduced from 0.5em
          color: "#333",
          textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
          letterSpacing: "3px",
          textAlign: "center",
          userSelect: "none",
        }}
      >
        CLICK ME!
      </h1>

      <div
        style={{
          position: "relative",
          flexGrow: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          marginTop: "-0.5em", // Compensates for remaining space
        }}
      >
        <button
          onMouseDown={() => setIsPressed(true)}
          onMouseUp={() => {
            setTextColor(generateRandomColor());
            setIsPressed(false);
          }}
          style={{
            width: "70vmin",
            height: "70vmin",
            maxWidth: "500px",
            maxHeight: "500px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            border: "4px solid #333",
            borderRadius: "12px",
            backgroundColor: isPressed ? "#c0c0c0" : "#ffffff",
            boxShadow: isPressed
              ? "0 4px 8px rgba(0,0,0,0.2)"
              : "0 12px 24px rgba(0,0,0,0.3)",
            cursor: "pointer",
            boxSizing: "border-box",
            transform: isPressed
              ? "translateY(4px) scale(0.99)"
              : "translateY(0) scale(1)",
            transition: "all 0.15s ease",
          }}
        >
          <span
            style={{
              color: textColor,
              fontSize: "35vmin",
              lineHeight: 1,
              userSelect: "none",
              filter: "drop-shadow(2px 2px 4px rgba(0,0,0,0.2))",
              transform: isPressed ? "scale(0.98)" : "scale(1)",
              transition: "transform 0.15s ease",
            }}
          >
            ඞ
          </span>
        </button>

        {isRed(textColor) && (
          <div
            style={{
              position: "absolute",
              bottom: "-0.5em",
              width: "100%",
              textAlign: "center",
            }}
          >
            <h2
              style={{
                fontFamily:
                  "'Poppins', 'Arial Rounded MT Bold', Arial, sans-serif",
                fontSize: "clamp(2rem, 6vw, 4rem)",
                color: textColor,
                textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                letterSpacing: "3px",
                userSelect: "none",
                margin: 0,
              }}
            >
              SUS
            </h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default LargeButtonPage;
