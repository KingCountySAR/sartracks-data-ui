import React, { Dispatch } from 'react'
import { Link } from 'react-router-dom'
import Edit from '@material-ui/icons/Edit'
import Delete from '@material-ui/icons/Delete'
import { List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Typography, LinearProgress } from '../../components/material'
import PageContainer from '../../components/page-container'

import { connect } from 'react-redux';
import { StoreState } from '../../store';
import { Actions as orgActions } from '../../store/organizations';
import GridPaper from '../../components/grid-paper'


interface UnitPageProps {
  organizations: any
  loggedIn: boolean
}

interface UnitPageActions {
  load: () => void
}

class UnitsPage extends React.Component<UnitPageProps & UnitPageActions>
{
  componentDidMount() {
    if (this.props.loggedIn) this.props.load()
  }

  componentDidUpdate(oldProps :UnitPageProps) {
    if (!oldProps.loggedIn && this.props.loggedIn) this.props.load()
  }

  render() {
    const { organizations, loggedIn } = this.props
    const { list, listLoading } = organizations || {}

    return (<PageContainer>
      {loggedIn ?
      <GridPaper>
        <Typography variant='h5' component='h3'>Unit List</Typography>
        <LinearProgress style={{visibility: listLoading?'visible':'hidden'}} />
        <List>
          {list && list.map((o :any) => <ListItem key={o.id} button component={Link} to={'/units/' + o.id}>
            <ListItemText primary={o.name} secondary={o.fullName} />
            <ListItemSecondaryAction>
              { o._u ? <IconButton edge='end' aria-label='roster'><Edit color='secondary'/></IconButton> : null }
              { o._d ? <IconButton edge='end' aria-label='delete' ><Delete color='error'/></IconButton> : null }
            </ListItemSecondaryAction>
          </ListItem>)}
        </List>
      </GridPaper>
      : <GridPaper>Loading</GridPaper> }
  </PageContainer>)
  }
}

const storeToProps = (store :StoreState) :UnitPageProps => ({
  organizations: store.organizations,
  loggedIn: !!store.oidc.user
    // user: store.oidc.user,
    // isLoadingUser: store.oidc.isLoadingUser,
    // inDrawer: store.ui.inDrawer
})

const dispatchToProps = (dispatch :Dispatch<any>) :UnitPageActions => ({
  load: () => dispatch(orgActions.loadList())
})

export default connect(storeToProps, dispatchToProps)(UnitsPage)