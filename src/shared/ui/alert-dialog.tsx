import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

interface AlertDialogProps {
  title: string;
  text?: string;
  open: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  onCancel?: () => void;
  className?: string;
}
export const AlertDialog: React.FC<AlertDialogProps> = ({
  title,
  text,
  open,
  onClose,
  onConfirm,
  onCancel,
  className,
}) => {
  const handleClose = () => {
    onCancel?.();
    onClose();
  };
  const handleConfirm = () => {
    onConfirm?.();
    onClose();
  };
  return (
    <Dialog
      className={className}
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {text}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleConfirm}
          autoFocus
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};
