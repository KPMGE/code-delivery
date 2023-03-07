import { AppBar, IconButton, Toolbar, Typography } from "@material-ui/core"
import DriverIcon from '@material-ui/icons/DriveEta'

export const NavBar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton edge='start' color='inherit' aria-label='menu'>
          <DriverIcon />
        </IconButton>
      </Toolbar>
      <Typography variant="h6">Code Delivery</Typography>
    </AppBar>
  )
}
