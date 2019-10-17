import React from 'react'
import { Navbar, Nav, NavItem, UncontrolledPopover, Card, CardBody, CardTitle, CardSubtitle, CardText, Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
//import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { faUserCircle } from '@fortawesome/free-regular-svg-icons';
import { Link } from 'react-router-dom';
import { User } from 'oidc-client';
import MemberPhoto from './member-photo';

const HeaderAccount :React.FC<{ user?: User, doSignin: () => void, doSignout: () => void }> = ({ user, doSignin, doSignout }) => (
  <React.Fragment>
    <button id="headerAccountLink" className='nav-link'><FontAwesomeIcon icon={faUserCircle} /></button>
    {/* <button id="headerAccountLink" className='nav-link'>Sign {user && user.token_type ? 'out' : 'in'}</button> */}
    <UncontrolledPopover trigger="legacy" placement="bottom" target="headerAccountLink" hideArrow>
      <Card>
        { user ? <React.Fragment>
        {/* <CardImg top src="/assets/318x180.svg" alt="Card image cap" /> */}
        <CardBody className='d-flex flex-column'>
          <div className='d-flex'>
            <MemberPhoto memberid={user.profile.memberId} />
            <div className='d-flex flex-column' style={{marginRight:'2em'}}>
              <CardTitle>{user.profile.name}</CardTitle>
              <CardSubtitle>{user.profile.preferred_username}</CardSubtitle>
              <CardText>{user.profile.email}</CardText>
            </div>
          </div>
          <Button color="primary" className='center-block' size='sm' onClick={doSignout}>Sign out</Button>
        </CardBody>
        </React.Fragment>
        : <CardBody className='d-flex flex-column'><CardText>You are not signed in</CardText><Button color='primary' className='center-block' size='sm' onClick={doSignin}>Sign in</Button></CardBody>
        }
      </Card>
    </UncontrolledPopover>
  </React.Fragment>
)

const Header :React.FC<{ user?: User, isLoadingUser? :boolean, doSignin:() => void, doSignout: () => void}> = ({ user, isLoadingUser, doSignin, doSignout }) => (
  <Navbar color='dark' dark expand="md">
    <Link to='/' className='navbar-brand'>King County <span className='d-none d-sm-inline'>Search and Rescue</span><span className='d-sm-none'>SAR</span></Link>
    <Nav className='ml-auto no-collapse' navbar>
      {isLoadingUser 
        ? <NavItem><button className='nav-link'><FontAwesomeIcon icon={faSpinner} spin /></button></NavItem> 
        : <React.Fragment>
          {/* {user ? <NavItem><button className='nav-link'><FontAwesomeIcon icon={faSearch} /></button></NavItem> : null} */}
          <NavItem><HeaderAccount user={user} doSignin={doSignin} doSignout={doSignout} /></NavItem>
        </React.Fragment>}
    </Nav>
  </Navbar>
)

export default Header