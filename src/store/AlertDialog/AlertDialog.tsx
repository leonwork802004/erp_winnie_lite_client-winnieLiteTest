import { Dialog } from "@components/Elements";
import { useAlertDialogStore } from ".";

export const AlertDialog = () => {
  const { title, message, action, showDialog } = useAlertDialogStore();

  const handleCancel = () =>
    showDialog({ title: "", message: "", action: undefined });

  const handleConfirm = () => {
    action && action();
    handleCancel();
  };

  return (
    <Dialog
      isOpen={!!title || !!message}
      title={title}
      size="xs"
      onCancel={handleCancel}
      onConfirm={handleConfirm}
    >
      {message}
    </Dialog>
  );
};
