import React, { useContext, useEffect, useRef, useState } from "react";
import { ChatContext } from "../../context/ChatContext";
import { Stack } from "react-bootstrap";
import moment from "moment";
import InputEmoji from "react-input-emoji";
import axios from "axios";
import "../chat/ChatBox.css";
import { BiPaperclip } from "react-icons/bi";

const ChatBox = () => {
  const { currentChat, user, getUserById, isMessagesLoading, sendTextMessage, onlineUsers } = useContext(ChatContext);
  const loggedInUserData = JSON.parse(localStorage.getItem("USER"));

  const [messages, setMessages] = useState([]);
  const [textMessage, setTextMessage] = useState("");
  const [receiver, setReceiver] = useState(null);
  const scroll = useRef();

  // useEffect(() => {
  //   scroll.current?.scrollIntoView({ behavior: "smooth" });
  // }, [messages]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!currentChat) {
        return;
      }

      try {
        const response = await axios.get(`http://localhost:3000/api/messages/${currentChat._id}`);
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    

    fetchMessages();
  }, [currentChat,messages]);
  

  useEffect(() => {
    const fetchReceiver = async () => {
      // console.log("Current Chat:", currentChat);
      // console.log("User:", loggedInUserData);
  
      if (!currentChat || !loggedInUserData || !currentChat.members) {
        // console.log("Chat, User, or Members is undefined");
        return;
      }
  
      const receiverId = currentChat.members.find((member) => member !== loggedInUserData.data.data._id);
      // console.log("Receiver ID:", receiverId);
  
      if (!receiverId) {
        // console.log("Receiver ID is undefined");
        return;
      }
  
      try {
        const user2 = await getUserById(receiverId);
        // console.log("User2:", user2);
        setReceiver(user2);
      } catch (error) {
        console.error("Error fetching recipient:", error);
      }
    };
  
    fetchReceiver();
  }, [currentChat, user, getUserById]);
  
  
  const handleSendMessage = async () => {
    if (!textMessage || textMessage.trim() === "") {
      console.log("Empty message. Please type something...");
      return;
    }

    const newMessage = {
      chatId: currentChat._id,
      senderId: loggedInUserData.data.data._id,
      text: textMessage,
    };

    try {
      await axios.post("http://localhost:3000/api/messages", newMessage);
      setMessages([...messages, newMessage]);
      setTextMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target.result;
      const newMessage = {
        chatId: currentChat._id,
        senderId: loggedInUserData.data.data._id,
        text: imageData,
        isImage: true,
      };

      try {
        axios.post("http://localhost:3000/api/messages", newMessage);
        setMessages([...messages, newMessage]);
        setTextMessage("");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    };

    reader.readAsDataURL(file);
  };
  if (!currentChat) {
    return (
      <p
        style={{
          textAlign: "center",
          width: "100%",
          padding: "20px",
          fontSize: "1.5rem",
          color: "#555",
          fontStyle: "italic",
          border: "2px dashed #aaa",
          borderRadius: "10px",
          backgroundColor: "#f7f7f7",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          animation: "swing 2s ease-in-out infinite",
        }}
      >
        No conversation selected yet...
      </p>
    );
  }

  return (
    <Stack gap={4} className="chat-box">
      <div className="chat-header">
        {messages && messages.length > 0 && (
          <strong>{receiver ? `${receiver.nom} ${receiver.prenom}` : ""}</strong>
        )}
      </div>
      <Stack gap={3} className="messages">
        {messages && messages.length > 0 ? (
          messages.map((message, index) => (
            <Stack
              key={index}
              className={`message ${
                message.senderId === loggedInUserData.data.data._id
                  ? "self align-self-end"
                  : "align-self-start"
              } flex-grow-0`}
              
            >
              {message.isImage ? (
                <img src={message.text} alt="Sent Image" />
              ) : (
                // <span className={message.senderId === loggedInUserData.data.data._id ? "sent-message" : "received-message"} ref={scroll} >
                <span className={message.senderId === loggedInUserData.data.data._id ? "sent-message" : "received-message"} >
                {message.text}
                </span>
              )}
              <span className="message-time">{moment(message.createdAt).calendar()}</span>
            </Stack>
          ))
        ) : (
          <p>No messages</p>
        )}
      </Stack>
      <Stack direction="horizontal" gap={3} className="chat-input flex-grow-0">
        <InputEmoji
          value={textMessage}
          onChange={setTextMessage}
          fontFamily="nunito"
          borderColor="rgba(72,112,223, 0.2)"
        />
        <label htmlFor="file-upload" className="send-btn">
          <BiPaperclip />
        </label>
        <input
          id="file-upload"
          type="file"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <button className="send-btn" onClick={handleSendMessage}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-send"
            viewBox="0 0 16 16"
          >
            <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z" />
          </svg>
        </button>
      </Stack>
    </Stack>
  );
};

export default ChatBox;