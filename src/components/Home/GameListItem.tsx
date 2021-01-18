import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import format from "date-fns/format";
import React, { ReactChild } from "react";

type GameListItem = {
  date?: Date;
  title: string;
  children?: ReactChild;
};

const GameListItem = (props: GameListItem): JSX.Element => {
  const { date, title, children } = props;
  const d = date ? `Created on ${format(date, "EEE MMM dd yyyy 'at' h:m aaaa")}` : "";

  return (
    <ListItem>
      <ListItemText primary={title} secondary={d} />
      {children}
    </ListItem>
  );
};

export default GameListItem;
