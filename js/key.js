/**
 * summernote.js
 * (c) 2013~ Youngteac Hong
 * summernote may be freely distributed under the MIT license./
 */
"use strict";
define('key', function() {
  var keyset = {
	  BACKSPACE	: 8,
	  TAB			: 9,
	  ENTER		: 13,
	  SHIFT		: 16,
	  CTRL		: 17,
	  ALT			: 18,
	  PAUSE		: 19,
	  CAPSLOCK	: 20,
	  ESC			: 27,
	  SPACE		: 32,
	  PAGEUP		: 33,
	  PAGEDOWN	: 34,
	  END			: 35,
	  HOME		: 36,
	  LEFT		: 37,
	  UP			: 38,
	  RIGHT		: 39,
	  DOWN		: 40,
	  PRINTSCREEN	: 44,
	  INSERT		: 45,
	  MINUS		: 45,
	  DEL			: 46,
	  NUM0		: 48,
	  NUM1		: 49,
	  NUM2		: 50,
	  NUM3		: 51,
	  NUM4		: 52,
	  NUM5		: 53,
	  NUM6		: 54,
	  NUM7		: 55,
	  NUM8		: 56,
	  NUM9		: 57,
	  A			: 65,
	  B			: 66,
	  C			: 67,
	  D			: 68,
	  E			: 69,
	  F			: 70,
	  I			: 73,
	  K			: 75,
	  L			: 76,
	  M			: 77,
	  N			: 78,
	  O			: 79,
	  P			: 80,
	  Q			: 81,
	  R			: 82,
	  S			: 83,
	  T			: 84,
	  U			: 85,
	  V			: 86,
	  X			: 88,
	  Y			: 89,
	  Z			: 90,
	  WINKEY		: 91,
	  FUNCKEY		: 93,
	  NUMPAD0		: 96,
	  NUMPAD1		: 97,
	  NUMPAD2		: 98,
	  NUMPAD3		: 99,
	  NUMPAD4		: 100,
	  NUMPAD5		: 101,
	  NUMPAD6		: 102,
	  NUMPAD7		: 103,
	  NUMPAD8		: 104,
	  NUMPAD9		: 105,
	  F1			: 112,
	  F2			: 113,
	  F3			: 114,
	  F4			: 115,
	  F5			: 116,
	  F6			: 117,
	  F7			: 118,
	  F8			: 119,
	  F9			: 120,
	  F10			: 121,
	  F11			: 122,
	  F12			: 123,
	  SCROLLLOCK	: 145,
	  SEMICOLONE	: 186,
	  SEMICOLONE_FF : 59,
	  COMMA		: 188,
	  PERIOD		: 190,
	  SLASH		: 191,
	  GRAVE_ACCENT: 192,
	  SQBRACKET_STR	: 219,
	  SQBRACKET_END	: 221,
	  
	  getArrowString : function(keyCode) {
		  if (keyCode == keyset.LEFT) {
			  return 'left';
		  } else if (keyCode == keyset.RIGHT) {
			  return 'right';
		  } else if (keyCode == keyset.UP) {
			  return 'up';
		  } else if (keyCode == keyset.DOWN) {
			  return 'down';
		  } else{
        return "";
		  }
	  },
    
    isHangul :  function(str) {
      return /[ㄱ-힣]/.test(str);
    },

    isNumber : function(keyCode) {
      return keyCode >= keyset.NUM0 && keyCode <= keyset.NUM9;
    },
	  
	  isModifier : function(keyCode) {
		  return keyCode == keyset.SHIFT || keyCode == keyset.CTRL || keyCode == keyset.ALT;
	  },
	  
	  isArrow : function(keyCode) {
		  return keyCode == keyset.UP || keyCode == keyset.DOWN || keyCode == keyset.LEFT || keyCode == keyset.RIGHT; 
	  },
	  
	  isKeyMove : function(keyCode) {
		  return keyset.PAGEUP <= keyCode && keyCode <= keyset.DOWN;
	  },
	  
	  isBackspace : function(keyCode) {
		  return keyCode == keyset.BACKSPACE || keyCode == keyset.DEL; 
	  }
  };

  return keyset;
});
