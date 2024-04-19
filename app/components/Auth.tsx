import Typography from "@mui/material/Typography";
import type { SxProps } from "@mui/material";
import Box from "@mui/material/Box";
import { AuthButton } from "./AuthButton.tsx";

const layoutSx: SxProps = {
  display: "flex",
  flexFlow: "column nowrap",
  height: "100vh",
  overflowX: "hidden",
};

const greetingsSx: SxProps = {
  display: "flex",
  flexFlow: "column nowrap",
  height: "40vh",
  minHeight: "120px",
  justifyContent: "center",
  alignItems: "center",
  "& > *": {
    textAlign: "center",
    m: 0,
    zoom: { xs: 0.6, sm: 0.95, md: "unset" },
  },
};

const buttonsSx: SxProps = {
  display: "flex",
  flexFlow: { xs: "column nowrap", md: "row nowrap" },
  height: { xs: "60vh", md: "200px" },
  minHeight: "200px",
  justifyContent: "center",
};

export const Auth = () => (
  <Box sx={layoutSx}>
    <Box sx={greetingsSx}>
      <Typography variant="h2">Welcome to Robichat</Typography>
      <Typography variant="h1">Let's get closer</Typography>
    </Box>
    <Box sx={buttonsSx}>
      <AuthButton provider="facebook" url="/auth/facebook" />
      <AuthButton provider="twitter" url="/auth/twitter" />
      <AuthButton provider="google" url="/auth/google" />
    </Box>
  </Box>
);
