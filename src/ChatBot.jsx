import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import animationData from "../src/assets/Animination.json";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import {
    Container,
    Paper,
    TextField,
    InputAdornment,
    IconButton,
    Box,
    Typography,
    Button,
} from "@mui/material";
const ChatBot = () => {
    const { id } = useParams();

    const [loading, setLoading] = useState(true);
    const [chatbotname, setChatbotName] = useState("");
    const [styles, setStyles] = useState({
        bgColor: "",
        chatBubbleColor: "",
        fontColor: "",
        fontSize: "",
        fontStyle: "",
        headerGradientOne: "",
        headerGradientTwo: "",
        icon: "",
        sendButtonColor: "",
        tagline: "",
        typingSpeed: "",
        userChatBubbleColor: "lightblue",
    });
    const [botIsTyping, setBotIsTyping] = useState(false);

    const [messages, setMessages] = useState([
        {
            content: "Hello, I am ChatBot! How can I help you today?",
            sender: "bot",
        },
    ]);

    const [userInput, setUserInput] = useState("");
    const [user_id, setUserId] = useState("");
    const [role, setRole] = useState("");
    const [rotate, setRotate] = useState(false);
    const [chatUniqueId, setChatUniqueId] = useState(null);

    const [errorFetchingStyles, setErrorFetchingStyles] = useState(false);
    const [notFoundError, setNotFoundError] = useState(false);

    const messagesContainerRef = useRef(null);
    useEffect(() => {
        const newUUID = Math.random().toString(36).substring(2, 15);
        setChatUniqueId(() => newUUID);
    }, []);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    `http://162.244.82.128:4003/chatbots/get-single-chatbot/${id}`
                );
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || "Error fetching styles");
                }

                const { chatbotStyles, chatbotDetails } = data?.data || {};
                const initialMessage = chatbotDetails?.initialMessage;
                console.log(chatbotDetails, "chatbotDetails");
                const name = chatbotDetails?.name;
                setChatbotName(name);
                const chatbotRole = chatbotDetails?.role;
                const { userId } = data?.data;
                setUserId(userId);
                setRole(chatbotRole);
                setMessages([{ content: initialMessage, sender: "bot" }]);

                setStyles({
                    bgColor: chatbotStyles?.bgColor,
                    chatBubbleColor: chatbotStyles?.chatBubbleColor,
                    fontColor: chatbotStyles?.fontColor,
                    fontSize: chatbotStyles?.fontSize,
                    fontStyle: chatbotStyles?.fontStyle,
                    headerGradientOne: chatbotStyles?.headerGradientOne,
                    headerGradientTwo: chatbotStyles?.headerGradientTwo,
                    icon: chatbotStyles?.icon,
                    sendButtonColor: chatbotStyles?.sendButtonColor,
                    tagline: chatbotStyles?.tagline,
                    typingSpeed: chatbotStyles?.typingSpeed,
                    userChatBubbleColor: "lightblue",
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
    }, [id]);

    useEffect(() => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop =
                messagesContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const sendMessageToAPI = async (userMessage) => {
        console.log("true");
        setBotIsTyping(true);

        const formdata = new FormData();
        formdata.append("query", userMessage);
        formdata.append("chatbot_id", id);
        formdata.append("verticals", role);
        formdata.append("user_id", "shahzain");
        formdata.append("user_chatid", chatUniqueId);

        try {
            const response = await fetch("http://162.244.82.128:8005/chat", {
                method: "POST",
                headers: {
                    authorization:
                        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoic2hhaHphaW4ifQ.XDPGU3IGuye85yaoptxIgd3PvjLQ2bGK0WSTto8VO7Y",
                },
                body: formdata,
                redirect: "follow",
            });

            const result = await response.json();

            setTimeout(() => {
                console.log("try");
            }, 5000);
            setBotIsTyping(false);

            return result;
        } catch (error) {
            console.error("Error sending message to API:", error);
            setTimeout(() => {
                console.log("catch");
                setBotIsTyping(false);
            }, 5000);
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

    const handleSendMessage = async () => {
        if (userInput.trim() !== "") {
            setUserInput("");

            const userMessage = userInput;

            addMessage(userMessage, "user");
            // setLoadingBotResponse(true);

            try {
                const apiResponse = await sendMessageToAPI(userMessage);
                console.log("apiresponse");
                const botResponse =
                    apiResponse.Message || "Sorry, something went wrong.";
                const Message = apiResponse?.Message;

                setMessages((prevMessages) => [
                    ...prevMessages,
                    { content: Message, sender: "bot" },
                ]);
                // addMessage(botResponse, 'bot');
            } catch (error) {
                console.error("Error sending message to API:", error);
                console.log("API Error Response:", error.response);
                setTimeout(() => {
                    console.log("catch");
                    setBotIsTyping(false);
                }, 5000);
                throw error;
            } finally {
                // setLoadingBotResponse(false);
            }
        }
    };
    //   console.log(messages, "setMessages");
    const handleClick = () => {
        console.log("rotate");
        setRotate(true);
        setTimeout(() => {
            setRotate(false);
        }, 500); // Reset rotation after 500ms (same duration as transition in CSS)
    };
    const handleGenerateUUID = async () => {
        const newUUID = Math.random().toString(36).substring(2, 15);
        console.log(newUUID);
        setChatUniqueId(() => newUUID);
        setMessages((prevMessages) => {
            // Keep the first message and clear the rest
            const firstMessage = prevMessages.length > 0 ? [prevMessages[0]] : [];
            return firstMessage;
        });
    };
    console.log(chatUniqueId);
    return (
        <div>
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
                <div
                    style={{
                        backgroundColor: styles.bgColor,
                        fontSize: styles.fontSize,
                        fontFamily: styles.fontStyle,
                        color: styles.fontColor,
                        width: "1200px",
                        height: "820px",
                        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                        borderRadius: "8px",
                        overflow: "hidden",
                        marginTop: "2rem",
                    }}
                >
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
                            {chatbotname}
                        </div>
                        <div
                            className="reset-button"
                            style={{ backgroundColor: "transparent"}}
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
                            height: "500px",
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
                                                <div style={{ textAlign: "center", marginTop: "10px" }}>
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
                                    <Typography>Loading...</Typography>
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
                            placeholder="Type your message..."
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
                </div>
            )}
        </div>
    );
};

export default ChatBot;