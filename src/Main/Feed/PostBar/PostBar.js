import React, { Component } from 'react';
import firebase from 'firebase';

export default class PostBar extends Component {
  writePost() {
    let newPost = {
      author: firebase.auth().currentUser.uid,
      content: this.refs.TextArea.value,
      timestamp: Date.now(),
    };
    var newPostRef = firebase.database().ref('/posts').push();
    newPostRef.set(newPost);
    this.props.handlePost(newPost);
    this.refs.TextArea.value = '';
  }
  render() {
    return (
      <div className="PostBar">
        <textarea ref="TextArea"
          rows="1"
          placeholder="What's up?"
          wrap="soft"
        ></textarea>
        <button onClick={() => this.writePost()}><span className="fa fa-paper-plane" /></button>
      </div>
    )
  }
}
