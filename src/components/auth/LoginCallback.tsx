import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { CallbackComponent } from "redux-oidc";
import userManager from "../../user-manager";

class LoginCallback extends Component<{ history :any }> {
  render() {
    return (
      <CallbackComponent
        userManager={userManager}
        successCallback={() => {
          if (sessionStorage.redirect) {
            var redirect = sessionStorage.redirect;
            sessionStorage.removeItem('redirect');
            this.props.history.push(redirect);
          } else {
            window.location.href = '/';
          }
        }}
        errorCallback={error => {
          console.error(error);
          if (sessionStorage.redirect) {
            this.props.history.push(sessionStorage.redirect);
          } else {
            window.location.href = '/';
          }
        }}
      >
        <div><i className='fas fa-spin fa-spinner'></i> Finishing login</div>
      </CallbackComponent>
    );
  }
}

export default withRouter(connect()(LoginCallback));
