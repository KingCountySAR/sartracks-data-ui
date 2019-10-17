import React, { ReactNode } from 'react'
import './drawer.css'

const DrawerPane :React.FC<{children :ReactNode}> = ({children}) => <div className={'drawer-pane'}>{children}</div>

class Drawer extends React.Component<{ children: ReactNode, fixed: boolean, open: boolean, showDrawer: (show :boolean) => void }> {
  wired: boolean

  constructor(props :any) {
    super(props)
    this.wired = false
  }

  componentDidMount() {
    if (this.props.open && !this.props.fixed && !this.wired) {
      this.wired = true
      document.addEventListener('keydown', this.onKey)
    }
  }

  componentDidUpdate() {
    const shouldWire = this.props.open && !this.props.fixed
    if (shouldWire !== this.wired) {
      this.wired = shouldWire;
      (shouldWire ? document.addEventListener : document.removeEventListener)('keydown', this.onKey);
    }
  }

  componentWillUnmount() {
    if (this.wired) {
      document.removeEventListener('keydown', this.onKey)
    }
  }

  onKey = (ev :KeyboardEvent) => {
    if (ev.key === 'Esc' || ev.key === 'Escape') this.props.showDrawer(false);
  }

  render() {
    const pane = <DrawerPane>{this.props.children}</DrawerPane>
    return (
      this.props.fixed ? pane :
      <div className={'drawer-container' + (this.props.open ? ' open' : '')}
        onClick={(evt) => {
          if ((evt.target as any).className.indexOf('drawer-container') >= 0) this.props.showDrawer(false)
        }}
      >
        {pane}
        <div className='drawer-mask'></div>
      </div>
    )
  }
}

export default Drawer