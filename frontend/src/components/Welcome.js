import React from "react";
import { Link } from "react-router-dom";
import SideBar from "./sidebar";

const Welcome = () => {
  const styles = {
    container: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      background: "linear-gradient(to bottom right, #d9e4f5, #f0f4ff)", // Gradient background
    },
    sidebar: {
      flexShrink: 0,
    },
    content: {
      width: "77vw",
      textAlign: "center",
      padding: "1rem",
    },
    heading: {
      fontSize: "2.5rem",
      fontWeight: "bold",
      marginBottom: "2rem",
      color: "#0c3c78",
      textShadow: "2px 2px 4px rgba(0,0,0,0.2)",
    },
    boxContainer: {
      display: "flex",
      justifyContent: "space-around",
      gap: "20px",
      flexWrap: "wrap",
    },
    box: {
      width: "200px",
      height: "150px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "1.2rem",
      fontWeight: "600",
      color: "#ffffff",
      background: "linear-gradient(to bottom, #4a90e2, #357abd)", // Blue gradient
      borderRadius: "20px",
      boxShadow: "7px 7px 15px rgba(0,0,0,0.2), -7px -7px 15px rgba(255,255,255,0.4)",
      cursor: "pointer",
      transition: "all 0.3s ease-in-out",
    },
    boxHover: {
      transform: "scale(1.05)", // Slight scale on hover
      background: "linear-gradient(to bottom, #357abd, #4a90e2)", // Inverted gradient
      boxShadow: "inset 7px 7px 15px rgba(0,0,0,0.2), inset -7px -7px 15px rgba(255,255,255,0.4)",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <SideBar />
      </div>

      <div style={styles.content}>
        <h1 style={styles.heading}>Welcome to the Teams</h1>
        <div style={styles.boxContainer}>
          <Link to="/createroom" style={{ textDecoration: "none" }}>
            <div
              style={styles.box}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = styles.boxHover.transform;
                e.currentTarget.style.background = styles.boxHover.background;
                e.currentTarget.style.boxShadow = styles.boxHover.boxShadow;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.background = styles.box.background;
                e.currentTarget.style.boxShadow = styles.box.boxShadow;
              }}
            >
              Create Room
            </div>
          </Link>

          <Link to="/joinroom" style={{ textDecoration: "none" }}>
            <div
              style={styles.box}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = styles.boxHover.transform;
                e.currentTarget.style.background = styles.boxHover.background;
                e.currentTarget.style.boxShadow = styles.boxHover.boxShadow;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.background = styles.box.background;
                e.currentTarget.style.boxShadow = styles.box.boxShadow;
              }}
            >
              Join Room
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
