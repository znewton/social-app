import React, { Component } from 'react';
import firebase from 'firebase';

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
    firebase.database().ref('/users/'+uid).once('value').then(snapshot => {
      this.setState({author: snapshot.val().displayName});
      if(snapshot.val().profilePic) {
        this.imageExists(snapshot.val().profilePic, 'profilePic');
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
    let currentLikes = this.state.likes;
    let currentDislikes = this.state.dislikes;
    let currentLiked = this.state.liked;
    let currentDisliked = this.state.disliked;
    this.setState({
      liked: !currentLiked,
      likes: currentLikes + (currentLiked ? -1 : 1),
      disliked: false,
      dislikes: currentDislikes + (currentDisliked ? -1 : 0),
    });
    firebase.database().ref('/post-likes/'+this.props.id+'/'+this.props.author).once('value').then((snapshot) => {
      if(snapshot.val()) { // unlike
        firebase.database().ref('/post-likes/'+this.props.id+'/'+this.props.author).remove();
        firebase.database().ref('/posts/'+this.props.id+'/likes').transaction((currentDBLikes) => {
          return currentDBLikes - 1;
        });
        this.setState({liked: false, likes: currentLikes - 1});
      } else { //like
        firebase.database().ref('/post-likes/'+this.props.id+'/'+this.props.author).set(true);
        firebase.database().ref('/post-dislikes/'+this.props.id+'/'+this.props.author).remove();
        firebase.database().ref('/posts/'+this.props.id+'/likes').transaction((currentDBLikes) => {
          return currentDBLikes + 1;
        });
        firebase.database().ref('/posts/'+this.props.id+'/dislikes').transaction((currentDBDislikes) => {
          return currentDBDislikes - (currentDisliked ? 1 : 0);
        });
        this.setState({liked: true, disliked: false, likes: currentLikes + 1, dislikes: currentDislikes - 1});
      }
    });
  }
  handleDislike() {
    let currentLikes = this.state.likes;
    let currentDislikes = this.state.dislikes;
    let currentLiked = this.state.liked;
    let currentDisliked = this.state.disliked;
    this.setState({
      liked: false,
      likes: currentLikes + (currentLiked ? -1 : 0),
      disliked: !currentDisliked,
      dislikes: currentDislikes + (currentDisliked ? -1 : 1),
    });
    firebase.database().ref('/post-dislikes/'+this.props.id+'/'+this.props.author).once('value').then((snapshot) => {
      if(snapshot.val()) { // undislike
        firebase.database().ref('/post-dislikes/'+this.props.id+'/'+this.props.author).remove();
        firebase.database().ref('/posts/'+this.props.id+'/dislikes').transaction((currentDBDislikes) => {
          return currentDBDislikes - 1;
        });
        this.setState({disliked: false, dislikes: currentDislikes - 1});
      } else { //dislike
        firebase.database().ref('/post-dislikes/'+this.props.id+'/'+this.props.author).set(true);
        firebase.database().ref('/post-likes/'+this.props.id+'/'+this.props.author).remove();
        firebase.database().ref('/posts/'+this.props.id+'/dislikes').transaction((currentDBDislikes) => {
          return currentDBDislikes + 1;
        });
        firebase.database().ref('/posts/'+this.props.id+'/likes').transaction((currentDBLikes) => {
          return currentDBLikes - (currentLiked ? 1 : 0);
        });
        this.setState({disliked: true, liked: false, dislikes: currentDislikes + 1, likes: currentLikes - 1});
      }
    });
  }
  componentDidMount() {
    this.getAuthor(this.props.author);
    this.getPostStats(this.props.id);
    if(this.props.image) {
      this.imageExists(this.props.image, 'image');
    }
  }
  imageExists(url, key) {
    var img = new Image();
    img.onload = () => {
      let newState = {};
      newState[key] = url;
      if(key === 'image') newState.wide = img.width > img.height*3/2;
      this.setState(newState);
    };
    img.onerror = (e) => {
      console.log('error');
      this.setState({[key]: null});
    };
    img.src = url;
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
          <div style={{textAlign: 'center', color: '#ddd'}}>
            <span className="fa fa-circle-o-notch fa-spin fa-3x" />
          </div>
        }
        {this.state.image &&
          <div className="image"><img src={this.state.image} alt="post pic" /></div>
        }
        <div className="foot">
          <button className={'comments'+(this.state.commentsOpen ? ' open':'')} onClick={() => this.openComments()}>
            <span className="fa fa-comment-o" aria-label="comments" />
            <span className="num">{this.props.comments}</span>
          </button>
          <button className={'like'+(this.state.liked ? ' selected':'')} onClick={() => this.handleLike()}>
            <span className="fa fa-smile-o" aria-label="like" />
            <span className="num">{this.props.likes}</span>
          </button>
          <button className={'dislike'+(this.state.disliked ? ' selected':'')} onClick={() => this.handleDislike()}>
            <span className="fa fa-frown-o" aria-label="dislike" />
            <span className="num">{this.props.dislikes}</span>
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
  author: React.PropTypes.string,
  content: React.PropTypes.string,
  timestamp: React.PropTypes.object,
  image: React.PropTypes.string,
  likes: React.PropTypes.number,
  dislikes: React.PropTypes.number,
  comments: React.PropTypes.number,
  id: React.PropTypes.string.isRequired,
  gridItem: React.PropTypes.bool,
};

Post.defaultProps = {
  likes: 0,
  dislikes: 0,
  comments: 0,
  gridItem: false,
}
