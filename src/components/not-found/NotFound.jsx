import { Box, Button, Container, Typography } from "@mui/material";
import React from "react";

export const NotFound = ({ handleShowAgent }) => {
  return (
    <Box
      sx={{
        backgroundColor: "#FF8C7D",
        width: "100%",
        height: "100%",
        display: "flex",
        // justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "end", width: "100%", p: 2 }}>
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

      <Container maxWidth="sm">
        <img
          src="https://app.stammer.ai/static/common/img/illustrations/errors/404.5e247682dc69.svg"
          alt="Error"
          style={{
            height: "100%",
            width: "100%",
          }}
        />
        <Typography
          align="center"
          sx={{
            mt: { xs: 1, sm: 2 },
            fontFamily: "Outfit",
            fontWeight: "bold",
            fontSize: { xs: "1rem", sm: "1.5rem" },
          }}
        >
          The requested resource was not found. Please contact the website's
          support team.
        </Typography>
      </Container>
    </Box>
  );
};
