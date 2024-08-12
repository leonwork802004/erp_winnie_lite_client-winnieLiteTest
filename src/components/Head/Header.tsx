import { useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useDisclosure } from "@hooks/useDisclosure";
import { useAuthStore } from "@store/auth";
import { Menu } from ".";

export const Header = () => {
  const navigate = useNavigate();
  const { auth } = useAuthStore();
  const { isOpen, open, close } = useDisclosure();

  return (
    <AppBar
      position="fixed"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar variant="dense">
        {auth && (
          <>
            <IconButton
              onClick={open}
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Menu isOpen={isOpen} close={close} />
          </>
        )}
        <Typography
          variant="h6"
          noWrap
          component="div"
          onClick={() => navigate("/")}
          sx={{ cursor: "pointer" }}
        >
          Winnie Lite
        </Typography>
      </Toolbar>
    </AppBar>
  );
};
