function addEndEventListener(element, event, _callback, timeout) {
  let endTimer;
  element.addEventListener(event, function(evt) {
    clearTimeout(endTimer);
    endTimer = setTimeout(function() {
      _callback(evt);
    }, timeout);
  });
}

function addOneTimeEvent(element, event, _callback) {
  let handler = () => {
      _callback();
      element.removeEventListener(event, handler);
  }
  element.addEventListener(event, handler);
}

module.exports = {
  addEndEventListener,
  addOneTimeEvent,
};
