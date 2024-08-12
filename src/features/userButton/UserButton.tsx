import { ButtonProps } from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { LoadingButton } from "@components/Elements";
import { useFetchUserPage } from ".";

type Props = ButtonProps & {
  featureName: string;
  isLoading?: boolean;
  isIconButton?: boolean;
  children?: React.ReactNode;
};

export const UserButton = ({
  children,
  isLoading,
  isIconButton,
  featureName,
  ...props
}: Props) => {
  const { data } = useFetchUserPage(featureName.split("_")[0]);

  if (!data?.featureNames.includes(featureName)) {
    return;
  }

  if (isIconButton) {
    return <IconButton {...props}>{children}</IconButton>;
  }

  return (
    <LoadingButton isLoading={isLoading} {...props}>
      {children}
    </LoadingButton>
  );
};
