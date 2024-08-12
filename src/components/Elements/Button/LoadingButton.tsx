import Button, { ButtonProps } from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

type LoadingButtonProps = ButtonProps & {
  isLoading?: boolean;
  children: React.ReactNode;
};

export const LoadingButton = ({
  isLoading,
  children,
  startIcon,
  endIcon,
  ...props
}: LoadingButtonProps) => {
  return (
    <Button
      disabled={isLoading}
      {...props}
      startIcon={
        startIcon && isLoading ? (
          <CircularProgress size={16} color="inherit" />
        ) : (
          startIcon
        )
      }
      endIcon={
        endIcon && isLoading ? (
          <CircularProgress size={16} color="inherit" />
        ) : (
          endIcon
        )
      }
    >
      {!startIcon && !endIcon && isLoading ? (
        <CircularProgress size={24} color="inherit" />
      ) : (
        children
      )}
    </Button>
  );
};
