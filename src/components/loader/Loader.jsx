import React from "react";
import ChatAgentIcon from "../../assets/Images/chat-agent-icon.png";
import animationData from "../../assets/Animination.json";
import Lottie from "react-lottie";
import { Box } from "@mui/material";
import { useAtom } from "jotai";
import { atomIsLoading } from "../../atom/atom";
const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: animationData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};
export const Loader = () => {
  const [isLoading, setIsLoading] = useAtom(atomIsLoading);
  return (
    <>
      {isLoading && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
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
            <Box>
              <img src={ChatAgentIcon} />
            </Box>

            <Box
              sx={{
                background: "linear-gradient(0deg, #62D2E9, #62D2E9)",
                p: 1,
                borderRadius: "8px",
              }}
            >
              <Lottie options={defaultOptions} width={50} />
              {/* <Typography
              align="left"
              sx={{
                fontFamily: "Outfit",
                fontSize: "15px",
                fontWeight: "400",
                color: "#ffffff",
              }}
            >
              message
            </Typography> */}
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};
