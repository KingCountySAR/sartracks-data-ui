import React, { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Location } from 'history';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { faMountain } from '@fortawesome/free-solid-svg-icons';
import { faGraduationCap } from '@fortawesome/free-solid-svg-icons';
import { faUsers} from '@fortawesome/free-solid-svg-icons';
import { faPaw } from '@fortawesome/free-solid-svg-icons';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

import './main-menu.css'

const MenuIcon :React.FC<{icon?: IconDefinition}> = ({icon}) =>
  icon ? <FontAwesomeIcon className='menu-icon' icon={icon} /> : <span className='menu-icon'></span>

const MenuItem :React.FC<{title: string, link: string, icon?: IconDefinition, active? :boolean, onActed: ()=>void}> =
 ({title, link, icon, active, onActed}) => {
  return <li><Link className={'menu-item' + (active ? ' active' : '')}  to={link} onClick={() => {
    onActed();
    return true;
  }}><MenuIcon icon={icon}/>{title}</Link></li>
}

class MenuToggle extends React.Component<{title: string, forceOpen? :boolean, icon?: IconDefinition, children: ReactNode}, { open :boolean }> {
  constructor(props :any) {
    super(props)
    this.state = {
      open: !!this.props.forceOpen
    }
  }

  toggle = () => {
    if (!this.props.forceOpen) this.setState({open: !this.state.open})
  }

  render() {
    const { title, icon, children } = this.props
    const { open } = this.state

    const height = (children instanceof Array) ? (children.length * 40) : children ? 40 : 0

    return <li className='menu-toggle'>
    <button className='menu-item' onClick={this.toggle}><MenuIcon icon={icon}/><span>{title}</span><FontAwesomeIcon className={'toggle-icon' + (open ? ' open' : '')} icon={faChevronDown} /></button>
    
    <ul style={{height: open ? height : 0}}>
      {children}
    </ul>
    </li>
  }
}

const menu = {
  title: 'Main Menu',
  children: [
    { title: 'Members', icon: faUser, link: '/members' },
    { title: 'Missions', icon: faMountain, children: [
      { title: 'Rosters', link: '/missions' },
      { title: 'Reports', link: '/missions/reports' }
    ]},
    { title: 'Training', icon: faGraduationCap, children: [
      { title: 'Rosters', link: '/training/list' },
      { title: 'Courses', link: '/training/courses' },
      { title: 'More', link: '/training' }
    ]},
    { title: 'Units', icon: faUsers, link: '/units' },
    { title: 'Animals', icon: faPaw, link: '/animals' },
  ]
}

const getSelected = (path :string) => {
  var longest = 0
  var selected = undefined
  var parent = undefined

  menu.children.forEach(m => {
    if (m.children) {
      m.children.forEach(c => {
        if (c.link && path.startsWith(c.link) && c.link.length > longest) {
          selected = c
          parent = m
          longest = c.link.length
        }
      })
    } else {
      if (m.link && path.startsWith(m.link) && m.link.length > longest) {
        selected = m
        parent = undefined
        longest = m.link.length
      }
    }
  })

  return { selected, parent }
}

const MainMenu :React.FC<{location :Location, onActed: () => void}> = ({location, onActed}) => {

  const { selected, parent } = getSelected(location.pathname.toLowerCase())
  return (<ul className='main-menu'>
    <li><h2>{menu.title}</h2></li>
    { menu.children.map(m => 
      !m.children ? <MenuItem key={m.title} title={m.title} icon={m.icon} link={m.link} active={m === selected} onActed={onActed} />
                  : <MenuToggle key={m.title} forceOpen={m === parent} title={m.title} icon={m.icon}>{m.children.map(c => 
                      <MenuItem key={c.title} title={c.title} link={c.link} active={c === selected} onActed={onActed} />
                    )}</MenuToggle>
    )}
  </ul>)
}

export default MainMenu