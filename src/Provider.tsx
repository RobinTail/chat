import fbLogo from "./assets/fb.svg";
import ggLogo from "./assets/gg.svg";
import twLogo from "./assets/tw.svg";

export const providers = {
  fb: {
    color: "#3b5998",
    logo: fbLogo,
  },
  tw: {
    color: "#00aced",
    logo: twLogo,
  },
  gg: {
    color: "#dd4b39",
    logo: ggLogo,
  },
} satisfies Record<string, Record<"color" | "logo", string>>;

export type Provider = keyof typeof providers;
