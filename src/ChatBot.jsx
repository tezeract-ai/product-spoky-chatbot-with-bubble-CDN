import React, { useState, useEffect, useRef } from "react";
import { Button, Box, Typography } from "@mui/material";
import CryptoJS from "crypto-js";
import { AgentHeader } from "./components/agent-header/AgentHeader";
import { Chats } from "./components/chats/Chats";
import { AgentFooter } from "./components/agent-footer/AgentFooter";
import {
  atomAgentDetails,
  atomAgentStyles,
  atomChatUniqueId,
  atomMessages,
} from "./atom/atom";
import { useAtom } from "jotai";
import { generateUUID } from "./utils";
import AgentIcon from "./assets/images/agent-icon.png";
import { NotFound } from "./components/not-found/NotFound";
// const SECRET_PASS = import.meta.env.VITE_ENCRYPTION_SECRET || "";
const SECRET_PASS = "XkhZG4fW2t2Z";
const defaultIconSrc =
  "https://firebasestorage.googleapis.com/v0/b/spoky-4801f.appspot.com/o/CHATBOT_DEFAULT_ICON%2FChatBotIcon.png?alt=media&token=9ee2469e-0e68-4172-a0d6-63e9e4cc4bd1";
const ChatBot = () => {
  // Accessing the data attribute from the script tag
  const scriptTag = document.querySelector("script[data-agent-id]");
  const chatbotId = scriptTag ? scriptTag.dataset.agentId : null;

  console.log(scriptTag?.dataset);

  const decryptId = (id) => {
    try {
      console.log(id);
      const bytes = CryptoJS.AES.decrypt(id, SECRET_PASS);
      const decryptedId = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      return decryptedId;
    } catch (error) {
      console.log(error);
      throw new Error("Error decrypting ID");
    }
  };

  const [loading, setLoading] = useState(true);
  const [showChatbot, setShowChatbot] = useState(false);
  const [agentDetails, setAgentDetails] = useAtom(atomAgentDetails);
  const [agentStyles, setAgentStyles] = useAtom(atomAgentStyles);
  const [messages, setMessages] = useAtom(atomMessages);
  const [chatUniqueId, setChatUniqueId] = useAtom(atomChatUniqueId);
  const [notFoundError, setNotFoundError] = useState(false);

  const messagesContainerRef = useRef(null);
  useEffect(() => {
    const newUUID = generateUUID();
    setChatUniqueId(() => newUUID);
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://162.244.82.128:4003/chatbots/get-single-chatbot/${decryptId(
            chatbotId
          )}`
        );
        const data = await response.json();
        console.log(data);
        if (!data.success) {
          throw new Error(data.message || "Error fetching styles");
        }

        const { chatbotStyles, chatbotDetails } = data?.data || {};
        const initialMessage = chatbotDetails?.initialMessage;
        console.log(chatbotDetails, "chatbotDetails");
        const agentName = chatbotDetails?.name;
        const agentRole = chatbotDetails?.role;
        const userId = data?.data?.userId;
        setAgentDetails({
          agentName,
          agentRole,
          userId,
          agentId: decryptId(chatbotId),
        });
        setMessages([{ text: initialMessage, isBot: true }]);

        setAgentStyles({
          ...chatbotStyles,
        });
      } catch (error) {
        setNotFoundError(true);
        console.error("Error fetching styles:", error);
      } finally {
        setLoading(false);
      }
    };

    if (chatbotId) fetchData();
  }, [chatbotId]);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleShowChatbot = () => {
    console.log("clicked");
    setShowChatbot(() => !showChatbot);
    console.log(agentDetails);
  };
  return (
    <div
      style={{
        position: "fixed",
        bottom: "5%" /* Adjust the distance from the bottom as needed */,
        right: "2%",
        zIndex: 9999,
        // backgroundColor:"red"
      }}
    >
      {loading ? (
        <div
          style={{
            textAlign: "center",
            padding: "20px",
            fontFamily: "Outfit",
            fontSize: "1.5rem",
          }}
        >
          <p>Loading...</p>
        </div>
      ) : (
        !showChatbot && (
          <Button
            onClick={handleShowChatbot}
            sx={{
              marginTop: "10px",
              width: "90px",
              height: "90px",
              padding: 0,
              borderRadius: "50%",
              backgroundColor: "white",
              "&:focus": { outline: "none" },
              "&:hover": { border: "7px solid #62D2E9" },
              border: "7px solid #62D2E9",
            }}
          >
            <img
              src={notFoundError ? defaultIconSrc : agentStyles.icon}
              width="100%"
              height="100%"
            />
          </Button>
        )
      )}
      {showChatbot && (
        <Box
          className="customize-chatbot"
          sx={{
            width: { xs: "100%", sm: "400px" }, // "450px",
            height: { xs: "100%", sm: "600px", md: "600px" }, // "600px",
            backgroundColor: agentStyles.bgColor,
            borderRadius: "26px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            overflow: "hidden",
            // backgroundColor: "#FF8C7D",
          }}
        >
          {notFoundError ? (
            <NotFound handleShowAgent={handleShowChatbot} />
          ) : (
            <>
              <Box className="header-with-chats">
                <AgentHeader handleShowAgent={handleShowChatbot} />
                <Chats messages={messages} />
              </Box>
              <AgentFooter />
            </>
          )}
        </Box>
      )}
    </div>
  );
};

export default ChatBot;
