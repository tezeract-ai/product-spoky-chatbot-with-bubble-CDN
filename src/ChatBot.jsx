import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Typewriter from 'typewriter-effect';
import { TypeAnimation } from "react-type-animation";
// import SendIcon from '@mui/icons-material/Send';

const ChatBot = () => {
    const { id } = useParams();
    console.log("id", id)

    const [loading, setLoading] = useState(true);
    const [chatbotname, setchatbotname] = useState("");
    const [styles, setStyles] = useState({
        bgColor: '',
        chatBubbleColor: '',
        fontColor: '',
        fontSize: '',
        fontStyle: '',
        headerGradientOne: '',
        headerGradientTwo: '',
        icon: '',
        sendButtonColor: '',
        tagline: '',
        typingSpeed: '',
        userChatBubbleColor: 'lightblue',


    });

    const [messages, setMessages] = useState([
        { content: 'Hello, I am ChatBot! How can I help you today?', sender: 'bot' },
    ]);

    const [userInput, setUserInput] = useState('');
    const [user_id, setUserId] = useState('');
    const [role, setRole] = useState('');
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://162.244.82.128:4003/chatbots/get-styles/${id}`);
                const data = await response.json();
                console.log('data', data);
                const { chatbotStyles, chatbotDetails } = data?.data || {};
                console.log("chatbotDetails", chatbotDetails);
                const initialMessage = chatbotDetails?.initialMessage;
                const name = chatbotDetails?.name;
                setchatbotname(name)
                console.log(name)
                const chatbotRole = chatbotDetails?.role;
                console.log('chatbotRole', chatbotRole);
                const { userId } = data?.data;
                console.log(userId);
                setUserId(userId);
                setRole(chatbotRole);
                setMessages([{ content: initialMessage, sender: 'bot' }]);
                setStyles({
                    bgColor: chatbotStyles?.bgcolor,
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
                    userChatBubbleColor: 'lightblue',
                });

                setLoading(false);
            } catch (error) {
                console.error('Error fetching styles:', error);
            }
        };

        fetchData();
    }, []);

    const sendMessageToAPI = async (userMessage) => {
        const formdata = new FormData();
        formdata.append("query", userMessage);
        formdata.append("chatbot_id", "6589678c4a3d102039b3fb4f");
        formdata.append("verticals", role);
        formdata.append("user_id", 'shahzain');
        console.log('formdata', formdata)
        try {
            const response = await fetch('http://162.244.82.128:8005/chat', {
                method: 'POST',
                headers: {
                    'authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoic2hhaHphaW4ifQ.XDPGU3IGuye85yaoptxIgd3PvjLQ2bGK0WSTto8VO7Y',
                },
                body: formdata,

                redirect: 'follow',
                // mode: 'no-cors',  // Set the mode to 'no-cors'

            });

            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error sending message to API:', error);
            throw error;
        }
    };

    const addMessage = (content, sender = 'user') => {
        setMessages((prevMessages) => [
            ...prevMessages,
            { content, sender }
        ]);
    };

    const handleUserInput = (e) => {
        setUserInput(e.target.value);
    };
    const handleSendMessage = async () => {
        console.log('Sending message:', userInput);

        if (userInput.trim() !== '') {
            const userMessage = userInput;

            // Add the user's message to the messages array
            addMessage(userMessage, 'user');

            try {
                const apiResponse = await sendMessageToAPI(userMessage);
                console.log('API Response:', apiResponse);

                // Extract the message from the API response
                const botResponse = apiResponse.Message || 'Sorry, something went wrong.';

                // Add the bot's response to the messages array
                addMessage(botResponse, 'bot');

            } catch (error) {
                console.error('Error handling API response:', error);
                addMessage('Sorry, something went wrong.', 'bot');
            }

            setUserInput('');
        }
    };


    useEffect(() => {
        if (messages[messages.length - 1]?.sender === 'user') {
            // setTimeout(() => {
            //     // const botResponse = 'I received your message! This is a bot response.';
            //     addMessage(botResponse, 'bot');
            // }, styles.typingSpeed);
        }
    }, [messages, styles.typingSpeed]);
    return (
        <div
            style={{
                backgroundColor: styles?.bgColor,
                fontSize: styles.fontSize,
                fontFamily: styles.fontStyle,
                color: styles.fontColor,
                width: '800px',
                margin: 'auto',
                boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                borderRadius: '8px',
                overflow: 'hidden',
            }}
        >
            {loading ? (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    <p>Loading...</p>
                </div>
            ) : (
                <>
                    <div
                        style={{
                            background: `linear-gradient(to right, ${styles.headerGradientOne}, ${styles.headerGradientTwo})`,
                            padding: '10px',
                            textAlign: 'center',
                            height: '30px', // Set the height of the header
                            width: '100%', // Set the width of the header
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',

                        }}
                    >
                        {styles.icon && (
                            <img
                                src={styles.icon}
                                alt="Chatbot Icon"
                                style={{ width: '24px', height: '24px', marginRight: '10px' }}
                            />
                        )}

                        {/* <div style={{ fontSize: '24px', marginBottom: '5px' }}>{styles.icon}</div> */}
                        <div style={{ fontSize: '24px', padding: '5px 0', color: 'white', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{chatbotname}</div>
                        <div style={{ fontSize: '18px' }}>{styles.tagline}</div>
                    </div>

                    <div
                        style={{
                            height: '500px',
                            overflowY: 'auto',
                            padding: '15px',
                            borderBottom: `1px solid ${styles.userChatBubbleColor}`,
                            scrollbarWidth: 'thin', // Firefox
                            scrollbarColor: `${styles.headerGradientOne} ${styles.headerGradientTwo}`, // Firefox
                        }}
                    >
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                style={{
                                    textAlign: message.sender === 'user' ? 'right' : 'left',
                                    marginBottom: '10px',
                                }}
                            >
                                <div
                                    style={{
                                        display: 'inline-block',
                                        background:
                                            message.sender === 'user'
                                                ? styles.userChatBubbleColor
                                                : styles.chatBubbleColor,
                                        color: message.sender === 'user' ? 'black' : '#333',
                                        padding: '10px',
                                        borderRadius: '8px',
                                        maxWidth: '70%',
                                    }}
                                >
                                    {message.sender === 'bot' ? (
                                        <TypeAnimation
                                            sequence={[message.content]}
                                            speed={parseInt(styles.typingSpeed)}
                                            cursor={false}
                                        />
                                    ) : (
                                        message.content
                                    )}
                                </div>
                            </div>
                        ))}

                    </div>

                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '10px',
                        }}
                    >
                        <input
                            type="text"
                            placeholder="Type your message..."
                            style={{
                                flex: 1,
                                padding: '10px',
                                borderRadius: '5px',
                                border: '1px solid #ddd',
                                outline: 'none',
                                backgroundColor: 'white',
                                color: 'black',
                                marginRight: '10px', // Add margin for space
                            }}
                            value={userInput}
                            onChange={handleUserInput}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleSendMessage();
                                }
                            }}
                        />
                        <button
                            style={{
                                backgroundColor: styles.sendButtonColor,
                                padding: '8px 15px',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                background: `linear-gradient(to right, ${styles.headerGradientOne}, ${styles.headerGradientTwo})`,
                            }}
                            onClick={handleSendMessage}
                        >
                            {/* <SendIcon style={{ marginRight: '5px' }} /> */}
                        </button>
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center',
                            borderTop: `1px solid ${styles.userChatBubbleColor}`,
                            padding: '10px',
                            height: 'auto', // Set the height of the footer
                            width: '100%', // Set the width of the footer
                        }}
                    >
                        <div style={{ fontSize: '18px', marginTop: '5px', color: 'black' }}>Building an Unbiased World</div>
                        {/* <div style={{ fontSize: '24px', marginBottom: '5px' }}>{styles.icon}</div> */}
                        <div style={{ fontSize: '18px' }}>{styles.tagline}</div>
                    </div>

                    <div
                        style={{
                            background: `linear-gradient(to right, ${styles.headerGradientOne}, ${styles.headerGradientTwo})`,
                            padding: '10px',
                            textAlign: 'center',
                            borderTop: `1px solid ${styles.userChatBubbleColor}`,
                            height: '30px', // Set the height of the footer
                            width: '100%', // Set the width of the footer
                        }}
                    >
                        <div style={{
                            fontSize: '24px', marginBottom: '5px',
                            background: `linear-gradient(to right, ${styles.headerGradientOne}, 
                             ${styles.headerGradientTwo})`,
                        }}></div>
                        <div style={{ fontSize: '18px' }}>{styles.tagline}</div>
                    </div>

                </>
            )}
        </div>
    );
};

export default ChatBot;