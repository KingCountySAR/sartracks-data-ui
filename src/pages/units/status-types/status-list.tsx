import React from 'react'
import { Edit, Delete, AddCircle } from '@material-ui/icons'
import GridPaper from '../../../components/grid-paper'
import tableIcons from '../../../components/table-icons'
import MaterialTable, { Action, Column, MTableToolbar, MTableBodyRow } from 'material-table'

import { OrganizationStatus } from '../../../store/organizations'
import classNames from 'classnames'

class StatusList extends React.Component<{
  list: any,
  onEdit?: (row: OrganizationStatus) => void,
  onDelete?: (row: OrganizationStatus) => void,
  onCreate?: () => void
}>
{
  render() {
    const { list, onEdit, onDelete, onCreate } = this.props

    let statusColumns :Column<OrganizationStatus>[] = [
      {title: 'Status Name', field: 'name', render: (rowData :any) => <b>{rowData.name}</b> },
      {title: 'Is Active?', field: 'isActive', type: 'boolean' },
      {title: 'WAC Level', field: 'wacLevel' }
    ]

    let statusActions :(Action<OrganizationStatus> | ((data: OrganizationStatus) => Action<OrganizationStatus>))[] = [
      (rowData :OrganizationStatus) => { return ({ icon: () => <Edit color='secondary' />, onClick: (_evt, row) => onEdit && onEdit(row as OrganizationStatus), hidden: !rowData._u || rowData._deleting || rowData._saving}) },
      (rowData :OrganizationStatus) => { return ({ icon: () => <Delete color='error' />, onClick: (_evt, row) => onDelete && onDelete(row as OrganizationStatus), hidden: !rowData._d || rowData._deleting || rowData._saving}) }
    ]
    const canCreate = list && list.c
    const canAction = canCreate || !!(list && list.items.filter((row : any) => row._u || row._d).length)
    if (canCreate) statusActions.push({ icon: () => <AddCircle color='primary' />, onClick: () => onCreate && onCreate(), isFreeAction: true })

    return (
            <MaterialTable
              title='Unit Status Types'
              columns={statusColumns}
              data={list ? list.items : []}
              options={{ sorting: true, paging: false, search: false, actionsColumnIndex: statusColumns.length, padding: 'dense' }}
              actions={canAction ? statusActions : undefined}
              style={{boxShadow: 'none'}}
              icons={tableIcons as any}
              components={{
                Container: props => <GridPaper {...props} trimTop />,
                Toolbar: props => <MTableToolbar {...props} classes={{root: 'no-MuiToolbar-gutters'}} />,
                Row: props => <MTableBodyRow {...props} className={classNames(props.className, { 'row-deleting': props.data._deleting, 'row-saving': props.data._saving })} />
              }}
            />)
  }
}

export default StatusList