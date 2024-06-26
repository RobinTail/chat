import type { SxProps } from "@mui/material";

const wrapperXS = 100; // vw
export const wrapperXSPadding = 10; // px
const wrapperSM = 95; // vw
const wrapperMD = 60; // vw

export const wrapperSx: SxProps = {
  mx: "auto",
  width: {
    xs: `${wrapperXS}vw`,
    sm: `${wrapperSM}vw`,
    md: `${wrapperMD}vw`,
  },
  px: { xs: `${wrapperXSPadding}px`, sm: "unset" },
};
