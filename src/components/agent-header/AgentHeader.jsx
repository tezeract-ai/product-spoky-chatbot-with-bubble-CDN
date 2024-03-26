import React from "react";
import { Box, Button, Typography } from "@mui/material";
import AgentIcon from "../../assets/Images/agent-icon.png";
import { useAtom } from "jotai";
import { atomAgentDetails, atomAgentStyles } from "../../atom/atom";

export const AgentHeader = ({ handleShowAgent }) => {
  const [agentDetails, setAgentDetails] = useAtom(atomAgentDetails);
  const [agentStyles] = useAtom(atomAgentStyles);
  return (
    <Box
      className="header"
      sx={{
        width: "100%",
        // overflow: "hidden",
        borderRadius: "20px",
        // backgroundColor: "green",
        position: "relative",
      }}
    >
      <svg
        width="100%"
        height="140"
        margin-top="-5"
        viewBox="0 0 427 137"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <ellipse
          cx="212.749"
          cy="49.6168"
          rx="271.386"
          ry="87.2042"
          fill="url(#paint0_linear_260_1313)"
        />
        <defs>
          <linearGradient
            id="paint0_linear_260_1313"
            x1="-58.6367"
            y1="49.6172"
            x2="484.134"
            y2="49.6172"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0.107631" stopColor={agentStyles?.headerColor} />
          </linearGradient>
        </defs>
      </svg>
      <Box
        sx={{
          position: "absolute",
          top: 15,
          right: 20,
          width: "30px",
          height: "30px",
          background: "#FAF9F9",
          boxShadow:
            "0px 3.0070419311523438px 3.0070419311523438px 0px #00000040 inset",
          borderRadius: "50%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Button
          disableElevation
          disableTouchRipple
          onClick={() => handleShowAgent()}
          sx={{
            "&:hover": { background: "transparent" },
            "&:focus": { outline: "none" }, // Use &:focus instead of &:focused
            "&.MuiButton-outlined": {
              // Remove border for outlined variant
              border: "none",
            },
          }}
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 17 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0.820945 0.528453C0.210727 1.13867 0.210727 2.12801 0.820945 2.73823L6.42287 8.34013L0.820945 13.9421C0.210727 14.5523 0.210727 15.5417 0.820945 16.1519C1.43115 16.7621 2.4205 16.7621 3.03071 16.1519L8.63262 10.5499L14.2346 16.1519C14.8448 16.7621 15.8342 16.7621 16.4444 16.1519C17.0546 15.5417 17.0546 14.5523 16.4444 13.9421L10.8424 8.34013L16.4444 2.73825C17.0546 2.12804 17.0546 1.13869 16.4444 0.528485C15.8341 -0.0817344 14.8448 -0.0817344 14.2346 0.528485L8.63262 6.13038L3.03071 0.528453C2.4205 -0.0817501 1.43115 -0.0817501 0.820945 0.528453Z"
              fill="#0F0F0F"
              fillOpacity="0.7"
            />
          </svg>
        </Button>
      </Box>
      <Typography
        noWrap
        sx={{
          position: "absolute",
          bottom: "20%",
          left: "45%",
          fontFamily: "Outfit",
          fontWeight: "500",
          color: "#ffffff",
          fontSize: "26px",
        }}
      >
        {agentDetails?.agentName}
      </Typography>
      <Box
        className="agent-icon-box"
        sx={{
          position: "absolute",
          bottom: "-2%",
          left: "15%",
          backgroundColor: "#ffffff",
          width: "100px",
          height: "100px",
          borderRadius: "50%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        <img
          src={agentStyles?.icon}
          alt="agent-icon"
          width={"100%"}
          height={"100%"}
        />
      </Box>
    </Box>
  );
};
