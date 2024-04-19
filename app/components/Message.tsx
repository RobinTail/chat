import type { SxProps } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import { find as linkifyFind } from "linkifyjs";
import { mergeSx } from "merge-sx";
import moment from "moment";
import React from "react";
import { UserContext } from "../contexts/UserContext.ts";
import { Provider, providers } from "../Provider.tsx";
import Linkify from "linkify-react";
import { Embedly } from "./Embedly.tsx";

export interface MessageProps {
  isSameAuthor?: boolean;
  isSystem?: boolean;
  severity?: "warning" | "critical";
  author: {
    oauthID?: string;
    avatar?: string;
    provider?: Provider;
    name: string;
  };
  at?: Date;
  text: string;
}

const placeholderSx: SxProps = {
  width: "70px",
  minWidth: "70px",
  display: { xs: "none", md: "block" },
};

const badgeSx: SxProps = {
  width: "20px",
  height: "20px",
  display: { xs: "none", sm: "flex" },
  "& svg": {
    maxWidth: "80%",
    maxHeight: "80%",
  },
};

const avatarSx: SxProps = {
  zIndex: { xs: 3, sm: "unset" },
  width: { xs: "30px", md: "50px" },
  height: { xs: "30px", md: "50px" },
  mb: { xs: "-5px", sm: "5px", md: "unset" },
};

const infoLocatorSx: SxProps = {
  position: "absolute",
  top: "10px",
  display: "inline-block",
  color: "rgba(0, 0, 0, 0.4)",
  fontSize: "13px",
};

const infoLayoutSx: SxProps = {
  position: { xs: "relative", md: "absolute" },
  display: "flex",
  gap: { xs: "10px", md: "unset" },
};

const nameSx: SxProps = {
  maxWidth: "140px",
  fontWeight: 700,
  textOverflow: "ellipsis",
  overflow: { xs: "visible", md: "hidden" },
  whiteSpace: "nowrap",
};

const timeSx: SxProps = { whiteSpace: "nowrap" };

const cornerSx: SxProps = {
  zIndex: 1,
  display: { xs: "none", sm: "block" },
  position: { sm: "absolute", md: "relative" },
  top: { sm: "38px", md: "25px" },
  right: { sm: "auto", md: "-10px" },
  left: { sm: "24px", md: "unset" },
  overflow: "hidden",
  width: { sm: "10px", md: "20px" },
  height: { sm: "10px", md: "20px" },
  backgroundColor: "white",
  transform: "perspective(71px) rotate(45deg)",
  transformOrigin: "100% 50% 0px",
};

const myCornerSx: SxProps = {
  backgroundColor: "#6bba6b",
  left: { xs: "auto", md: "unset" },
  right: { xs: "24px", md: "15px" },
};

const messageSx: SxProps = {
  zIndex: 2,
  display: "inline-block",
  maxWidth: { xs: "90vw", sm: "60vw", md: "30vw" },
  minWidth: "40px",
  padding: { xs: "5px 10px", md: "10px", lg: "10px 15px" },
  borderRadius: "5px",
  color: "#666",
  fontSize: "18px",
  lineHeight: "23px",
  backgroundColor: "white",
  textAlign: "left",
  wordWrap: "break-word",
  "& a": {
    color: "#666",
  },
};

const myMessageSx: SxProps = {
  backgroundColor: "#6bba6b",
  color: "white",
  textAlign: "right",
  alignSelf: "flex-end",
  "& a": {
    color: "white",
  },
};

const systemMsgSx: SxProps = {
  maxWidth: "100% !important",
  width: "100%",
  padding: "10px",
  color: "rgba(0, 0, 0, 0.3)",
  fontSize: "14px",
  fontWeight: 700,
};

const itemSx: SxProps = {
  display: "flex",
  flexFlow: { xs: "column nowrap", md: "row nowrap" },
  justifyContent: "flex-start",
  alignItems: { xs: "flex-start", md: "unset" },
  position: "relative",
  px: 0,
  py: 0.5,
};

const myItemSx: SxProps = {
  flexFlow: { xs: "column nowrap", md: "row-reverse nowrap" },
  alignItems: { xs: "flex-end", md: "unset" },
};

export const Message = ({
  isSameAuthor,
  author,
  at,
  text,
  isSystem,
  severity,
}: MessageProps) => {
  const { oauthID } = React.useContext(UserContext);
  const isMy = React.useMemo(
    () => author.oauthID === oauthID,
    [author.oauthID, oauthID],
  );
  const urls = React.useMemo(
    () =>
      linkifyFind(text)
        .filter(({ type }) => type === "url")
        .map(({ href }) => href),
    [text],
  );

  const Logo = author.provider ? providers[author.provider].Logo : undefined;
  const avatar = isSameAuthor ? (
    <Box sx={placeholderSx} />
  ) : (
    <Badge
      overlap="circular"
      anchorOrigin={{ vertical: "top", horizontal: isMy ? "right" : "left" }}
      badgeContent={
        author.provider && (
          <Avatar
            sx={mergeSx(badgeSx, {
              backgroundColor: providers[author.provider].color,
            })}
          >
            {Logo && <Logo />}
          </Avatar>
        )
      }
    >
      <Avatar sx={avatarSx} src={author.avatar} />
    </Badge>
  );
  const time = at && moment(at).format("HH:mm");
  const info = isSameAuthor ? null : (
    <Box sx={infoLocatorSx}>
      <Box
        sx={mergeSx(infoLayoutSx, {
          right: { xs: isMy ? "37px" : "auto", md: isMy ? "auto" : "20px" },
          left: { xs: isMy ? "auto" : "37px", md: isMy ? "20px" : "auto" },
          flexFlow: {
            xs: isMy ? "row-reverse" : "row nowrap",
            md: "column nowrap",
          },
          alignItems: { md: isMy ? "flex-start" : "flex-end" },
        })}
      >
        <Box sx={nameSx}>{author.name}</Box>
        {time && <Box sx={timeSx}>{time}</Box>}
      </Box>
    </Box>
  );
  const corner = isSameAuthor ? null : (
    <Box sx={mergeSx(cornerSx, isMy && myCornerSx)}></Box>
  );
  const msg = (
    <Box
      sx={mergeSx(
        messageSx,
        isMy && myMessageSx,
        isSystem && systemMsgSx,
        isSystem && {
          backgroundColor:
            severity === "warning"
              ? "rgba(255, 184, 0, 0.13)"
              : severity === "critical"
                ? "rgba(255, 0, 0, 0.1)"
                : "rgba(0, 0, 0, 0.03)",
        },
      )}
    >
      <Linkify options={{ truncate: 50 }}>{text}</Linkify>
    </Box>
  );

  return (
    <>
      <ListItem sx={mergeSx(itemSx, isMy && myItemSx)}>
        {!isSystem && info}
        {!isSystem && avatar}
        {!isSystem && corner}
        {msg}
      </ListItem>
      <Embedly urls={urls} isMy={isMy} />
    </>
  );
};
