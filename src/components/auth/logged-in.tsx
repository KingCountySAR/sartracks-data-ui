import React from 'react';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import { CallbackComponent } from 'redux-oidc';
import userManager from '../../user-manager';

class CallbackPage extends React.Component<{ history: any }> {
  successCallback = () => {
    this.props.history.push(sessionStorage.redirect || '/');
  }

  render() {
    // just redirect to '/' in both cases
    return (
      <CallbackComponent userManager={userManager} successCallback={this.successCallback} errorCallback={this.successCallback}>
        <div>
          Finishing login ...
        </div>
      </CallbackComponent>
    );
  }
}

export default withRouter(connect()(CallbackPage));