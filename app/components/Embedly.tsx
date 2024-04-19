import type { SxProps } from "@mui/material";
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

const itemSx: SxProps = {
  display: "flex",
  justifyContent: "flex-start",
  margin: "5px 0",
  px: 0,
  py: 0.5,
};

const placeholderSx: SxProps = {
  width: "70px",
  minWidth: "70px",
  display: { xs: "none", md: "block" },
};

const layoutSx: SxProps = {
  display: "flex",
  flexFlow: "row wrap",
};

const objectSx: SxProps = {
  display: "flex",
  maxWidth: "70vw",
  fontSize: "16px",
};

const frameSx: SxProps = {
  position: "relative",
  width: "200px",
  minWidth: "200px",
  height: "200px",
  overflow: "hidden",
};

const imageSx: SxProps = {
  position: "absolute",
  left: "50%",
  top: "50%",
  height: "100%",
  width: "auto",
  transform: "translate(-50%, -50%)",
};

const storySx: SxProps = {
  padding: "5px 10px",
};

export const Embedly = ({ urls, isMy }: { urls: string[]; isMy?: boolean }) => {
  const [objects, setObjects] = React.useState<EmbedObj[]>([]);

  React.useEffect(() => {
    if (!urls.length) {
      return;
    }
    (async () => {
      const response = await fetch(
        `https://api.embed.ly/1/oembed?key=${embedlyKey}&format=json&maxwidth=400&urls=${urls.slice(0, 10).map(encodeURIComponent).join(",")}`,
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
      sx={mergeSx(itemSx, {
        flexFlow: isMy ? "row-reverse nowrap" : "row nowrap",
      })}
    >
      <Box sx={placeholderSx} />
      <Box
        sx={mergeSx(layoutSx, {
          justifyContent: isMy ? "flex-end" : "flex-start",
        })}
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
              sx={mergeSx(objectSx, {
                flexFlow: isMy ? "row-reverse nowrap" : "row nowrap",
              })}
            >
              <Box sx={frameSx}>
                <Link href={url}>
                  <Box
                    component="img"
                    sx={mergeSx(
                      imageSx,
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
                sx={mergeSx(storySx, { textAlign: isMy ? "right" : "left" })}
              >
                <Box component="strong">
                  <Link href={url}>{title}</Link>
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
