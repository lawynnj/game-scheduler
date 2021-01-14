import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import format from "date-fns/format";
import { useHistory } from "react-router-dom";

type GameListItem = {
  date?: Date;
  to: string;
  title: string;
};

const RenderItemLink = ({ date, to, title }: GameListItem) => {
  const history = useHistory();
  const d = date
    ? `Created on ${format(date, "EEE MMM dd yyyy 'at' h:m aaaa")}`
    : "";

  return (
    <ListItem button onClick={() => history.push(to)}>
      <ListItemText primary={title} secondary={d} />
    </ListItem>
  );
};

export default RenderItemLink;
