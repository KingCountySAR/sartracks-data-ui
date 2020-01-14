import React from 'react'
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@material-ui/core'

const DeletePrompt :React.FC<{open:boolean, onClose:(confirm?: boolean) => void, type: string, name:string}> = ({open, onClose, type, name}) => (
<Dialog open={open} onClose={() => onClose()}>
  <DialogTitle id="form-dialog-title">Delete {type}</DialogTitle>
  <DialogContent>
    <DialogContentText>
      Are you sure you want to delete {type.toLowerCase()} <b>{name}</b>?
    </DialogContentText>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => onClose()}>Cancel</Button>
    <Button onClick={() => onClose(true)} color='primary'>Delete</Button>
  </DialogActions>
</Dialog>)

export default DeletePrompt