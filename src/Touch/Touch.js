const LEFT = 'left';
const RIGHT = 'right';
const UP = 'up';
const DOWN = 'down';

function addSwipeListener(direction, _callback, element) {
  let xDown = null;
  let yDown = null;
  function handleTouchStart(evt) {
    xDown = evt.touches[0].clientX;
    yDown = evt.touches[0].clientY;
  };
  function handleTouchMove(evt, direction, _callback) {
    if ( ! xDown || ! yDown ) {
      return;
    }
    let xUp = evt.changedTouches[0].clientX;
    let yUp = evt.changedTouches[0].clientY;
    let xDiff = xDown - xUp;
    let yDiff = yDown - yUp;
    let dir = 0;
    if ( Math.abs(xDiff) > Math.abs(yDiff) ) {/*side not vertical*/
      if ( xDiff > 0 ) {
        /* left swipe */
        dir = LEFT;
      } else {
        /* right swipe */
        dir = RIGHT;
      }
    } else {/*vertical not side*/
      if ( yDiff > 0 ) {
        /* up swipe */
        dir = UP;
      } else {
        /* down swipe */
        dir = DOWN;
      }
    }
    /* call _callback when direction matches dir */
    if(direction === dir) {
      _callback();
    }
    /* reset values */
    xDown = null;
    yDown = null;
  };
  let handleTouchEnd = function(evt) {
    handleTouchMove(evt, direction, _callback);
  }
  let handleTouchBegin = function(evt) {
    handleTouchStart(evt);
  }
  element = element || document;
  element.addEventListener('touchstart', handleTouchStart, false);
  element.addEventListener('touchend', handleTouchEnd, false);
}

module.exports = {
  LEFT: LEFT,
  RIGHT: RIGHT,
  DOWN: DOWN,
  UP: UP,
  addSwipeListener: addSwipeListener,
}
