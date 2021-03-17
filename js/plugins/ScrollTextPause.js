//=============================================================================
/*:
 * @plugindesc Pause scrolling text while holding the specified button. (1.01)
 * 
 * @author mo-to
 *
 * @help Mouse isn't supported at this time
 * The ok button can not be used for fast forward.
 * If you make a mistake, the pause function will be disabled.
 *
 * @param ButtonType
 * @desc Button for pause (default:down, up, left, right. cancel, pageup, pagedown)
 * @default down
 */ 
//=============================================================================

(function() {

  var parameters = PluginManager.parameters('ScrollTextPause');
  var ButtonType = String(parameters['ButtonType'] != 'ok' && parameters['ButtonType']);
  
  var _Window_ScrollText_scrollSpeed = Window_ScrollText.prototype.scrollSpeed;

  Window_ScrollText.prototype.scrollSpeed = function() {
      var speed = $gameMessage.scrollSpeed() / 2;
      if  (this.isStopForward()) {
          return speed *= 0;
      }
    //   if ($gameTimer.seconds() == 1) //TODO to add for timing scrolling text later
    //   {
    //       console.log(this);
    //   }
      return _Window_ScrollText_scrollSpeed.call(this);
  };
  
  //
  //★　Scroll pause control (mouse not supported)
  //
  Window_ScrollText.prototype.isStopForward = function() {
      return (Input.isPressed(ButtonType));
  };

  var _Window_ScrollText_updateMessage = Window_ScrollText.prototype.updateMessage;

  //Every line of text is 36. So find the precise line height you want to end at and add it to a varible..
  Window_ScrollText.prototype.updateMessage = function() {
    this.origin.y += this.scrollSpeed();
    if (this.origin.y >= this.contents.height) {
        this.terminateMessage();
    }
    if (this.origin.y >= $gameVariables.value(36))
    {
        this.terminateMessage();
    }
    };
  
})();
