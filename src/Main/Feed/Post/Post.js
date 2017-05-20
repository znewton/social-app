import React, { Component } from 'react';
import firebase from 'firebase';

const truncateLengthConst = 150;

export default class Post extends Component {
  constructor() {
    super();
    this.state = {
      author: '',
      expanded: false,
      image: null,
    };
  }
  getAuthorName(uid) {
    firebase.database().ref('/users/'+uid).once('value').then(snapshot => {
      this.setState({author: snapshot.val().displayName});
    });
  }
  componentDidMount() {
    this.getAuthorName(this.props.author);
    if(this.props.image) {
      this.imageExists(this.props.image);
    }
  }
  imageExists(url) {
    var img = new Image();
    img.onload = function() { this.setState({image: url}) };
    img.onerror = function() { };
    img.src = url;
  }
  render() {
    let date = new Date(this.props.timestamp);
    let truncateLength = this.state.image ? truncateLengthConst/2 : truncateLengthConst;
    return (
      <div className={'Post' + (this.props.gridItem ? ' grid-item' : '')}>
        <div className="head">
          <div className="author">{this.state.author}</div>
          <div className="timestamp">{
            (date.getMonth() + 1)+'-'+
            (date.getDate())+'-'+
            (date.getFullYear())+' '+
            (this.formatTime(date))
          }</div>
        </div>
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
        {this.props.image &&
          <div className="image"><img src={this.props.image} alt="post pic" /></div>
        }
        <div className="foot">
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
}

Post.propTypes = {
  author: React.PropTypes.string,
  content: React.PropTypes.string,
  timestamp: React.PropTypes.object,
  image: React.PropTypes.string,
  id: React.PropTypes.string,
  gridItem: React.PropTypes.bool,
};
