import React from 'react'
import axios, { CancelTokenSource } from 'axios'

interface PhotoLoaderProps {
  url?: string,
  render: (fetching: boolean, data?:string) => React.ReactNode
}
interface PhotoLoaderState {
  fetching: boolean,
  data?: string
}

export class PhotoLoader extends React.Component<PhotoLoaderProps, PhotoLoaderState> {
  cancel? :CancelTokenSource

  constructor(props: PhotoLoaderProps) {
    super(props)
    this.state = {
      fetching: false,
      data: undefined
    }
  }

  componentDidMount() {
    this.getPhoto();
  }

  componentDidUpdate(prevProps :PhotoLoaderProps) {
    if (this.props.url && this.props.url !== prevProps.url) { 
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
    this.cancelRequest()
    if (this.props.url) {
      this.cancel = axios.CancelToken.source()
      this.setState({ fetching: true })
      axios.get(this.props.url, { cancelToken: this.cancel.token })
        .then(r => {
          return r.data.data as string
        })
        .then(data => this.setState({ data, fetching: false }))
        .catch(() => {
          this.cancelRequest()
        })
    }
  }

  render() {
    return this.props.render(this.state.fetching, this.state.data)
  }
}