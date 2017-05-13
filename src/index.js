import React from 'react';
import { render } from 'react-dom';
import firebase from 'firebase';
import App from './App';
import './index.scss';

const config = {
  apiKey: "AIzaSyBZtkgL-X99erCkqvjEPwK_NGdFuZljOck",
  authDomain: "social-101e8.firebaseapp.com",
  databaseURL: "https://social-101e8.firebaseio.com",
  projectId: "social-101e8",
  storageBucket: "social-101e8.appspot.com",
  messagingSenderId: "419848424281"
};
firebase.initializeApp(config);

render(
  <App />,
  document.getElementById('root')
);
