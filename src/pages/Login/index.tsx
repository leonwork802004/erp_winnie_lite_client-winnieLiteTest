import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { Navigate, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { LoadingButton } from "@components/Elements";
import { useAuthStore } from "@store/auth";
import {
  useLoginMutation,
  FetchLoginPayload,
  fetchLoginPayload,
  LoginType,
} from "./api";

const loginOptions = [
  { value: LoginType.Winnie, label: "維尼帳號" },
  { value: LoginType.Login, label: "一般帳號" },
  { value: LoginType.Ad, label: "AD登入" },
];

const Login = () => {
  const navigate = useNavigate();
  const { auth, setAuth } = useAuthStore((state) => state);
  const { mutate, isPending } = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FetchLoginPayload>({ resolver: zodResolver(fetchLoginPayload) });

  const onSubmit: SubmitHandler<FetchLoginPayload> = (data) => {
    if (!data.acc.trim()) {
      toast.error("帳號或密碼不可為空");
      return;
    }
    mutate(data, {
      onSuccess: (data) => {
        localStorage["AccessTokenExpires"] = data.AccessTokenExpires;
        localStorage["RefreshTokenExpires"] = data.RefreshTokenExpires;
        setAuth(true);
        navigate("/", { replace: true });
      },
      onError: (error: any) => {
        const message =
          error?.response?.data?.Msg || `登入失敗 ${error?.message}`;
        toast.error(message);
      },
    });
  };

  if (auth) {
    return <Navigate to={"/"} />;
  }

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{ display: "flex", alignItems: "center", height: "100%" }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ px: 4, py: 8, boxShadow: 4, borderRadius: 2 }}
      >
        <Typography variant="h4" textAlign={"center"}>
          Sign In
        </Typography>
        <TextField
          select
          fullWidth
          label="登入方式"
          defaultValue={LoginType.Winnie}
          {...register("option", { required: true })}
        >
          {loginOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          {...register("acc")}
          helperText={errors?.acc?.message}
          error={!!errors.acc}
          fullWidth
          label="帳號"
          variant="standard"
          type="text"
          sx={{
            "& *": {
              textTransform: "uppercase",
            },
          }}
          margin="normal"
        />
        <TextField
          {...register("pwd")}
          helperText={errors?.pwd?.message}
          error={!!errors.pwd}
          fullWidth
          label="密碼"
          variant="standard"
          type="password"
          margin="normal"
        />
        <LoadingButton
          isLoading={isPending}
          fullWidth
          variant="contained"
          type="submit"
          sx={{ mt: 3, mb: 2 }}
        >
          登入
        </LoadingButton>
      </Box>
    </Container>
  );
};

export default Login;
