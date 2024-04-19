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
    <Box
      sx={{
        width: "70px",
        minWidth: "70px",
        display: { xs: "none", md: "block" },
      }}
    />
  ) : (
    <Badge
      overlap="circular"
      anchorOrigin={{ vertical: "bottom", horizontal: isMy ? "left" : "right" }}
      badgeContent={
        author.provider && (
          <Avatar
            sx={{
              width: "20px",
              height: "20px",
              backgroundColor: providers[author.provider].color,
              "& svg": {
                maxWidth: "80%",
                maxHeight: "80%",
              },
            }}
          >
            {Logo && <Logo />}
          </Avatar>
        )
      }
    >
      <Avatar
        sx={mergeSx(
          {
            width: { xs: "30px", md: "50px" },
            height: { xs: "30px", md: "50px" },
            mb: { xs: "5px", md: "unset" },
          },
          isMy && { float: "right" },
        )}
        src={author.avatar}
      />
    </Badge>
  );
  const time = at && moment(at).format("HH:mm");
  const info = isSameAuthor ? null : (
    <Box
      sx={{
        position: "absolute",
        left: { xs: "auto", md: "-20px" },
        top: "10px",
        display: "inline-block",
        color: "rgba(0, 0, 0, 0.4)",
        fontSize: "13px",
        textAlign: { xs: "left", md: "right" },
      }}
    >
      <Box
        sx={{
          position: { xs: "relative", md: "absolute" },
          right: { xs: "auto", md: 0 },
          left: { xs: "37px", md: "unset" },
          display: "flex",
          flexFlow: { xs: "row nowrap", md: "column nowrap" },
        }}
      >
        <Box
          sx={{
            maxWidth: "140px",
            fontWeight: 700,
            textOverflow: "ellipsis",
            overflow: { xs: "visible", md: "hidden" },
            whiteSpace: "nowrap",
          }}
        >
          {author.name}
        </Box>
        {time && (
          <Box sx={{ whiteSpace: "nowrap", ml: { xs: "10px", md: "unset" } }}>
            {time}
          </Box>
        )}
      </Box>
    </Box>
  );
  const corner = isSameAuthor ? null : (
    <Box
      sx={mergeSx(
        {
          zIndex: 1,
          position: { xs: "absolute", md: "relative" },
          top: { xs: "35px", md: "25px" },
          right: { xs: "auto", md: "-10px" },
          left: { xs: "24px", md: "unset" },
          display: "block",
          overflow: "hidden",
          width: { xs: "10px", md: "20px" },
          height: { xs: "10px", md: "20px" },
          backgroundColor: "white",
          transform: "perspective(71px) rotate(45deg)",
          transformOrigin: "100% 50% 0px",
        },
        isMy && {
          backgroundColor: "#6bba6b",
          left: { xs: "auto", md: "unset" },
          right: { xs: "24px", md: "15px" },
        },
      )}
    ></Box>
  );
  const msg = (
    <Box
      sx={mergeSx(
        {
          zIndex: 2,
          display: "inline-block",
          maxWidth: { xs: "90vw", md: "60vw", lg: "30vw" },
          minWidth: "40px",
          padding: { xs: "5px 10px", md: "10px", lg: "10px 15px" },
          borderRadius: "5px",
          color: "#666",
          fontSize: "18px",
          lineHeight: "23px",
          backgroundColor: "white",
          textAlign: "left",
          alignSelf: { xs: "flex-start", md: "flex-end" },
          boxSizing: "border-box",
          wordWrap: "break-word",
          "& a": {
            color: "#666",
          },
        },
        isMy && {
          backgroundColor: "#6bba6b",
          color: "white",
          textAlign: "right",
          alignSelf: "flex-end",
          "& a": {
            color: "white",
          },
        },
        isSystem && {
          maxWidth: "100%",
          width: "100%",
          padding: "10px",
          color: "rgba(0, 0, 0, 0.3)",
          fontSize: "14px",
          fontWeight: 700,
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
      <ListItem
        sx={mergeSx(
          {
            display: "flex",
            flexFlow: { xs: "column nowrap", md: "row nowrap" },
            justifyContent: "flex-start",
            position: "relative",
            "&:not(:first-of-type)": {
              marginTop: "5px",
            },
          },
          isMy && {
            flexFlow: { xs: "column nowrap", md: "row-reverse nowrap" },
            alignItems: { xs: "flex-end", md: "unset" },
          },
        )}
      >
        {info}
        {!isSystem && avatar}
        {!isSystem && corner}
        {msg}
      </ListItem>
      <Embedly urls={urls} isMy={isMy} />
    </>
  );
};
