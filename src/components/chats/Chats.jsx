import React, { useEffect, useRef } from "react";
import { Box, Button, Typography } from "@mui/material";
import { TypeAnimation } from "react-type-animation";
import ChatAgentIcon from "../../assets/Images/chat-agent-icon.png";
import { Loader } from "../loader/Loader";
import { useAtom } from "jotai";
import { atomAgentStyles, atomIsLoading } from "../../atom/atom";
import { getSpeed } from "../../utils";
export const Chats = ({ messages }) => {
  const [agentStyles] = useAtom(atomAgentStyles);
  const [isLoading] = useAtom(atomIsLoading);
  const chatBoxRef = useRef(null);
  const scrollToBottom = () => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  console.log(agentStyles);
  return (
    <Box
      className="messages-box"
      ref={chatBoxRef}
      sx={{
        mt: 4,
        height: "250px",
        overflowY: "auto",
        WebkitOverflowScrolling: "touch",
        scrollbarWidth: "thin",
        // scrollbarColor: "#62D2E9 transparent",
        "&::-webkit-scrollbar": {
          borderRadius: "8px",
        },
      }}
    >
      {messages?.map((message, index) => {
        const lastMessage =
          messages && messages.length > 0
            ? messages[messages.length - 1]
            : null;
        return (
          <Box
            key={index}
            sx={{
              display: "flex",
              justifyContent: message?.isBot ? "flex-start" : "flex-end",
              my: 3,
            }}
          >
            <Box
              className="icon-with-message"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                px: 1,
              }}
            >
              {message?.isBot && (
                <Box>
                  <img src={ChatAgentIcon} />
                </Box>
              )}

              <Box
                sx={{
                  background: message?.isBot
                    ? agentStyles.agentChatBubbleColor
                    : agentStyles?.userChatBubbleColor,
                  p: 2,
                  borderRadius: "8px",
                  border: !message?.isBot ? "1.22px solid #E3E0E0" : "",
                  boxShadow: !message?.isBot
                    ? "0px 1.2208397388458252px 1.2208397388458252px 0px #00000040"
                    : "",
                }}
              >
                <Typography
                  align="left"
                  sx={{
                    fontFamily: agentStyles?.fontStyle,
                    fontSize: `${agentStyles?.fontSize}px`,
                    fontWeight: "400",
                    color: message?.isBot ? "#ffffff" : "#000000",
                  }}
                >
                  {message === lastMessage && message?.isBot ? (
                    <TypeAnimation
                      sequence={[message.text]}
                      speed={getSpeed(agentStyles?.typingSpeed)}
                      cursor={false}
                    />
                  ) : (
                    message?.text
                  )}
                </Typography>
              </Box>
            </Box>
          </Box>
        );
      })}
      <Loader isLoading={isLoading} />
    </Box>
  );
};
