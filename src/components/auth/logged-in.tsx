import React from 'react';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import { CallbackComponent } from 'redux-oidc';
import userManager from '../../user-manager';
import PageContainer from '../page-container';
import GridPaper from '../grid-paper';

class CallbackPage extends React.Component<{ history: any }> {
  successCallback = () => {
    this.props.history.push(sessionStorage.redirect || '/');
  }

  render() {
    // just redirect to '/' in both cases
    return (
      <CallbackComponent userManager={userManager} successCallback={this.successCallback} errorCallback={this.successCallback}>
        <PageContainer>
          <GridPaper>
            Finishing login ...
          </GridPaper>
        </PageContainer>
      </CallbackComponent>
    );
  }
}

export default withRouter(connect()(CallbackPage));