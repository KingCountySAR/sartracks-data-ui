import React, { Dispatch } from 'react'
import { withRouter, match } from 'react-router-dom'
import { Typography, LinearProgress, Grid } from '../../components/material'
import GridPaper from '../../components/grid-paper'
import PageContainer from '../../components/page-container'

import { connect } from 'react-redux';
import { StoreState } from '../../store';
import { Actions as orgActions, OrganizationStatus } from '../../store/organizations'
import StatusList from './status-types/status-list'
import StatusDialog from './status-types/status-dialog'
import DeletePrompt from '../../components/delete-prompt'
import AuthRoute from '../../components/auth/AuthRoute'

interface UnitPageProps {
  organization: any
  loading: boolean
  loggedIn: boolean
}

interface UnitPageActions {
  load: (id:string) => void
  deleteStatus: (orgId: string, id: string) => void
  saveStatus: (orgId: string, row: OrganizationStatus) => void
}

type UnitDetailDialog = 'status-edit' | 'status-delete' | undefined

interface UnitDetailStatus {
  currentDialog: UnitDetailDialog
  editObj?: any
}

class UnitDetailPage extends React.Component<UnitPageProps & UnitPageActions & { match: match<{id :string, statusId: string}> }, UnitDetailStatus>
{
  constructor(props: any) {
    super(props)
    this.state = {
      currentDialog: undefined
    }
  }

  componentDidMount() {
    if (this.props.loggedIn) this.props.load(this.props.match.params.id)
  }

  componentDidUpdate(oldProps :UnitPageProps) {
    if (this.props.loggedIn && !oldProps.loggedIn) this.props.load(this.props.match.params.id)
  }

  render() {
    const { organization, loading, deleteStatus, saveStatus } = this.props
    const { currentDialog, editObj } = this.state

    return (<AuthRoute><PageContainer>
      <Grid container>
        <Grid item xs={12}>
      <GridPaper>
        <Typography variant='h6' component='h3'>{organization ? organization.name : 'Unit'} Reports</Typography>
        <LinearProgress style={{visibility: loading ? 'visible' : 'hidden'}} />
        <Typography>
          ID = { this.props.match.params.id }
        </Typography>
        {organization ? <Typography>{organization.name}</Typography> : null }
      </GridPaper>
      </Grid>
      </Grid>
        <Grid container>
          <Grid item lg={6} xs={12}>
            <StatusList
              list={organization && organization.statuses ? organization.statuses : undefined}
              onEdit={(row :OrganizationStatus) => { this.setState({currentDialog: 'status-edit', editObj: JSON.parse(JSON.stringify(row)) })}}
              onCreate={() => this.setState({currentDialog: 'status-edit', editObj: {wacLevel: 'Field'}})}
              onDelete={(row :OrganizationStatus) => { this.setState({currentDialog: 'status-delete', editObj: row })}} />
            <StatusDialog
              open={currentDialog === 'status-edit'}
              onClose={(formData?: any) => { formData && saveStatus(organization.id, formData); this.setState({currentDialog: undefined, editObj: undefined })}}
              status={editObj} />
            <DeletePrompt
              open={currentDialog === 'status-delete'}
              onClose={(confirm) => { confirm && deleteStatus(organization.id, editObj.id); this.setState({currentDialog: undefined, editObj: undefined }) }}
              type='Unit Status'
              name={organization && editObj && `${organization.name} ${editObj.name}`} />
          </Grid>
        </Grid>
  </PageContainer></AuthRoute>)
  }
}

const storeToProps = (store :StoreState) :UnitPageProps => ({
  organization: store.organizations.current,
  loading: !!store.organizations.currentLoading,
  loggedIn: !!store.oidc.user
})

const dispatchToProps = (dispatch :Dispatch<any>) :UnitPageActions => ({
  load: (id :string) => dispatch(orgActions.loadDetail(id)),
  deleteStatus: (orgId: string, id: string) => dispatch(orgActions.deleteStatus(orgId, id)),
  saveStatus: (orgId: string, row: OrganizationStatus) => dispatch(orgActions.saveStatus(orgId, row))
})

export default withRouter(connect(storeToProps, dispatchToProps)(UnitDetailPage))