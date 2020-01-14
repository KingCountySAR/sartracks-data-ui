import React, { Dispatch, ComponentType } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { TextField, LinearProgress, List, ListItem, ListItemText, ListItemAvatar, Avatar } from './material'
import { StoreState } from '../store'
import { Actions as searchActions } from '../store/search'
import { initialState as config } from '../store/config'

import './search-drawer.scss'
import { PhotoLoader } from './photo-loader'

import nophoto from '../assets/no-photo.jpg'

interface SearchDrawerProps {
  query: string
  isLoading?: boolean
  results?: any[]
  typeQuery: (query :string) => void
}

const MemberResult :React.FC<{id: string, name: string, photo: string, workerNumber?:string }> = ({id, name, photo, workerNumber}) => 
  <ListItem button component={Link} to={'/members/' + id}>
    <ListItemAvatar>
      <PhotoLoader url={`${config.apis.oldData}/members/${id}/photo`} render={
        (fetching, data) => <Avatar alt={name} src={fetching || !data ? nophoto : data} />
      } />
    </ListItemAvatar>
    <ListItemText primary={name} secondary={workerNumber ? `DEM# ${workerNumber}` : null} />
  </ListItem>

const MissionResult :React.FC<{id: string, name: string, stateNumber: string}> = ({id, name, stateNumber}) =>
  <ListItem button component='a' href={'/missions/roster/' + id}>
    <ListItemAvatar>
      <Avatar alt="Mission" />
    </ListItemAvatar>
    <ListItemText primary={name} secondary={stateNumber} />
  </ListItem>

const searchResultComponents :{[type: string] :ComponentType<any> } = {
  Member: MemberResult,
  Mission: MissionResult
}

class SearchDrawer extends React.Component<SearchDrawerProps> {
  render() {
    const { query, isLoading, results, typeQuery } = this.props

    return <div className='search-drawer'>
      <TextField
          value={query}
          onChange={evt => typeQuery(evt.target.value)}
          placeholder="Search"
          fullWidth
          autoFocus />
      <LinearProgress variant={isLoading ? 'indeterminate' : 'determinate'} value={isLoading ? undefined : 100} />
      <List className='search-results'>
        {results ? results.map(r => { const Component = searchResultComponents[r.type]; return <Component key={r.summary.id} {...r.summary} /> }) : null}
      </List>
    </div>
  }
}

const storeToProps = (store :StoreState) => ({
  query: store.search.query,
  isLoading: store.search.listLoading,
  results: store.search.list
  // user: store.oidc.user,
  // isLoadingUser: store.oidc.isLoadingUser,
  // inDrawer: store.ui.inDrawer,
  // inSearch: store.search.open
})

const dispatchToProps = (dispatch :Dispatch<any>) => ({
  typeQuery: (query: string) => dispatch(searchActions.typing(query))
  // doSignin: () => dispatch(oidcActions.doSignin()),
  // doSignout: () => dispatch(oidcActions.doSignout()),
  // showDrawer: (show: boolean) => dispatch(uiActions.showDrawer(show)),
  // showSearch: (show: boolean) => dispatch(searchActions.show(show))
})

export default connect(storeToProps, dispatchToProps)(SearchDrawer)