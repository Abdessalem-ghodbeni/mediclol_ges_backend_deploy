import React, { useState, useEffect, useContext } from "react";
import { Container, Stack } from "react-bootstrap";
import UserChat from "../../components/chat/UserChat";
import ChatBox from "../../components/chat/ChatBox";
import PotentialChats from "../../components/chat/PotentialChats"; 
import axios from "axios";
import "./Chat.css";
import { ChatContext } from "../../context/ChatContext";
import logo from "../Chat/logo.png";

const Chat = () => {
  const [userChats, setUserChats] = useState([]);
  const { currentChat, updateCurrentChat, getUserById } = useContext(ChatContext); // Use currentChat
  const [isLoadingChats, setIsLoadingChats] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchChats = async () => {
      setIsLoadingChats(true);
      try {
        const loggedInUserData = JSON.parse(localStorage.getItem("USER"));
        console.log("loggedInUserData:", loggedInUserData);
        setLoggedInUser(loggedInUserData);
        const userId = loggedInUserData?.data?.data?._id;

        if (userId) {
          const response = await axios.get(`http://localhost:3000/api/chats/${userId}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          setUserChats(response.data);
          console.log(response);
        } else {
          console.error("User ID is undefined");
        }
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
      setIsLoadingChats(false);
    };

    fetchChats();
  }, [accessToken]);

  

  return (
    <Container className="text-center">
      {/* <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" width="10px" height="10px"  />
      </div> */}
      {/* <div className="logged-in-as-container">
        <h4 className="logged-in-as-text">
          Logged in as: {loggedInUser?.data?.data.nom} {loggedInUser?.data?.data.prenom}
        </h4>
      </div> */}
      {/* <h2 className="chat-title">ChatBox</h2> */}

      <div className="scroll-container">
        <Stack direction="horizontal" gap={4} className="align-items-start">
          <Stack className="messages-box flex-grow-0 pe-3" gap={3}>
            {isLoadingChats && <p>Loading chats ...</p>}
            <div className="chat-list">
              {Array.isArray(userChats) && userChats.length > 0 ? (
                userChats.map((chat, index) => (
                  <div key={index} onClick={() => updateCurrentChat(chat)}>
                    <UserChat chat={chat} user={loggedInUser} getUserById={getUserById} />
                    
                    <hr />
                  </div>
                ))
              ) : (
                <p>No chats found</p>
              )}
            </div>
          </Stack>
          <ChatBox currentChat={currentChat} />
          <PotentialChats />
        </Stack>
      </div>
    </Container>
  );
};

export default Chat;
