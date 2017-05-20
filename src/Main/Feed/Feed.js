import React, { Component } from 'react';
import firebase from 'firebase';

import touch from '../../Touch/Touch';
import Post from './Post/Post';
import PostBar from './PostBar/PostBar';

export default class Feed extends Component {
  constructor() {
    super();
    this.state = {
      posts: [],
      start: 0,
      defaultPerUpdate: 20,
      loading: false,
    };
  }
  componentDidMount() {
    this.updatePosts();
    touch.addSwipeListener(touch.DOWN, () => {
      this.refs.Feed.classList.add('show');
    }, this.refs.Feed, 0.1);
    touch.addSwipeListener(touch.UP, () => {
      this.refs.Feed.classList.remove('show');
    }, this.refs.Feed, 0.1);
  }
  updatePosts(start, end, by) {
    let posts;
    this.refs.RefreshButton.classList.add('loading');
    this.refs.RefreshButton.setAttribute('disabled','disabled');
    if(start === 0) posts = [];
    else posts = this.state.posts;
    firebase.database().ref('/posts/')
    .limitToFirst(posts.length+(end || this.state.defaultPerUpdate))
    .orderByChild(by || 'timestamp')
    .once('value', snapshot => {
      snapshot.forEach(post => {
        posts.unshift(Object.assign({}, {key: post.key}, post.val()));
      });
      this.setState({posts});
      this.refs.RefreshButton.classList.remove('loading');
      this.refs.RefreshButton.removeAttribute('disabled');
    });
    window.scrollTo(0,0);
  }
  handlePost(post) {
    let posts = this.state.posts;
    posts.unshift(post);
    this.setState({posts});
  }
  render() {
    return (
      <div className="Feed show" ref="Feed">
        <PostBar handlePost={this.handlePost.bind(this)} />
        <div className="posts" ref="PostWrapper">
          {this.state.posts.map(post => (
            <Post  key={post.key}
              id={post.key}
              author={post.author}
              content={post.content}
              image={post.image}
              timestamp={post.timestamp}
              gridItem={true}
            />
          ))}
        </div>
        <button
          ref="RefreshButton"
          id="refresh"
          className="show"
          onClick={() => this.updatePosts(0)}>
          <span className="fa fa-refresh" title="Refresh Feed" />
        </button>
      </div>
    );
  }
}
