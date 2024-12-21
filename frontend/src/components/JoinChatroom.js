import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { JOIN_ROOM } from "../graphql/mutation";
import { useMutation } from "@apollo/client";

const JoinChatroom = () => {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [Error, setError] = useState("");
  const navigate = useNavigate();

  // Destructure the mutation function and the state
  const [joinRoomMutation, { loading, error }] = useMutation(JOIN_ROOM, {
    onCompleted: () => navigate("/welcome"),
    onError: (error) => setError(error.message),
  });

  const joinRoom = () => {
    const trimusername = username.trim();
    const trimroom = room.trim();
   
    if (trimusername && trimroom) {
        setError("");
        joinRoomMutation({
          variables: {
            chatroomname: trimroom,
            participantname: trimusername,
          },
      });
    } else {
      setError("Both fields are required.");
    }
  };

  return (
    <div className="join-container">
      <div className="card">
        <h1>Join a Chatroom</h1>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="text"
          placeholder="Room Name"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />
        <button onClick={joinRoom} disabled={loading}>
          {loading ? "Joining..." : "Join"}
        </button>
        {Error && <p style={{ color: "red" }}>{Error}</p>}
        {error && <p style={{ color: "red" }}>Error: {error.message}</p>}
      </div>
    </div>
  );
};

export default JoinChatroom;
