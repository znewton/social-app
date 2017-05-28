const firebase = require('firebase');

const defaultUserSettings = {
  notifications: true,
  ads: true,
};

function createUserProfile(user) {
  firebase.database().ref('/users/'+user.uid).set({
    displayName: user.email.match(/^([^@]*)@/)[1],
    friends: [],
    bio: '',
    settings: defaultUserSettings,
  });
}

function resetUserSettings() {
  return new Promise((resolve, reject) => {
    firebase.database().ref('/users/'+firebase.auth().currentUser.uid).set({
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



module.exports = {
  defaultUserSettings: defaultUserSettings,
  getUserByUid: getUserByUid,
  createUserProfile: createUserProfile,
  saveUserSettings: saveUserSettings,
  resetUserSettings: resetUserSettings,
}
