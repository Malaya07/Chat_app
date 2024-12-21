import React from "react";

const MessageCard = ({ text, date, sender, creatorpos,direction, showDate }) => {
 // console.log(showDate)
  return (
    <>
      {/* Show date only once per day */}
      {showDate && (
        <div style={{ textAlign: "center", margin: "10px 0", color: "#888", fontSize: "1.1rem" }}>
          {new Date(date).toLocaleDateString()}
        </div>
      )}
      <div
        style={{
          display: "flex",
          justifyContent: direction === "start" ? "flex-start" : "flex-end",
          margin: "5px 0",
        }}
      >
        
        <div
          style={{
            backgroundColor: " rgb(251, 222, 173)",
            padding: "10px",
            borderRadius: "10px",
            maxWidth: "40%",
            textAlign: creatorpos === "right" ? "right" : "left",
            wordWrap: "break-word",
          }}
        >
          <small style={{ color: "#666", fontSize: "0.9rem" }}>
            {sender}
          </small>
          <p style={{ margin: 0, color:"black",textAlign:"center", fontSize:"1.3rem"}}>{text}</p>
          <small style={{ color: "#666", fontSize: "0.6rem" , textAlign:"left"}}>
            {new Date(date).toLocaleTimeString()}
          </small>
        </div>
      </div>
    </>
  );
};

export default MessageCard;
