import React, {Component, Fragment, ReactNode} from "react";
import { Route } from "react-router-dom";
import { connect } from "react-redux";
import userManager from '../../user-manager';
import { StoreState } from "../../store";
import { OidcState } from '../../store/oidc';

interface ForceLoginProps {
  redirect :string
}

class ForceLogin extends Component<ForceLoginProps> {
  redirect :string
  timeout :any

  constructor(props :ForceLoginProps) {
    super(props)
    this.redirect = props.redirect;
  }

  componentDidMount() {    
    this.timeout = window.setTimeout(() => {
      sessionStorage.setItem('redirect', this.redirect);
      userManager.signinRedirect();
    }, 1)
  }

  componentWillUnmount() {
    if (this.timeout) window.clearTimeout(this.timeout)
  }

  render() {
    return 'Redirecting to login page ...';
  }
}

interface AuthRouteProps {
  denied? :string
  loading? :string
  oidc: OidcState,
  roles? :string,
  self?: string,
  component? :any,
  children? :ReactNode
}

export const AuthRoute = React.memo<AuthRouteProps>((
  { component: Component, children, denied, loading, oidc, roles, self, ...rest }) => {
  // assume denied
  var content = (props :any) => <Fragment>{denied || (denied === '' ? '' : <ForceLogin redirect={props.match.url} />)}</Fragment>;

  if (oidc.isLoadingUser || oidc.isSigningOut || (roles && (oidc.loadingGroups || (oidc.user && !oidc.groups)))) {
    content = () => <Fragment>{loading || (loading === '' ? loading : <i className='fas fa-spinner fa-spin'></i>)}</Fragment>;
  } else if (oidc.user) {
    const simpleCheck = !self && !roles;
    const selfCheck = simpleCheck || self === oidc.user.profile.memberId;
    const rolesCheckA = simpleCheck || (oidc.groups && oidc.groups.includes(roles as string))
    const rolesCheck = rolesCheckA || (roles && oidc.groups && Array.isArray(roles) && oidc.groups.some(r => roles.includes(r)));

    if (simpleCheck || selfCheck || rolesCheck) {
      content = () => Component ? <Component {...rest} /> : <Fragment>{children}</Fragment>
    }
  }
  return (<Route {...rest} render={content} />);
});

function mapStateToProps(state :StoreState) {
  return {
    oidc: state.oidc
  };
}

export default connect(mapStateToProps)(AuthRoute);