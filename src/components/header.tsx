import { AppBar, Toolbar, Typography } from "@mui/material";

const Header = () => {
  return (
    <AppBar
      position="fixed"
      sx={{
        marginLeft: 240,
        width: `calc(100% - 240px)`,
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Hospital Dashboard
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
