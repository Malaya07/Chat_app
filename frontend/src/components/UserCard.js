import React from "react";
import { useNavigate } from "react-router-dom";

const UserCard = ({ roomname }) => {
  const navigate = useNavigate();
  const { name } = roomname; // Extract name from roomname

  const handleRoom = () => {
    navigate(`/Chatroom/${name}`); // Correctly format the URL
  };

  return (
    <div
      className="usercard"
      onClick={handleRoom}
      style={{
        display: "flex",
        alignItems: "center",
        padding: "10px",
        cursor: "pointer",
        borderBottom: "1px solid #ccc",
        backgroundColor: "white",
      }}
    >
      <div
        className="avatar"
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          backgroundColor: "#007bff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          fontWeight: "bold",
          fontSize: "1rem",
          marginRight: "10px",
        }}
      >
        {name[0].toUpperCase()}
      </div>
      <div
        className="username"
        style={{ fontSize: "1rem", fontWeight: "500", color: "black" }}
      >
        <p style={{color:"black"}}>{name}</p>
      </div>
    </div>
  );
};

export default UserCard;
