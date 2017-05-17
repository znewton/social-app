import React, { Component } from 'react';
import firebase from 'firebase';

export default class Feed extends Component {
  constructor() {
    super();
    this.state = {
      posts: [],
      start: 0,
      end: 10,
    };
  }
  componentDidMount() {
    this.updatePosts();
  }
  writePost() {
    var newPostRef = firebase.database().ref('/posts').push();
    newPostRef.set({
      author: firebase.auth().currentUser.uid,
      content: 'test'
    });
  }
  updatePosts() {
    let posts = this.state.posts;
    firebase.database().ref('/posts')
    .startAt(this.state.start)
    .endAt(this.state.end)
    .once('value')
    .then(snapshot => {
      snapshot.forEach(post => {
        posts.push(Object.assign({}, {key: post.key}, post.val()));
      })
    });
    this.setState({posts});
  }
  shouldComponentUpdate(nextProps, nextState) {
    return nextState.posts.length != this.state.posts.length;
  }
  render() {
    return (
      <div className="Feed">
        <button onClick={this.writePost.bind(this)}>Post</button>
        {this.state.posts.map(post => (
          <div className="Post" key={post.key}>
            <div>{post.author}</div>
            <div>{post.content}</div>
          </div>
        ))}
      </div>
    );
  }
}
