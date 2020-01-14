import React from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Select, FormControl, InputLabel, MenuItem, FormControlLabel, Switch, Grid } from '@material-ui/core'
import { OrganizationStatus, OrganizationWacLevel } from '../../../store/organizations'

const StatusDialog :React.FC<{open: boolean, onClose:(formData?: any) => void, status:any}> = ({open, status, onClose, ...rest}) => {
  const [target, setTarget] = React.useState<OrganizationStatus|undefined>(undefined)

  const wacLevelLabel = React.useRef<HTMLLabelElement>(null)
  const [labelWidth, setLabelWidth] = React.useState(0)
  React.useEffect(() => {
    wacLevelLabel.current && setLabelWidth(wacLevelLabel.current.offsetWidth)
    if (!target && open) setTarget(status)
    else if (target && !open) setTarget(undefined)
  }, [target, status, open])

  let content = null
  if (target) {
    content = <DialogContent>
      <Grid container direction='column'>
    <TextField fullWidth variant='outlined' className='form-control-stacked'
            autoFocus
            id='name'
            required
            value={target!.name || ''}
            onChange={evt => setTarget({ ...target!, name: evt.target.value})}
            label='Status Name'
          />
      <FormControl variant='outlined' className='form-control-stacked'>
        <InputLabel id='status-edit-wac-level-text' ref={wacLevelLabel}>WAC Level</InputLabel>
        <Select
          labelId='status-edit-wac-level-text'
          id='status-edit-wac-level'
          value={target!.wacLevel}
          onChange={evt => setTarget({ ...target!, wacLevel: evt.target.value as OrganizationWacLevel})}
          labelWidth={labelWidth}
        >
          <MenuItem value={'None'}>None</MenuItem>
          <MenuItem value={'Support'}>Support</MenuItem>
          <MenuItem value={'Novice'}>Novice</MenuItem>
          <MenuItem value={'Field'}>Field</MenuItem>
        </Select>
      </FormControl>
      <FormControl className='form-control-stacked'>
        <FormControlLabel label='Is Active Member'
          control={ <Switch checked={target.isActive} onChange={evt => setTarget({...target, isActive: !!evt.target.checked})} value='true' color='primary' /> }
        />
      </FormControl>
      <FormControl className='form-control-stacked'>
        <FormControlLabel className='form-control-stacked' label='Gets KCSARA Account'
          control={ <Switch checked={target.getsAccount} onChange={evt => setTarget({...target, getsAccount: !!evt.target.checked})} color='primary' value='true' /> }
        />
      </FormControl>
      </Grid>
    </DialogContent>
  }

  return (<Dialog open={open} onClose={() => onClose()} {...rest}>
  <DialogTitle id='form-dialog-title'>Unit Status Type</DialogTitle>
    {content}
    <DialogActions>
      <Button onClick={() => onClose()} color='primary'>
        Cancel
      </Button>
      <Button onClick={() => onClose(target)} color='primary'>
        Save
      </Button>
    </DialogActions>
  </Dialog>)
}

export default StatusDialog