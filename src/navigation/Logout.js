import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router'
import { injectIntl, defineMessages } from "react-intl";
import { withSnackbar } from 'notistack';
import { withUserInfo } from '../with/withUserInfo';



const messages = defineMessages({ 
  logout: {
    id: 'logout.ok',
    defaultMessage: 'You are now disconnected...',
    description: 'You are now disconnected...',
  }
});



class Logout extends Component {

  static propTypes = {
    userInfo: PropTypes.object.isRequired,
  }

  componentDidMount() {
    const { logout } = this.props.userInfo;
    const key = this.props.enqueueSnackbar(
      this.props.intl.formatMessage(messages.logout), 
      {variant: 'info', anchorOrigin: {vertical: 'bottom',horizontal: 'center'}, onClick: () => {this.props.closeSnackbar(key);}}
    );
    logout();
  }

  render() {
    return (
      <Redirect to='/' />
    );
  }
}

export default injectIntl(withUserInfo(withSnackbar(Logout)));