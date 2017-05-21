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
      defaultPerUpdate: 5,
      loading: false,
      end: false,
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
    let App = document.getElementsByClassName('App')[0];
    let refreshTimer;
    App.addEventListener('scroll', (event) => {
      if (App.scrollHeight ==
          App.scrollTop +
          window.innerHeight) {
          this.refs.RefreshButton.classList.add('loading');
          this.refs.RefreshButton.setAttribute('disabled','disabled');
          clearTimeout(refreshTimer);
          refreshTimer = setTimeout(() => {
            let scrollTop = App.scrollTop;
            this.updatePosts();
            App.scrollTop = scrollTop;
          }, 500);
      }
    });
  }
  updatePosts(start, end, by) {
    if(start !== 0 && this.state.end) {
      this.refs.RefreshButton.classList.remove('loading');
      this.refs.RefreshButton.removeAttribute('disabled');
      return;
    }
    let posts = [];
    this.refs.RefreshButton.classList.add('loading');
    this.refs.RefreshButton.setAttribute('disabled','disabled');
    let currentPostNumber = this.state.posts.length;
    firebase.database().ref('/posts/')
    .orderByChild(by || 'timestamp')
    .limitToLast(this.state.posts.length+(end || this.state.defaultPerUpdate))
    .once('value', snapshot => {
      let i = 0;
      snapshot.forEach(post => {
        i++;
        posts.unshift(Object.assign({}, {key: post.key}, post.val()));
      });
      this.setState({posts, end: i<=currentPostNumber});
      this.refs.RefreshButton.classList.remove('loading');
      this.refs.RefreshButton.removeAttribute('disabled');
    });
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
        {!this.state.end &&
          <div style={{textAlign: 'center', color: '#aaa'}}><span className="fa fa-circle-o-notch fa-spin fa-3x" /></div>
        }
        <button
          ref="RefreshButton"
          id="refresh"
          className="show"
          onClick={() => {this.updatePosts(0); document.getElementsByClassName('App')[0].scrollTop = 0;}}>
          <span className="fa fa-refresh" title="Refresh Feed" />
        </button>
      </div>
    );
  }
}
