import {
  globalShortcut,
} from 'electron';

export const register = (action, combo) => {
  try {
    return globalShortcut.register(combo, () => {
      console.log(`press ${combo}`); // it won't work if i delete this line (GC?)
    });
  } catch (e) {
    return false;
  }
};

export const unregister = combo => {
  try {
    return globalShortcut.unregister(combo);
  } catch (e) {
    return false;
  }
};
