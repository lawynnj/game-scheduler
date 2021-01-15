import AddIcon from "@material-ui/icons/Add";
import Button from "@material-ui/core/Button";

interface AddButtonProps {
  disabled: boolean;
  onClick: () => void;
}

const AddButton = ({ disabled, onClick }: AddButtonProps) => (
  <Button
    style={{ marginLeft: 5 }}
    aria-label="add"
    color="primary"
    variant="contained"
    size="small"
    disabled={disabled}
    onClick={onClick}
  >
    <AddIcon fontSize="small" />
  </Button>
);

export default AddButton;
