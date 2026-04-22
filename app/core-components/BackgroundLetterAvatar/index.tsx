/** @jsxImportSource @emotion/react */

/**
 *
 * BackgroundLetterAvatar Component
 *
 */
import { Avatar, SxProps } from "@mui/material";

type DataProps = {
  /** Adds inline css property */
  style?: any;
};

type ActionProps = {};

type DefaultProps = {
  /** Overrides sx properties of mui components*/
  sx?: SxProps;
};

export type Props = ActionProps & DataProps & DefaultProps;

function stringToColor(string: string) {
  let hash = 0;
  let i;

  for (i = 0; i < string?.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }

  return color;
}

function stringAvatar(name: string) {
  let av = "U"; // UNKNOWN
  const splitName = name?.split(" ");
  if (splitName?.length >= 2) {
    av = `${name.split(" ")[0][0]}${name.split(" ")[1][0]} `;
  }
  if (splitName?.length === 1) {
    av = `${name.split(" ")[0][0]} `;
  }
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: av,
  };
}

export default function BackgroundLetterAvatars(props: any) {
  return (
    <Avatar
      {...stringAvatar(props.name)}
      {...{
        sx: {
          height: props.height,
          width: props.width,
          fontSize: "1rem",
        },
      }}
    />
  );
}
