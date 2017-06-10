function imageExists(url, key) {
  return new Promise((resolve, reject) => {
    let img = new Image();
    img.onload = () => {
      let newState = {};
      newState[key] = url;
      if(key === 'image') newState.wide = img.width > img.height*3/2;
      resolve(newState);
    };
    img.onerror = (e) => {
      console.log('error');
      resolve({[key]: null});
    };
    img.src = url;
  });
}

module.exports = imageExists
