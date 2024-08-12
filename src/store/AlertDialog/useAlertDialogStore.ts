import { create } from "zustand";

type DialogContent = {
  title: string;
  message: string;
  action?: () => void;
};

type UseAlertDialogStore = DialogContent & {
  showDialog: ({ title, message }: DialogContent) => void;
};

export const useAlertDialogStore = create<UseAlertDialogStore>((set) => ({
  title: "",
  message: "",
  showDialog: ({ title, message, action }: DialogContent) =>
    set({ title, message, action }),
}));
