import execa from 'execa';

export function wmctrl(args) {
  return execa('wmctrl', args);
}

export function openTag(tagIndex) {
  return wmctrl(['-s', tagIndex]);
}
