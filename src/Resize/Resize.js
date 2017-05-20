function addEndEventListener(element, event, _callback, timeout) {
  let endTimer;
  element.addEventListener(event, function(evt) {
    clearTimeout(endTimer);
    endTimer = setTimeout(function() {
      _callback(evt);
    }, timeout);
  });
}

module.exports = {
  addEndEventListener
};
