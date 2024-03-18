import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import animationData from "../src/assets/Animination.json";
import Lottie from "react-lottie";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Typography, Button, Box } from "@mui/material";
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
// const SECRET_PASS = import.meta.env.VITE_ENCRYPTION_SECRET || "";
const SECRET_PASS = "XkhZG4fW2t2Z";

const ChatBot = () => {
  // Accessing the data attribute from the script tag
  const scriptTag = document.querySelector("script[data-agent-id]");
  const chatbotId = scriptTag ? scriptTag.dataset.agentId : null;

  console.log(scriptTag?.dataset);

  const decryptId = (id) => {
    console.log(id);
    const bytes = CryptoJS.AES.decrypt(id, SECRET_PASS);
    const decryptedId = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decryptedId;
  };

  const [loading, setLoading] = useState(true);
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatbotName, setChatbotName] = useState("");
  const [user_id, setUserId] = useState("");
  const [role, setRole] = useState("");
  const [agentDetails, setAgentDetails] = useAtom(atomAgentDetails);
  const [agentStyles, setAgentStyles] = useAtom(atomAgentStyles);
  const [botIsTyping, setBotIsTyping] = useState(false);

  const [messages, setMessages] = useAtom(atomMessages);

  const [userInput, setUserInput] = useState("");

  const [rotate, setRotate] = useState(false);
  const [chatUniqueId, setChatUniqueId] = useAtom(atomChatUniqueId);

  const [errorFetchingStyles, setErrorFetchingStyles] = useState(false);
  const [notFoundError, setNotFoundError] = useState(false);
  const [waitingForResponse, setWaitingForResponse] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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

        setLoading(false);
      } catch (error) {
        console.error("Error fetching styles:", error);
        setErrorFetchingStyles(true);

        if (
          error &&
          error.message === "The requested URL was not found on this server"
        ) {
          setNotFoundError(true);
        }
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessageToAPI = async (userMessage) => {
    console.log("true");
    setBotIsTyping(true);

    // console.log("API try-------------====");
    const formData = new FormData();
    formData.append("query", userMessage);
    formData.append("chatbot_id", decryptId(chatbotId));
    formData.append("vertical", role);
    formData.append("user_id", user_id);
    formData.append("user_chatid", chatUniqueId);

    // console.log("API try-------------====");
    try {
      const response = await fetch(
        "https://app.spoky.co/ai_backend_fetch/chat",
        {
          method: "POST",
          headers: {
            // authorization: import.meta.env.VITE_CHAT_API_AUTHORIZATION_TOKEN,
            authorization:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjVlNTgyNmQ3M2ZkODQ0YTQ1MmM1MDgwIiwiaWF0IjoxNzA5NTYyMDYxLCJleHAiOjE3MDk4MjEyNjF9.OviGc6ToZrFzjIJJZrOzDN6D_YiWgAzACMKe8wVS8Xc",
          },
          body: formData,
          redirect: "follow",
        }
      );

      const result = await response.json();
      console.log(result);

      setBotIsTyping(false);

      return result;
    } catch (error) {
      console.log("catch");
      console.error("Error sending message to API:", error);
      setTimeout(() => {}, 5000);
      setBotIsTyping(false);
      throw error;
    }
  };

  const addMessage = (content, sender = "user") => {
    setMessages((prevMessages) => [...prevMessages, { content, sender }]);
  };
  console.log(messages);

  const handleUserInput = (e) => {
    setUserInput(e.target.value);
  };
  const errorMessageBot =
    "Apologies, I'm currently unable to offer a response. Please attempt to regenerate it once more.";
  const handleSendMessage = async () => {
    // console.log("send message", userInput);
    if (userInput.trim() !== "") {
      setUserInput("");

      if (waitingForResponse) {
        // Display an error message to the user.
        setErrorMessage(
          "Please wait for the previous response before asking a new question."
        );

        // Clear the error message after 5 seconds.
        setTimeout(() => {
          setErrorMessage("");
        }, 5000);

        return;
      }

      const userMessage = userInput;

      addMessage(userMessage, "user");
      setWaitingForResponse(true); // Set the flag to indicate that the bot is waiting for a response.

      try {
        // console.log("try-----------------");
        const apiResponse = await sendMessageToAPI(userMessage);

        apiResponse.Message || "Sorry, something went wrong.";
        const Message = apiResponse?.Message;

        setMessages((prevMessages) => [
          ...prevMessages,
          {
            content: apiResponse?.status === 200 ? Message : errorMessageBot,
            sender: "bot",
          },
        ]);
      } catch (error) {
        console.log("catch error ++++++++++++");
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            content: errorMessageBot,
            sender: "bot",
          },
        ]);
        // Handle errors
      } finally {
        console.log("catch error ++++++++++++");

        setWaitingForResponse(false); // Reset the flag after receiving the bot response.
      }
    }
  };

  console.log(messages, "setMessages");
  const handleClick = () => {
    console.log("rotate");
    setRotate(true);
    setTimeout(() => {
      setRotate(false);
    }, 500); // Reset rotation after 500ms (same duration as transition in CSS)
  };
  const handleShowChatbot = () => {
    console.log("clicked");
    setShowChatbot(() => !showChatbot);
    console.log(agentDetails);
  };
  return (
    <div
      style={{
        position: "fixed",
        bottom: "10px" /* Adjust the distance from the bottom as needed */,
        right: "10px",
        zIndex: 9999,
        // backgroundColor:"red"
      }}
    >
      {/*<Button
        onClick={() => setShowChatbot(false)}
        sx={{
          display: showChatbot ? "flex" : "none",
          marginBottom: "10px",
          capitalize: "none",
          width: "50px",
          height: "50px",
          backgroundColor: "#FF8C7D",
          borderRadius: "50%",
          justifyContent: "center",
          alignItems: "center",
          "&:focus": {
            outline: "none",
          },
          "&:hover": {
            backgroundColor: "#FF8C7D",
          },
        }}
      >
        <div
          className="show-chatbot-icon"
          style={{
            width: "100%",
            height: "100%",
            padding: 0,
            backgroundColor: "transparent",
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
          }}
        >
          <KeyboardArrowDownIcon sx={{ fontSize: "5rem", color: "#62D2E9" }} />
        </div>{" "}
      </Button> */}

      {loading ? (
        <div
          style={{
            textAlign: "center",
            padding: "20px",
            fontFamily: "fantasy",
            fontSize: "2rem",
          }}
        >
          <p>
            {errorFetchingStyles ? (
              <>
                <img
                  src="https://app.stammer.ai/static/common/img/illustrations/errors/404.5e247682dc69.svg"
                  alt="Error"
                  style={{
                    height: "60%",
                    width: "70%",
                  }}
                />
                <br />
                {notFoundError
                  ? "Error fetching styles"
                  : "The requested URL was not found on this server"}
              </>
            ) : (
              "Loading..."
            )}
          </p>
        </div>
      ) : (
        showChatbot && (
          <Box
            className="customize-chatbot"
            sx={{
              width: { xs: "100%", sm: "400px" }, // "450px",
              height: { xs: "60%", md: "600px" }, // "600px",
              backgroundColor: agentStyles.bgColor,
              borderRadius: "26px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              // backgroundColor: "#FF8C7D",
            }}
          >
            <Box className="header-with-chats">
              <AgentHeader handleShowAgent={handleShowChatbot} />
              <Chats messages={messages} />
            </Box>
            <AgentFooter />
          </Box>
        )
      )}
      {/* <div
            className="chatbot-container"
            style={{
              backgroundColor: styles.bgColor,
              fontSize: styles.fontSize,
              fontFamily: styles.fontStyle,
              color: styles.fontColor,
              width: "500px",
              height: "500px",
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
              borderRadius: "8px",
              overflow: "hidden",

              // marginTop: "2rem",
            }}
          >
           <h5>Chatbot Id : {chatbotId}</h5>
            <div
              style={{
                background: `linear-gradient(to right, ${styles.headerGradientOne}, ${styles.headerGradientTwo})`,
                padding: "10px",
                textAlign: "center",
                height: "50px",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {styles.icon && (
                <img
                  src={styles.icon}
                  alt="Chatbot Icon"
                  style={{
                    width: "40px",
                    height: "40px",
                    marginRight: "10px",
                    borderRadius: "50%",
                  }}
                />
              )}

              <div
                style={{
                  fontSize: "24px",
                  padding: "5px 0",
                  color: "white",
                  textAlign: "center",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {chatbotName}
              </div>
              <div
                className="reset-button"
                style={{ backgroundColor: "transparent" }}
              >
                <Button
                  disableElevation
                  disableTouchRipple
                  onClick={handleClick}
                  sx={{
                    color: "#FFFFFF",
                    ml: 3,
                    cursor: "pointer",
                    transition: "transform 0.5s ease",
                    "&.rotate": {
                      transform: "rotate(180deg)",
                    },
                    "&:hover": {
                      backgroundColor: "transparent",
                    },
                    "&:focus": {
                      backgroundColor: "transparent",
                      border: 0,
                      outline: 0,
                    },
                  }}
                  className={rotate ? "rotate" : ""}
                >
                  <RestartAltIcon onClick={() => handleGenerateUUID()} />
                </Button>
              </div>
            </div>

            <div
              style={{
                height: "300px",
                overflowY: "auto",
                padding: "15px",
                borderBottom: `1px solid ${styles.userChatBubbleColor}`,
                backgroundColor: `${styles.bgColor}`,
                borderRadius: "24px",
                width: "98%",
                position: "relative",
                WebkitOverflowScrolling: "touch",
                scrollbarWidth: "thin",
                scrollbarColor: "red transparent",
              }}
              ref={messagesContainerRef}
            >
              {messages.map((message, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    flexDirection:
                      message.sender === "user" ? "row-reverse" : "row",
                    alignItems: "flex-start",
                    marginBottom: "10px",
                  }}
                >
                  {message.sender === "bot" && styles.icon && (
                    <img
                      src={styles.icon}
                      alt="Bot Icon"
                      style={{
                        width: "50px",
                        height: "50px",
                        marginRight: "10px",
                        borderRadius: "50%",
                      }}
                    />
                  )}
                  <div
                    style={{
                      background:
                        message.sender === "user"
                          ? styles.userChatBubbleColor
                          : styles.chatBubbleColor,
                      color: styles.fontColor,
                      padding: "10px",
                      borderRadius: "8px",
                      maxWidth: "70%",
                      textAlign: "left",
                    }}
                  >
                    {message.sender === "bot" ? (
                      <>
                        {index === messages.length - 1 && botIsTyping ? (
                          <div
                            style={{ textAlign: "center", marginTop: "10px" }}
                          >
                            <Typography>Loading...</Typography>
                          </div>
                        ) : (
                          message.content
                        )}
                      </>
                    ) : (
                      message.content
                    )}
                  </div>
                </div>
              ))}
              {botIsTyping && (
                <div
                  className="icon-with-loading-text"
                  style={{ display: "flex" }}
                >
                  <img
                    src={styles.icon}
                    alt="Bot Icon"
                    style={{
                      width: "50px",
                      height: "50px",
                      marginRight: "10px",
                      borderRadius: "50%",
                    }}
                  />
                  <div
                    style={{
                      background: styles.chatBubbleColor,
                      color: "#333",
                      padding: "10px",
                      borderRadius: "8px",
                      maxWidth: "20%",
                      textAlign: "left",
                    }}
                  >
                    <Lottie options={defaultOptions} width={50} />
                  </div>
                </div>
              )}
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px",
              }}
            >
              <input
                type="text"
                placeholder="Ask me Anything..."
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "5px",
                  border: "1px solid #ddd",
                  outline: "none",
                  backgroundColor: "white",
                  color: "black",
                  marginRight: "10px",
                }}
                value={userInput}
                onChange={handleUserInput}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSendMessage();
                  }
                }}
              />
              <button
                style={{
                  color: styles.sendButtonColor,
                  padding: "8px 15px",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  background: `linear-gradient(to right, ${styles.headerGradientOne}, ${styles.headerGradientTwo})`,
                }}
                onClick={handleSendMessage}
              >
                <FontAwesomeIcon
                  icon={faPaperPlane}
                  style={{ marginRight: "5px" }}
                />
              </button>
            </div>
            <div>
              {errorMessage && (
                <div
                  style={{ color: "red", marginTop: "10px", fontSize: "1rem" }}
                >
                  {errorMessage}
                </div>
              )}
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                borderTop: `1px solid ${styles.userChatBubbleColor}`,
                padding: "10px",
                height: "auto",
                width: "100%",
              }}
            >
              <div style={{ fontSize: "18px" }}>{styles.tagline}</div>
            </div>

            <div
              style={{
                background: `linear-gradient(to right, ${styles.headerGradientOne}, ${styles.headerGradientTwo})`,
                padding: "10px",
                textAlign: "center",
                borderTop: `1px solid ${styles.userChatBubbleColor}`,
                height: "50px",
                width: "100%",
                marginTop: "2.7rem",
              }}
            >
              <div
                style={{
                  fontSize: "24px",
                  background: `linear-gradient(to right, ${styles.headerGradientOne}, 
                             ${styles.headerGradientTwo})`,
                }}
              ></div>
            </div>
          </div> */}

      {!showChatbot && (
        <Button
          onClick={handleShowChatbot}
          sx={{
            marginTop: "10px",
            width: "80px",
            height: "65px",
            padding: 0,
            borderRadius: "50%",
            backgroundColor: "white",
            "&:focus": { outline: "none" },
          }}
        >
          <div
            className="show-chatbot-icon"
            style={{
              width: "100%",
              height: "100%",
              padding: 0,
              backgroundColor: "#ffffff",
              border: "7px solid #62D2E9",
              borderRadius: "50%",
            }}
          >
            <img src={agentStyles.icon} width="100%" height="100%" />
          </div>
        </Button>
      )}
    </div>
  );
};

export default ChatBot;
