import React, { Component } from 'react';
import PropTypes from 'prop-types';
import firebase from 'firebase';

import { getUserByUid, likePost, dislikePost } from '../../../lib/Firebase/Functions';
import imageExists from '../../../lib/ImageExists/ImageExists';

import ProgressSpinner from '../../../Components/ProgressSpinner/ProgressSpinner';

const truncateLengthConst = 150;

export default class Post extends Component {
  constructor() {
    super();
    this.state = {
      author: '',
      profilePic: null,
      expanded: false,
      image: '',
      wide: false,
      liked: false,
      likes: 0,
      disliked: false,
      dislikes: 0,
      commentsOpen: false,
      comments: 0,
    };
  }
  getAuthor(uid) {
    getUserByUid(uid).then(author => {
      if(!author) {
        this.setState({author: '[deleted]'});
        return;
      }
      this.setState({author: author.displayName});
      if(author.profilePic) {
        imageExists(author.profilePic, 'profilePic');
      }
    });
  }
  getPostStats(pkey) {
    firebase.database().ref('/post-likes/'+pkey+'/'+this.props.author).once('value').then((snapshot) => {
      if(snapshot.val()) this.setState({liked: true});
    });
    firebase.database().ref('/post-dislikes/'+pkey+'/'+this.props.author).once('value').then((snapshot) => {
      if(snapshot.val()) this.setState({disliked: true});
    });
    this.setState({likes: this.props.likes, dislikes: this.props.dislikes, comments: this.props.comments});
  }
  openComments() {
    this.setState({commentsOpen: !this.state.commentsOpen});
  }
  handleLike() {
    if(this.props.author === firebase.auth().currentUser.uid) return;
    let currentLikes = this.state.likes;
    let currentDislikes = this.state.dislikes;
    let currentlyLiked = this.state.liked;
    let currentlyDisliked = this.state.disliked;
    this.setState({ // optimistic liking
      liked: !currentlyLiked,
      likes: currentLikes + (currentlyLiked ? -1 : 1),
      disliked: false,
      dislikes: currentDislikes + (currentlyDisliked ? -1 : 0),
    });
    likePost(this.props.id, this.props.author, currentLikes, currentDislikes, currentlyDisliked).then((newState) => { this.setState(newState) })
  }
  handleDislike() {
    if(this.props.author === firebase.auth().currentUser.uid) return;
    let currentLikes = this.state.likes;
    let currentDislikes = this.state.dislikes;
    let currentlyLiked = this.state.liked;
    let currentlyDisliked = this.state.disliked;
    this.setState({ // optimistic disliking
      liked: false,
      likes: currentLikes + (currentlyLiked ? -1 : 0),
      disliked: !currentlyDisliked,
      dislikes: currentDislikes + (currentlyDisliked ? -1 : 1),
    });
    dislikePost(this.props.id, this.props.author, currentLikes, currentDislikes, currentlyLiked).then((newState) => { this.setState(newState) })
  }
  componentDidMount() {
    this.getAuthor(this.props.author);
    this.getPostStats(this.props.id);
    if(this.props.image) {
      imageExists(this.props.image, 'image').then((newState) => this.setState(newState));
    }
  }
  render() {
    let date = new Date(this.props.timestamp);
    let truncateLength = this.state.image ? truncateLengthConst/2 : truncateLengthConst;
    return (
      <div className={'Post'
        + (this.props.gridItem ? ' grid-item' : '')
        + (this.state.wide ? ' grid-item--width2' : '')}>
        <div className="head">
          <span className="profilePic">
            {this.state.profilePic &&
              <img src={this.state.profilePic} />
            }
          </span>
          <span className="head-text">
            <div className="author">{this.state.author}</div>
            <div className="timestamp">{
              (date.getMonth() + 1)+'-'+
              (date.getDate())+'-'+
              (date.getFullYear())+' '+
              (this.formatTime(date))
            }</div>
          </span>
        </div>
        {this.props.content &&
          <div className={'content' + (this.state.expanded ? ' expanded' : '')}>
            <span
              className="fa fa-quote-left"
              aria-hidden="true"
            />
            {(this.state.expanded || this.props.content.length <= truncateLength) ?
              this.props.content :
              this.props.content.slice(0, truncateLength) + '...'
            }
            {(this.state.expanded || this.props.content.length <= truncateLength) &&
              <span
                className="fa fa-quote-right"
                aria-hidden="true"
              />
            }
            {(this.props.content.length > truncateLength) &&
              (this.state.expanded ?
                <div
                  className="fake-link"
                  onClick={() => this.setState({expanded: false})}
                >Show less</div> :
                <div
                  className="fake-link"
                  onClick={() => this.setState({expanded: true})}
                >Show more...</div>
              )
            }
          </div>
        }
        {(this.props.image && this.state.image === '') &&
          <ProgressSpinner />
        }
        {this.state.image &&
          <div className="image"><img src={this.state.image} alt="post pic" /></div>
        }
        <div className="foot">
          <button className={'comments'+(this.state.commentsOpen ? ' open':'')} onClick={() => this.openComments()}>
            <span className="fa fa-comment-o" aria-label="comments" />
            <span className="num">{this.state.comments}</span>
          </button>
          <button
            className={'like'+(this.state.liked ? ' selected':'')}
            onClick={() => this.handleLike()}
            disabled={this.props.author === firebase.auth().currentUser.uid ? true : false}
          >
            <span className="fa fa-smile-o" aria-label="like" />
            <span className="num">{this.state.likes}</span>
          </button>
          <button
            className={'dislike'+(this.state.disliked ? ' selected':'')}
            onClick={() => this.handleDislike()}
            disabled={this.props.author === firebase.auth().currentUser.uid ? true : false}
          >
            <span className="fa fa-frown-o" aria-label="dislike" />
            <span className="num">{this.state.dislikes}</span>
          </button>
        </div>
      </div>
    );
  }
  formatTime(d) {
    var hh = d.getHours();
    var m = d.getMinutes();
    var dd = "AM";
    var h = hh;
    if (h >= 12) {
      h = hh - 12;
      dd = "PM";
    }
    if (h == 0) {
      h = 12;
    }
    m = m < 10 ? "0" + m : m;
    return h + ":" + m + ' ' + dd;
  }
  diffMins(first) {
    return Math.round((((Date.now() - first) % 86400000) % 3600000) / 60000);
  }
}

Post.propTypes = {
  author: PropTypes.string,
  content: PropTypes.string,
  timestamp: PropTypes.number,
  image: PropTypes.string,
  likes: PropTypes.number,
  dislikes: PropTypes.number,
  comments: PropTypes.number,
  id: PropTypes.string.isRequired,
  gridItem: PropTypes.bool,
};

Post.defaultProps = {
  likes: 0,
  dislikes: 0,
  comments: 0,
  gridItem: false,
}
