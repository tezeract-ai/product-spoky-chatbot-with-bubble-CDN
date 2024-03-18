import { atom } from "jotai";

export const atomAgentStyles = atom({
  bgColor: "#ffffff",
  agentChatBubbleColor: "linear-gradient(0deg, #62D2E9, #62D2E9)",
  userChatBubbleColor: "#ffffff",
  fontColor: "#000000",
  fontSize: "",
  fontStyle: "",
  headerColor: "#62D2E9",
  sendButtonColor: "#62D2E9",
  typingSpeed: "Fast",
  icon: "",
  tagline: "",
});
export const atomAgentDetails = atom({
  agentName: "",
  agentRole: "",
  userId: null,
  agentId: null,
});
export const atomUserMessage = atom("");
export const atomMessages = atom([]);
export const atomIsLoading = atom(false);
export const atomChatUniqueId = atom(null);
