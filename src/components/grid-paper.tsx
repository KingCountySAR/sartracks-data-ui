import React from 'react'
import { Paper } from './material'
import { PaperProps } from '@material-ui/core/Paper'
import classNames from 'classnames'

const GridPaper :React.FC<PaperProps & {trimTop?: boolean}> = ({trimTop, className, ...props}) => (
  <Paper {...props}
    className={classNames(className, 'grid-paper', {'grid-paper-trim-top': trimTop})}
  />)

export default GridPaper