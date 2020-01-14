import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { AppBar, Toolbar, Button, Typography, Link, IconButton, Popover, useMediaQuery, useTheme, Card, CardActions, CardContent, CircularProgress } from './material'
import AccountCircle from '@material-ui/icons/AccountCircleOutlined'
import SearchIcon from '@material-ui/icons/Search'
import MenuIcon from '@material-ui/icons/Menu'
import { User } from 'oidc-client';
import MemberPhoto from './member-photo';

import './header.css';

const HeaderAccount :React.FC<{ user?: User, doSignin: () => void, doSignout: () => void }> = ({ user, doSignin, doSignout }) =>{
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'header-account-popover' : undefined;

  return (<React.Fragment>
    <IconButton edge="end" aria-describedby={id} onClick={handleClick} color="inherit"><AccountCircle /></IconButton>
    <Popover id={id} open={open} anchorEl={anchorEl} onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right'}} transformOrigin={{vertical: 'top', horizontal: 'right'}}>
      { user
      ? <Card>
          <CardContent style={{display:'flex'}}>
            <MemberPhoto memberId={user.profile.memberId} />
            <div style={{display:'flex', flexDirection:'column', marginRight:'2em'}}>
              <Typography variant='body1'>{user.profile.name}</Typography>
              <Typography color='textSecondary' style={{marginBottom:'.5em'}}>{user.profile.preferred_username}</Typography>
              <Typography variant='body2'>{user.profile.email}</Typography>
            </div>
          </CardContent>
          <CardActions>
            <Button onClick={doSignout} size="small" color='secondary'>Sign out</Button>
          </CardActions>
        </Card>
      : <Card>
          <CardContent>
            <Typography>You are not signed in</Typography>
          </CardContent>
          <CardActions>
            <Button onClick={doSignin} size="small" color='secondary'>Sign In</Button>
          </CardActions>
        </Card>
      }
    </Popover>
  </React.Fragment>)
}

const Header :React.FC<{ user?: User, isLoadingUser? :boolean, hasDrawer :boolean,
  showDrawer: (show: boolean) => void, showSearch: (show: boolean) => void, doSignin:() => void, doSignout: () => void}> =
 ({ user, isLoadingUser, hasDrawer, showDrawer, showSearch, doSignin, doSignout }) => {
  const theme = useTheme()
  const isMd = useMediaQuery(theme.breakpoints.up('sm')) 
  return (
  <AppBar position="static"> {/*  color='dark' dark expand="md" */}
    <Toolbar>
    { !hasDrawer ? null : <IconButton edge='start' color='inherit' onClick={() => showDrawer(true)}><MenuIcon /></IconButton> }
    <Typography variant="h6" noWrap><Link to='/' className='navbar-brand' component={RouterLink} color='inherit'>
      King County {isMd ? <span>Search and Rescue</span> : <span>SAR</span>}
    </Link></Typography>
    {isLoadingUser
      ? <CircularProgress color='inherit' size='1.5em'/>
      : <React.Fragment>
        { user ? <IconButton color='inherit' onClick={() => showSearch(true)}><SearchIcon /></IconButton> : null }
        <HeaderAccount user={user} doSignin={doSignin} doSignout={doSignout} />
      </React.Fragment>}
    </Toolbar>
  </AppBar>
)}

export default Header