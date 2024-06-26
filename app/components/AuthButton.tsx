import type { SxProps } from "@mui/material";
import Box from "@mui/material/Box";
import { mergeSx } from "merge-sx";
import { Provider, providers } from "../Provider.tsx";

const btnSx: SxProps = {
  display: "flex",
  flex: "1 0 33%",
  height: "100%",
  cursor: "pointer",
  maxWidth: { xs: "100%", md: "200px" },
  justifyContent: "center",
  alignItems: "center",
  "& > svg": {
    maxWidth: "100%",
    maxHeight: "100%",
  },
};

export const AuthButton = ({
  disabled,
  url,
  provider,
}: {
  disabled?: boolean;
  url: string;
  provider: Provider;
}) => {
  const { Logo } = providers[provider];

  return (
    <Box
      onClick={
        disabled ? undefined : () => window.location.replace(`${coreUrl}${url}`)
      }
      sx={mergeSx(btnSx, {
        backgroundColor: disabled ? "silver" : providers[provider].color,
      })}
    >
      <Logo />
    </Box>
  );
};
