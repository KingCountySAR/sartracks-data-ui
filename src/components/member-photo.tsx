import React from 'react'
import axios, { CancelTokenSource } from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

import noPhoto from '../assets/no-photo.jpg';
import { initialState as config } from '../store/config';

interface MemberPhotoProps extends React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> {
  src?: never
  memberName? :string
  memberid? :string
}

const defaultStyle = {height:'5em', width:'3.75em', borderRadius:4, marginRight:8, marginBottom:8}

class MemberPhoto extends React.Component<MemberPhotoProps, { url? :string, fetching: boolean}> {
  cancel? :CancelTokenSource

  constructor(props :MemberPhotoProps) {
    super(props)
    this.state = { fetching: false }
  }

  componentDidMount() {
    this.getPhoto();
  }

  componentDidUpdate(prevProps :MemberPhotoProps) {
    if (this.props.memberid && this.props.memberid !== prevProps.memberid) {
      this.getPhoto();
    }
  }

  componentWillUnmount() {
    this.cancelRequest()
  }

  cancelRequest = () => {
    this.cancel && this.cancel.cancel()
    delete this.cancel
    this.setState({fetching: false})
  }

  getPhoto = () => {
    const dataRoot = config.apis.data
  
    this.cancelRequest()
    if (this.props.memberid) {
      this.cancel = axios.CancelToken.source()
      this.setState({ fetching: true })
      axios.get(`${dataRoot}/members/${this.props.memberid}?fields[member]=photo`, { cancelToken: this.cancel.token })
        .then(r => {
          return r.data.data.attributes.photo as string
        })
        .then(url => this.setState({url}))
        .catch(() => {
          this.cancelRequest()
        })
    }
  }

  render() {
    const { src, style, memberName, memberid, alt, ...rest } = this.props    
    
    return (this.state.fetching && !this.state.url
      ? <div style={{...defaultStyle, display:'flex', alignItems:'center', justifyContent:'center', ...style}}><FontAwesomeIcon icon={faSpinner} spin size="2x" /></div>
      : <img alt={memberName} src={this.state.url || noPhoto} style={{...defaultStyle, ...style}} {...rest} />)
  }
}

export default MemberPhoto