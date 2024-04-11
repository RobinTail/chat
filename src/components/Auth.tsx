import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { AuthButton } from "./AuthButton.tsx";

export const Auth = () => (
  <Box
    sx={{
      display: "flex",
      flexFlow: "column nowrap",
      height: "100vh",
      overflowX: "hidden",
    }}
  >
    <Box
      sx={{
        display: "flex",
        height: "25vh",
        minHeight: "120px",
        justifyContent: "center",
        alignItems: "center",
        mt: { xs: 0, md: "10vh" },
      }}
    >
      <Box
        sx={{
          "& > *": {
            textAlign: "center",
            fontWeight: 400,
            m: 0,
          },
        }}
      >
        <Typography variant="h2">Welcome to Robichat</Typography>
        <Typography variant="h1">Let's get closer</Typography>
      </Box>
    </Box>
    <Box
      sx={{
        display: "flex",
        flexFlow: { xs: "column nowrap", md: "row nowrap" },
        height: { xs: "60vh", md: "200px" },
        minHeight: "200px",
        justifyContent: "center",
      }}
    >
      <AuthButton provider="fb" url="/auth/facebook" />
      <AuthButton disabled provider="tw" url="/auth/twitter" />
      <AuthButton disabled provider="gg" url="/auth/google" />
    </Box>
  </Box>
);
