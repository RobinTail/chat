import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import { mergeSx } from "merge-sx";
import React from "react";

import { embedlyKey } from "../apiKeys.ts";

interface EmbedObj {
  type: "photo" | "video" | "link" | "rich" | "error";
  version: string;
  title?: string;
  author_name?: string;
  author_url?: string;
  provider_name?: string;
  provider_url?: string;
  thumbnail_url?: string;
  thumbnail_width?: number;
  thumbnail_height?: number;
  description?: string;
  url?: string; // photo
  width?: number; // photo, video, rich
  height?: number;
  html?: string; // video, rich
}

export const Embedly = ({ urls, isMy }: { urls: string[]; isMy?: boolean }) => {
  const [objects, setObjects] = React.useState<EmbedObj[]>([]);

  React.useEffect(() => {
    if (!urls.length) {
      return;
    }
    (async () => {
      const response = await fetch(
        `http://api.embed.ly/1/oembed?key=${embedlyKey}&format=json&maxwidth=400&urls=${urls.slice(0, 10).map(encodeURIComponent).join(",")}`,
      );
      if (!response.ok) {
        return;
      }
      const json = (await response.json()) as EmbedObj[];
      setObjects(json.filter((entry) => entry.type !== "error"));
    })();
  }, [urls]);

  if (!objects.length) {
    return null;
  }

  return (
    <ListItem
      sx={{
        display: "flex",
        flexFlow: isMy ? "row-reverse nowrap" : "row nowrap",
        justifyContent: "flex-start",
        margin: "5px 0",
      }}
    >
      <Box
        sx={{
          width: "70px",
          minWidth: "70px",
          display: { xs: "none", md: "block" },
        }}
      />
      <Box
        sx={{
          display: "flex",
          flexFlow: "row wrap",
          justifyContent: isMy ? "flex-end" : "flex-start",
        }}
      >
        {objects.map(
          (
            {
              url,
              thumbnail_url,
              title,
              description,
              width,
              height,
              thumbnail_width,
              thumbnail_height,
            },
            index,
          ) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                flexFlow: isMy ? "row-reverse nowrap" : "row nowrap",
                maxWidth: "30vw",
                fontSize: "16px",
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  width: "200px",
                  minWidth: "200px",
                  height: "200px",
                  overflow: "hidden",
                }}
              >
                <Link href={url}>
                  <Box
                    component="img"
                    sx={mergeSx(
                      {
                        position: "absolute",
                        left: "50%",
                        top: "50%",
                        height: "100%",
                        width: "auto",
                        transform: "translate(-50%, -50%)",
                      },
                      (width && height && width < height) ||
                        (thumbnail_width &&
                          thumbnail_height &&
                          thumbnail_width < thumbnail_height)
                        ? {
                            width: "100%",
                            height: "auto",
                          }
                        : undefined,
                    )}
                    src={thumbnail_url || url}
                  />
                </Link>
              </Box>
              <Box
                sx={{ padding: "5px 10px", textAlign: isMy ? "right" : "left" }}
              >
                <Box>
                  <strong>
                    <Link href={url}>{title}</Link>
                  </strong>
                </Box>
                <Box>{description}</Box>
              </Box>
            </Box>
          ),
        )}
      </Box>
    </ListItem>
  );
};
