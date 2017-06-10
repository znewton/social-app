const firebase = require('firebase');
const helpers = require('../Helpers/Helpers');

function makeCancelable(promise) {
  let hasCanceled_ = false;

  const wrappedPromise = new Promise((resolve, reject) => {
    promise.then((val) =>
      hasCanceled_ ? reject({isCanceled: true}) : resolve(val)
    );
    promise.catch((error) =>
      hasCanceled_ ? reject({isCanceled: true}) : reject(error)
    );
  });

  return {
    promise: wrappedPromise,
    cancel() {
      hasCanceled_ = true;
    },
  };
};

const defaultUserSettings = {
  notifications: true,
  ads: true,
};

function createUserProfile(user) {
  firebase.database().ref('/users/'+user.uid).set({
    email: user.email,
    phone: '',
    displayName: helpers.nameFromEmail(user.email),
    friends: [],
    bio: 'I\'m a human!',
    settings: defaultUserSettings,
  });
}

function updateUserProfile(user) {
  const currentUser = firebase.auth().currentUser;
  const sanitizedUser = {
      phone: user.phone.replace(/[^\d]/g, ''),
      displayName: user.displayName || helpers.nameFromEmail(user.email),
      bio: user.bio,
  };
  return new Promise((resolve, reject) => {
    firebase.database().ref('/users/'+firebase.auth().currentUser.uid).update(sanitizedUser)
    .then(() => resolve(sanitizedUser)).catch(() => reject(user));
  });
}

function resetUserSettings() {
  return new Promise((resolve, reject) => {
    firebase.database().ref('/users/'+firebase.auth().currentUser.uid).update({
      settings: defaultUserSettings,
    }).then(() => {
      resolve(defaultUserSettings);
    }).catch(error => {
      reject(error);
    });
  });
}

function getUserByUid(uid) {
  return new Promise((resolve, reject) => {
    firebase.database().ref('/users/'+uid).once('value').then(snapshot => {
      resolve(snapshot.val());
    }).catch(error => {
      reject(error);
    });
  });
}

function saveUserSettings(newSettings) {
  return new Promise((resolve, reject) => {
    let settings = defaultUserSettings;
    for(let key in settings) {
      if(!settings.hasOwnProperty(key) || !newSettings.hasOwnProperty(key)) continue;
      settings[key] = newSettings[key];
    }
    firebase.database().ref('/users/'+firebase.auth().currentUser.uid).set({
      settings: defaultUserSettings,
    }).then(() => {
      resolve(settings);
    }).catch(error => {
      reject(error);
    });
  });
}

function likePost(postId, authorId, currentLikes, currentDislikes, currentlyDisliked) {
  return new Promise((resolve, reject) => {
    firebase.database().ref('/post-likes/'+postId+'/'+authorId).once('value').then((snapshot) => {
      if(snapshot.val()) { // unlike
        firebase.database().ref('/post-likes/'+postId+'/'+authorId).remove();
        firebase.database().ref('/posts/'+postId+'/likes').transaction((currentDBLikes) => {
          return currentDBLikes - 1;
        });
        resolve({liked: false, likes: currentLikes - 1});
      } else { //like
        firebase.database().ref('/post-likes/'+postId+'/'+authorId).set(true);
        firebase.database().ref('/post-dislikes/'+postId+'/'+authorId).remove();
        firebase.database().ref('/posts/'+postId+'/likes').transaction((currentDBLikes) => {
          return currentDBLikes + 1;
        });
        firebase.database().ref('/posts/'+postId+'/dislikes').transaction((currentDBDislikes) => {
          return currentDBDislikes - (currentlyDisliked ? 1 : 0);
        });
        resolve({liked: true, disliked: false, likes: currentLikes + 1, dislikes: currentDislikes + (currentlyDisliked ? -1 : 0)});
      }
    }).catch((error) => { reject(error); });
  });
}

function dislikePost(postId, authorId, currentLikes, currentDislikes, currentlyLiked) {
  return new Promise((resolve, reject) => {
    firebase.database().ref('/post-dislikes/'+postId+'/'+authorId).once('value').then((snapshot) => {
      if(snapshot.val()) { // undislike
        firebase.database().ref('/post-dislikes/'+postId+'/'+authorId).remove();
        firebase.database().ref('/posts/'+postId+'/dislikes').transaction((currentDBDislikes) => {
          return currentDBDislikes - 1;
        });
        resolve({disliked: false, dislikes: currentDislikes - 1});
      } else { //dislike
        firebase.database().ref('/post-dislikes/'+postId+'/'+authorId).set(true);
        firebase.database().ref('/post-likes/'+postId+'/'+authorId).remove();
        firebase.database().ref('/posts/'+postId+'/dislikes').transaction((currentDBDislikes) => {
          return currentDBDislikes + 1;
        });
        firebase.database().ref('/posts/'+postId+'/likes').transaction((currentDBLikes) => {
          return currentDBLikes - (currentlyLiked ? 1 : 0);
        });
        resolve({disliked: true, liked: false, dislikes: currentDislikes + 1, likes: currentLikes + (currentlyLiked ? -1 : 0)});
      }
    });
  });
}



module.exports = {
  makeCancelable,
  defaultUserSettings,
  getUserByUid,
  createUserProfile,
  saveUserSettings,
  resetUserSettings,
  likePost,
  dislikePost,
  updateUserProfile,
}
