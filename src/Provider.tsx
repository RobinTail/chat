import fbLogo from "./assets/fb.svg";
import ggLogo from "./assets/gg.svg";
import twLogo from "./assets/tw.svg";

export const providers = {
  facebook: {
    color: "#3b5998",
    logo: fbLogo,
  },
  twitter: {
    color: "#00aced",
    logo: twLogo,
  },
  google: {
    color: "#dd4b39",
    logo: ggLogo,
  },
} satisfies Record<string, Record<"color" | "logo", string>>;

export type Provider = keyof typeof providers;
