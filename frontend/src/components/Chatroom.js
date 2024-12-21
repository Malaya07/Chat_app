import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import SideBar from "./sidebar";
import { useMutation, useQuery, useSubscription } from "@apollo/client";
import { SEND_MSG } from "../graphql/mutation";
import { GET_USER, GET_ROOM_MSG } from "../graphql/queries";
import { NEW_MESSAGE_SUBSCRIPTION } from "../graphql/subscriptions";
import MessageCard from "./MessageCard";
//import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";



const ChatRoom = () => {
  const { name } = useParams(); 
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const token = localStorage.getItem("jwt");
  const decoded = jwtDecode(token);
  const senderId = decoded?.userId;

  const bottomRef = useRef(null);

  // Fetch sender information
  const { data: senderData } = useQuery(GET_USER, {
    variables: { userId: senderId },
  });
  const senderName = senderData?.user?.username;

  // Fetch existing messages
  const { data: getMessage, loading: msgLoad, error: errMsg } = useQuery(GET_ROOM_MSG, {
    variables: { chatroomname: name },
    fetchPolicy: "cache-and-network",
  });
  

  // Mutation to send a new message
  const [sendMessage] = useMutation(SEND_MSG, {
    onCompleted(data) {
      const newMessage = data.createMessage;
      // Optimistically add the new message before mutation completes
      setMessages((prevMessages) => [...prevMessages]);
    },
  });

  useEffect(() => {
    if (Array.isArray(getMessage?.messageByRoom)) {
      console.log(getMessage.messageByRoom)
      setMessages(getMessage.messageByRoom);
    }
  }, [getMessage]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!text.trim()) return; 
    const tempMessage = {
      message: text,
      sendername: senderName,
      createdAt: Date.now(), // Temporary timestamp
    };
    sendMessage({
      variables: {
        text: text,
        chatroomname: name,
        sendername: senderName,
      },
    });
    setText("");
  };

  //const [messages, setMessages] = React.useState([]);

  const { data: subData, loading, error } = useSubscription(NEW_MESSAGE_SUBSCRIPTION, {
    variables: { chatroomname: name },
    onError: (err) => console.error("Subscription error:", err),
  });

  React.useEffect(() => {
    if (subData?.newMessage) {
      console.log("New message received:", subData.newMessage);
      setMessages((prevMessages) => [...prevMessages, subData.newMessage]);
    }
  }, [subData]);
  
//if (loading) return <p>Loading...</p>;
if (error) return <p>Error: {error.message}</p>;
  return (
    
    <div style={{ display: "flex" }}>
      {/* Sidebar */}
      <div className="sidebar"
      style={{
        background: "#cce0f0",
        width: "260px",
        borderRadius: "15px",
        boxShadow: "8px 8px 15px #b0c4de, -8px -8px 15px #e6f2ff",
       
        padding: "10px",
      }}>
        <SideBar />
      </div>

      {/* Chat Content */}
      <div  style={{
          flex: 1,
          marginLeft: "20px",
          display: "flex",
          flexDirection: "column",
          borderRadius: "15px",
          boxShadow: "8px 8px 15px #b0c4de, -8px -8px 15px #e6f2ff",
          background: "#eaf4fb",
          overflow: "hidden",
        }}>
        {/* Header */}
        <header style={{
            background: "#eaf4fb",
            color: "#333",
            padding: "15px",
            display: "flex",
            alignItems: "center",
            boxShadow: "inset 4px 4px 8px #bcd1e0, inset -4px -4px 8px #ffffff",
          }}>
          <div
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              background: "#cce0f0",
              color: "#333",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginRight: "15px",
              fontWeight: "bold",
              boxShadow: "4px 4px 8px #bcd1e0, -4px -4px 8px #ffffff",
            }}
          >
            {name && name[0].toUpperCase()}
          </div>
          <h2 style={{ margin: 0, fontSize: "1.2rem", color: "#333" }}>{name}</h2>
        </header>

        {/* Chat Messages */}
        <div style={{
    flex: 1,
    padding: "20px",
    overflowY: "auto",
    maxHeight: "calc(97vh - 200px)", // Adjust based on header/input field heights
    boxShadow: "inset 8px 8px 15px #bcd1e0, inset -8px -8px 15px #ffffff",
}}>

          {msgLoad ? (
            <p>Loading Messages...</p>
          ) : errMsg ? (
            <p>Error in fetching Messages</p>
          ) : messages.length > 0 ? (
            messages.map((msg, index) => (
              
              <MessageCard
                key={index}
                text={msg.message}
                date={Number(msg.createdAt)}
                sender={msg.sendername}
                direction={msg.sendername === senderName ? "end" : "start"}
                creatorpos={msg.sendername === senderName ? "right" : "left"}
                // showDate={shouldShowDate(msg.createdAt, index > 0 ? messages[index - 1].createdAt : null)}
              />
            ))
          ) : (
            <p style={{ textAlign: "center" }}>No messages yet</p>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input Field */}
        <div style={{
            display: "flex",
            padding: "15px",
            background: "#cce0f0",
            borderRadius: "15px",
            margin: "10px",
            boxShadow: "8px 8px 15px #b0c4de, -8px -8px 15px #e6f2ff",
          }}>
          <textarea
            placeholder="Enter a message"
            style={{
              flex: 1,
              padding: "10px",
              border: "none",
              borderRadius: "10px",
              resize: "none",
              fontSize: "1rem",
              background: "#eaf4fb",
              boxShadow: "inset 4px 4px 8px #bcd1e0, inset -4px -4px 8px #ffffff",
            }}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button
            style={{
              padding: "10px 20px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
            onClick={handleSendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;