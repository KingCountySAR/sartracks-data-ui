import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

import { initialState as config } from '../store/config';
import { PhotoLoader } from './photo-loader';

interface MemberPhotoProps extends React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> {
  src?: never
  memberName? :string
  memberId? :string
}

const defaultStyle = {height:'5em', width:'3.75em', borderRadius:4, marginRight:8, marginBottom:8}

const MemberPhoto :React.FC<MemberPhotoProps> = ({src, memberName, memberId, style, ...rest}) => {
  console.log(src, memberName, memberId, style)
  return <PhotoLoader url={memberId ? `${config.apis.oldData}/members/${memberId}/photo` : undefined} render={
    (fetching,data) => (fetching && !data
      ? <div style={{...defaultStyle, display:'flex', alignItems:'center', justifyContent:'center', ...style}}><FontAwesomeIcon icon={faSpinner} spin size="2x" /></div>
      : <img alt={memberName} src={data} style={{...defaultStyle, ...style}} {...rest} />
    )} />
    }

export default MemberPhoto