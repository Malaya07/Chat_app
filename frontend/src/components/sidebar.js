import React from "react";
import { useQuery, useApolloClient } from "@apollo/client";
import { GET_ALL_ROOMS } from "../graphql/queries";
import UserCard from "./UserCard";
import { jwtDecode } from "jwt-decode";
import { useNavigate} from "react-router-dom";
import Welcome from "./Welcome";

const SideBar = () => {
  const { loading, data, error } = useQuery(GET_ALL_ROOMS);

  const client = useApolloClient()
  const navigate = useNavigate();
  const token = localStorage.getItem("jwt");
  const decode = token ? jwtDecode(token) : null;

 
  if (!decode) {
    return <p className="sidebar-error">Invalid or missing token.</p>;
  }

  if (loading) return <p className="sidebar-loading">Loading chats...</p>;
  if (error) {
    console.error("Error fetching chat rooms:", error.message);
    return <p className="sidebar-error">Failed to load chats: {error.message}</p>;
  }

  const Welcomepage = ()=>{
    navigate("/welcome");
  }
 // console.log(data);

  return (
    <div className="sidebar-container"
    style={{
      background: "#d6e8f7",
      width: "235px",
      borderRadius: "15px",
      boxShadow: "8px 8px 15px #b0c5d9, -8px -8px 15px #ffffff",
      overflow: "auto",
      padding: "10px",
    }}>
      <div className="sidebar-header"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "12px",
      }}>
        <h2 className="sidebar-title" style={{ color: "#333", margin: 0, fontSize: "1.5rem" , cursor:"pointer"}} onClick={Welcomepage}>Chat</h2>
        <button
          className="sidebar-logout"
          style={{
            background: "#ffffff",
            color: "#333",
            border: "none",
            borderRadius: "10px",
            padding: "10px 20px",
            fontWeight: "bold",
            boxShadow: "4px 4px 8px #a7bdd3, -4px -4px 8px #ffffff",
          }}
          onClick={() => {
            localStorage.removeItem("jwt");
            client.clearStore()
            console.log("logged out");
            navigate("/")
          }}
        >
          Logout
        </button>
      </div>
      <hr className="sidebar-divider" style={{
          border: "none", height: "1px", background: "rgb(187, 193, 199)", marginBottom: "15px"
        }} />
      <div className="sidebar-users"  style={{
          maxHeight: "70vh",
          overflowY: "auto",
          width: "75%",
          padding: "10px",
          background: "#e8f3fd",
          borderRadius: "10px",
          boxShadow: "inset 4px 4px 8px #b0c5d9, inset -4px -4px 8px #ffffff",
          margin: "0 auto",
        }}>
        {data.getChatRooms.map((room,index) => (
         <div
         key={index}
         style={{
           background: "#f7faff",
           marginBottom: "10px",
           borderRadius: "10px",
           padding: "10px",
           boxShadow: "4px 4px 8px #b0c5d9, -4px -4px 8px #ffffff",
         }}
       >
         <UserCard roomname={room} />
       </div>
        ))}
      </div>
    </div>
  );
};

export default SideBar;
