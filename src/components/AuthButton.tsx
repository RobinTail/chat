import { SxProps } from "@mui/material";
import Box from "@mui/material/Box";
import { mergeSx } from "merge-sx";
import fbLogo from "../assets/fb.svg";
import twLogo from "../assets/tw.svg";
import ggLogo from "../assets/gg.svg";

const styles = {
  fb: {
    backgroundColor: "#3b5998",
    backgroundImage: `url(${fbLogo})`,
  },
  tw: {
    backgroundColor: "#00aced",
    backgroundImage: `url(${twLogo})`,
  },
  gg: {
    backgroundColor: "#dd4b39",
    backgroundImage: `url(${ggLogo})`,
  },
} satisfies Record<string, SxProps>;

export const AuthButton = ({
  disabled,
  url,
  provider,
}: {
  disabled?: boolean;
  url: string;
  provider: keyof typeof styles;
}) => (
  <Box
    onClick={
      disabled
        ? undefined
        : () =>
            window.location.replace(
              `http://${window.location.host.split(":")[0]}:8090${url}`,
            )
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
      styles[provider],
      disabled && { backgroundColor: "silver" },
    )}
  />
);
