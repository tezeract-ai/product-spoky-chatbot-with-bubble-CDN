import React from "react";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import SendButtonIcon from "../../assets/Images/send-button-icon.png";
import { useAtom } from "jotai";
import {
  atomAgentDetails,
  atomAgentStyles,
  atomChatUniqueId,
  atomIsLoading,
  atomMessages,
  atomUserMessage,
} from "../../atom/atom";
import { generateUUID, sendQuery } from "../../utils";

export const AgentFooter = () => {
  const [userMessage, setUserMessage] = useAtom(atomUserMessage);
  const [messages, setMessages] = useAtom(atomMessages);
  const [agentDetails, setAgentDetails] = useAtom(atomAgentDetails);
  const [agentStyles] = useAtom(atomAgentStyles);
  const [isLoading, setIsLoading] = useAtom(atomIsLoading);
  const [chatUniqueId, setChatUniqueId] = useAtom(atomChatUniqueId);
  const handleSendMessage = async () => {
    console.log("send message");
    console.log(userMessage);
    const sentMessage = { text: userMessage, isBot: false };
    setMessages((prev) => [...prev, sentMessage]);
    const queryObject = {
      query: userMessage,
      agentId: agentDetails.agentId,
      agentRole: agentDetails.agentRole,
      userId: agentDetails.userId,
      chatUniqueId: chatUniqueId,
    };
    try {
      setUserMessage("");
      setIsLoading(true);
      const botResponse = await sendQuery(queryObject);
      console.log(botResponse);
      setMessages((prev) => [...prev, { text: botResponse, isBot: true }]);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      const errorMessage =
        "Apologies, I'm currently unable to offer a response. Please attempt to regenerate it once more.";
      setMessages((prev) => [...prev, { text: errorMessage, isBot: true }]);
      setIsLoading(false);
    }
  };
  const handleGenerateUUID = async () => {
    const newUUID = generateUUID();
    console.log(newUUID);
    setChatUniqueId(() => newUUID);
    setMessages((prevMessages) => {
      // Keep the first message and clear the rest
      const firstMessage = prevMessages.length > 0 ? [prevMessages[0]] : [];
      return firstMessage;
    });
  };
  return (
    <Box className="agent-footer">
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          my: 2,
        }}
      >
        <Button
          disableElevation
          disableRipple
          onClick={handleGenerateUUID}
          sx={{
            background: "#D9D9D9",
            borderRadius: "24px",
            fontFamily: "Outfit",
            color: "#000000",
            px: 2,
            "&:hover": {
              background: "#D9D9D9",
            },
            "&:focus": { outline: "none" }, // Use &:focus instead of &:focused
            "&.MuiButton-outlined": {
              // Remove border for outlined variant
              border: "none",
            },
          }}
        >
          New Conversation
        </Button>
      </Box>
      <Typography
        align="center"
        noWrap
        sx={{
          fontFamily: "Outfit",
          color: "#21212180",
          mb: 1,
          px: 2,
        }}
      >
        {agentStyles?.tagline || "Spoky fallback tagline"}
      </Typography>
      <Box sx={{ px: 3, pb: 2 }}>
        <TextField
          onChange={(e) => setUserMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && userMessage !== "") {
              handleSendMessage();
            }
          }}
          value={userMessage}
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                border: "none", // Remove border
              },
              "&:hover fieldset": {
                border: "none", // Remove border on hover
              },
              "&.Mui-focused fieldset": {
                border: "none", // Remove border when focused
                outline: "none", // Remove outline when focused
              },
            },
          }}
          fullWidth
          placeholder="Ask me anything"
          InputProps={{
            sx: {
              borderRadius: "90px",
              background: "#E7EAF1",
              border: "none",
              outline: "none",
              pl: 2,
              fontFamily: "Outfit",
              fontSize: "16px",
              fontWeight: "400",
            },

            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  disableTouchRipple
                  onClick={handleSendMessage}
                  disabled={userMessage === "" || isLoading}
                  sx={{
                    backgroundColor: agentStyles?.sendButtonColor || "#62D2E9",
                    width: "40px",
                    height: "40px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    boxShadow:
                      "0px 1.133389949798584px 1.133389949798584px 0px #00000040",

                    "&:hover": {
                      backgroundColor: "#62D2E9",
                    },
                    "&:focus": { outline: "none" }, // Use &:focus instead of &:focused
                    "&.MuiButton-outlined": {
                      // Remove border for outlined variant
                      border: "none",
                    },
                  }}
                >
                  <img src={SendButtonIcon} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>
    </Box>
  );
};
