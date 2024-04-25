// ChatContext.jscreateContext
import React, { createContext, useState, useEffect, useCallback } from "react";
import { baseUrl, getRequest, postRequest } from "../utils/services";
import axios from "axios";
import io from "socket.io-client";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children, user }) => {
  const userId = localStorage.getItem("USER_ID");
  const [userChats, setUserChats] = useState(null);
  const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
  const [userChatsError, setUserChatsError] = useState(null);
  const [potentialChats, setPotentialChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState(null);
  const [sendTextMessageError, setSendTextMessageError] = useState(null);
  const [newMessage, setNewMessage] = useState(null);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null); // Ajoutez socket ici
  const [chats, setChats] = useState([]);
  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true);
      try {
        const response = await axios.get("http://localhost:3000/internaute");
        setUsers(response.data.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const getMessages = async () => {
      if (!currentChat) {
        return;
      }

      setIsMessagesLoading(true);
      setMessagesError(null);

      try {
        const response = await getRequest(`${baseUrl}/messages/${currentChat?._id}`);

        if (response.error) {
          throw new Error(response.message);
        }

        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
        setMessagesError(error.message);
      } finally {
        setIsMessagesLoading(false);
      }
    };

    getMessages();
  }, [currentChat]);
  
  useEffect(() => {
    const newSocket = io("http://localhost:3001");
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    if (socket === null) return;
    
    socket.emit("addNewUser", userId);
    // console.log('socket userId: ',userId)
    socket.on("getOnlineUsers",(res)=>{
      setOnlineUsers(res);
    });

    // Cleanup
    return () => {
      socket.off("getOnlineUsers");
    };
  }, [socket, userId]);

  // Send Message
  useEffect(() => {
    if (socket === null || !newMessage ) {
      console.log("Socket is null or newMessage is null, cannot send message.");
      return;
    }
    console.log("Sending Message:", newMessage);
    const receiverId = currentChat?.members.find((member) => member !== user.data.data._id);
    console.log("Receiver ID:", receiverId);
    socket.emit("sendMessage", { ...newMessage, receiverId });
  }, [socket, newMessage, currentChat, user]);
  
  

  // receive message
  useEffect(() => {
    if (socket === null) {
      console.log("Socket is null, cannot listen for messages.");
      return;
    }
  
    console.log("Setting up listener for getMessage event...");
  
    socket.on("getMessage", (res) => {
      console.log("Received message:", res);
      
      if (currentChat?._id !== res.chatId) {
        console.log("Message is for a different chat, skipping.");
        return;
      }
  
      console.log("Updating messages state...");
      setMessages((prev) => [...prev, res]);
    });
  
    return () => {
      console.log("Cleaning up getMessage listener...");
      socket.off("getMessage");
    };
  }, [socket, currentChat]);
  


  const sendTextMessage = useCallback(async (textMessage, sender, currentChatId, setTextMessage, messages) => {
    if (!textMessage) {
      console.log("You must type something...");
      return;
    }

    try {
      const response = await postRequest(`${baseUrl}/messages`, {
        chatId: currentChatId._id,
        senderId: currentChatId?.members[1],
        text: textMessage,
      });

      if (response.error) {
        throw new Error(response.message);
      }

      setNewMessage(response.data);
      setTextMessage("");
    } catch (error) {
      console.error("Error sending message:", error.message);
      setSendTextMessageError(error.message);
    }
  }, []);

  const updateCurrentChat = useCallback((chat) => {
    setCurrentChat(chat);
  }, []);

  const createChat = async (firstId, secondId) => {
    try {
      const response = await axios.post("http://localhost:3000/api/chats", {
        firstId,
        secondId,
      });

      if (response.status === 200) {
        const newChat = response.data;
        setChats((prevChats) => [...prevChats, newChat]);
        setUserChats((prev) => [...prev, response]);
        return newChat;
      } else {
        throw new Error("Failed to create chat");
      }
      
    } catch (error) {
      console.error("Error creating chat:", error);
      throw error;
    }
  };

  const getUserById = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:3000/internaute/getById/${userId}`);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      return null;
    }
  };

  const contextValue = {
    chats,
    createChat,
    userChats,
    isUserChatsLoading,
    userChatsError,
    potentialChats,
    currentChat,
    createChat,
    updateCurrentChat,
    messages,
    isMessagesLoading,
    messagesError,
    sendTextMessage,
    users,
    loadingUsers,
    getUserById,
    onlineUsers,
    socket, 
  };

  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContextProvider;