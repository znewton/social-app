import React, { Component } from 'react';
import PropTypes from 'prop-types';
import firebase from 'firebase';
import { Redirect } from 'react-router-dom';
import { makeCancelable, getUserByUid, updateUserProfile } from '../../lib/Firebase/Functions';
import { nameFromEmail } from '../../lib/Helpers/Helpers';

import ProgressSpinner from '../../Components/ProgressSpinner/ProgressSpinner';
import ContentEditableInput from '../../Components/ContentEditableInput/ContentEditableInput';

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      fetchingUser: true,
      changes: false,
    }
    this.getUserPromise = {cancel: () => {}};
    this.updateUserPromise = {cancel: () => {}};
  }
  componentDidMount() {
    this.getUserPromise = makeCancelable(getUserByUid(this.props.uid));
    this.getUserPromise.promise.then((user) => {
        this.setState({user: user, fetchingUser: false});
      }).catch(error => {
        if(error.isCancelled) return;
        this.setState({fetchingUser: false})
      });
  }
  componentWillUnmount() {
    this.getUserPromise.cancel();
    this.updateUserPromise.cancel();
  }
  handleChange(name, value) {
    let user = this.state.user;
    user[name] = value;
    this.setState({user, changes: true});
  }
  handleSave() {
    this.updateUserPromise = makeCancelable(updateUserProfile(this.state.user));
    this.updateUserPromise.promise.then((user) => {
      this.setState({user, changes: false});
    });
  }
  render() {
    if(!this.state.user) {
      if (this.state.fetchingUser)
        return <ProgressSpinner />;
      return <Redirect to="/404" />
    }
    const user = this.state.user;
    const isCurrentUser = firebase.auth().currentUser.uid == this.props.uid;
    return (
      <div className="Profile">
        <h1>
          <ContentEditableInput
            value={user.displayName}
            placeholder={'Firstname Lastname'}
            enabled={isCurrentUser}
            onChange={(value) => this.handleChange('displayName', value)}
          />
        </h1>
        <div>
          <h5>email</h5>
          <ContentEditableInput
            value={user.email}
            placeholder={isCurrentUser ? 'name@email.com' : 'Not given'}
            enabled={false}
            onChange={(value) => this.handleChange('email', value)}
          />
        </div>
        <div>
          <h5>phone</h5>
          <ContentEditableInput
            value={user.phone}
            displayFilter={(text) => text.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')}
            placeholder={isCurrentUser ? '(123) 456-7890' : 'Not given'}
            enabled={isCurrentUser}
            onChange={(value) => this.handleChange('phone', value)}
          />
        </div>
        <div>
          <h5>bio</h5>
          <ContentEditableInput
            value={user.bio}
            placeholder={isCurrentUser ? 'Tell people about yourself...' : 'Not given'}
            enabled={isCurrentUser}
            onChange={(value) => this.handleChange('bio', value)}
          />
        </div>
        <br />
        {this.state.changes &&
          <button className="btn success" onClick={() => this.handleSave()}>Save Changes</button>
        }
      </div>
    );
  }
}

Profile.propTypes = {
  uid: PropTypes.string,
}
