import React, { Component } from 'react';
import firebase from 'firebase';

export default class Post extends Component {
  constructor() {
    super();
    this.state = {
      author: '',
    };
  }
  getAuthorName(uid) {
    firebase.database().ref('/users/'+uid).once('value').then(snapshot => {
      this.setState({author: snapshot.val().displayName});
    });
  }
  componentDidMount() {
    this.getAuthorName(this.props.author);
  }
  render() {
    let date = new Date(this.props.timestamp);
    return (
      <div className="Post">
        <div className="author">{this.state.author}</div>
        <div className="content">
          <span
            className="fa fa-quote-left"
            aria-hidden="true"
          />
          {this.props.content}
          <span
            className="fa fa-quote-right"
            aria-hidden="true"
          />
        </div>
        {this.props.image &&
          <div className="image"><img src={this.props.image} alt="post pic" /></div>
        }
        <div className="details">
          <div className="timestamp">{
            (date.getMonth() + 1)+'-'+
            (date.getDate())+'-'+
            (date.getFullYear())+' '+
            (this.formatTime(date))
          }</div>
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
};
