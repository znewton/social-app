import React, { Component } from 'react';
import firebase from 'firebase';

export default class PostBar extends Component {
  componentDidMount() {
    const observer = new MutationObserver((mutations) => {
      if(mutations[0].addedNodes.length) {
        this.refs.TextArea.classList.remove('empty');
      } else {
        this.refs.TextArea.classList.add('empty');
      }
    });
    observer.observe(this.refs.TextArea, {childList: true });
  }
  writePost() {
    if(!this.refs.TextArea.innerText && !this.refs.ImageUpload.files[0]) return;
    let newPost = {
      author: firebase.auth().currentUser.uid,
      content: this.refs.TextArea.innerText,
      timestamp: Date.now(),
    };
    this.refs.SendButton.setAttribute('disabled', 'disabled');
    if(this.refs.ImageUpload.files[0]) {
      let file = this.refs.ImageUpload.files[0];
      let extension = (/[.]/.exec(file.name)) ? /[^.]+$/.exec(file.name) : undefined;
      if(!extension) return;
      var newPostRef = firebase.database().ref('/posts').push();
      let filename = newPostRef.key+'.'+extension;
      let imageRef = firebase.storage().ref('/images'+filename);
      imageRef.put(file, {contentType: 'image/*'}).then((snapshot) => {
        newPost.image = snapshot.downloadURL;
        newPostRef.set(newPost);
        this.props.handlePost(newPost);
        this.refs.TextArea.classList.add('empty');
        this.refs.TextArea.innerText = '';
        this.clearInputFile(this.refs.ImageUpload);
      });
    } else {
      var newPostRef = firebase.database().ref('/posts').push();
      newPostRef.set(newPost);
      this.props.handlePost(newPost);
      this.refs.TextArea.classList.add('empty');
      this.refs.TextArea.innerText = '';
    }
    this.refs.SendButton.removeAttribute('disabled');
  }
  addImage() {
    if(this.refs.ImageUpload.click) {
      this.refs.ImageUpload.click();
    } else if (this.refs.ImageUpload.onclick) {
      this.refs.ImageUpload.onclick();
    }
  }
  render() {
    return (
      <div className="PostBar">
        <div
          className="textarea empty"
          contentEditable
          ref="TextArea"
        ></div>
        <button
          className="attachButton"
          onClick={() => this.addImage()}
        ><span className="fa fa-picture-o" /></button>
        <input
          type="file"
          accept="image/*"
          name="imageUpload"
          ref="ImageUpload"
          multiple="false"
          hidden />
        <button
          ref="SendButton"
          className="sendButton"
          onClick={() => this.writePost()}
        ><span className="fa fa-paper-plane" /></button>
      </div>
    )
  }
  clearInputFile(f){
    if(f.value){
        try{
            f.value = ''; //for IE11, latest Chrome/Firefox/Opera...
        }catch(err){ }
        if(f.value){ //for IE5 ~ IE10
            var form = document.createElement('form'),
                parentNode = f.parentNode, ref = f.nextSibling;
            form.appendChild(f);
            form.reset();
            parentNode.insertBefore(f,ref);
        }
    }
}
}
