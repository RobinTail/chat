import { SxProps } from "@mui/material/";

const wrapperXS = 100; // vw
export const wrapperXSPadding = 10; // px
const wrapperSM = 95; // vw
const wrapperMD = 90; // vw
const wrapperLG = 60; // vw

export const wrapperSx: SxProps = {
  mx: "auto",
  width: {
    xs: `${wrapperXS}vw`,
    sm: `${wrapperSM}vw`,
    md: `${wrapperMD}vw`,
    lg: `${wrapperLG}vw`,
  },
  px: { xs: `${wrapperXSPadding}px`, sm: "unset" },
};
