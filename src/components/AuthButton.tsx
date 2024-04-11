import { SxProps } from "@mui/material";
import Button from "@mui/material/Button";
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
  <Button
    disabled={disabled}
    onClick={() => window.location.replace(url)}
    sx={[
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
    ]}
  />
);
