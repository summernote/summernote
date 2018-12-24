import { Lists } from './lists';
import { invertObject } from './func';

export const KEY_MAP = {
  'BACKSPACE': 8,
  'TAB': 9,
  'ENTER': 13,
  'SPACE': 32,
  'DELETE': 46,

  // Arrow
  'LEFT': 37,
  'UP': 38,
  'RIGHT': 39,
  'DOWN': 40,

  // Number: 0-9
  'NUM0': 48,
  'NUM1': 49,
  'NUM2': 50,
  'NUM3': 51,
  'NUM4': 52,
  'NUM5': 53,
  'NUM6': 54,
  'NUM7': 55,
  'NUM8': 56,

  // Alphabet: a-z
  'B': 66,
  'E': 69,
  'I': 73,
  'J': 74,
  'K': 75,
  'L': 76,
  'R': 82,
  'S': 83,
  'U': 85,
  'V': 86,
  'Y': 89,
  'Z': 90,

  'SLASH': 191,
  'LEFTBRACKET': 219,
  'BACKSLASH': 220,
  'RIGHTBRACKET': 221,
};

export function isEdit(keyCode: number): boolean {
  return Lists.contains([
    KEY_MAP.BACKSPACE,
    KEY_MAP.TAB,
    KEY_MAP.ENTER,
    KEY_MAP.SPACE,
    KEY_MAP.DELETE,
  ], keyCode);
}

export function isMove(keyCode: number): boolean {
  return Lists.contains([
    KEY_MAP.LEFT,
    KEY_MAP.UP,
    KEY_MAP.RIGHT,
    KEY_MAP.DOWN,
  ], keyCode);
}

export const nameFromCode = invertObject(KEY_MAP);
