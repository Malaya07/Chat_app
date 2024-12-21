import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Chatroom from "./components/Chatroom";
import Welcome from "./components/Welcome"
import JoinRoom from "./components/JoinChatroom"
// import SideBar from "./components/sidebar";
// import HomeScreen from './pages/HomeScreen';
import Createroom from "./components/CreateRoom";
import './App.css';

const App = () => {
  return (
   
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/Chatroom/:name" element={<Chatroom />} />
        <Route path="joinroom" element={<JoinRoom />} />
        <Route path="/createroom" element={<Createroom /> } />
      </Routes>
  
  );
};

export default App;
