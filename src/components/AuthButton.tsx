import Box from "@mui/material/Box";
import { mergeSx } from "merge-sx";
import { Provider, providers } from "../Provider.tsx";

export const AuthButton = ({
  disabled,
  url,
  provider,
}: {
  disabled?: boolean;
  url: string;
  provider: Provider;
}) => (
  <Box
    onClick={
      disabled
        ? undefined
        : () => window.location.replace(`http://localhost:8090${url}`)
    }
    sx={mergeSx(
      {
        flex: "1 0 33%",
        height: "100%",
        backgroundPosition: "50% 50%",
        backgroundRepeat: "no-repeat",
        backgroundSize: "auto 50%",
        cursor: "pointer",
        maxWidth: { xs: "100%", md: "200px" },
      },
      {
        backgroundColor: providers[provider].color,
        backgroundImage: `url(${providers[provider].logo})`,
      },
      disabled && { backgroundColor: "silver" },
    )}
  />
);
