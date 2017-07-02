import { exec } from '../utils';

export default function xwininfo() {
  return exec(`xwininfo -id $(xdotool getactivewindow)`)
    .then(res => {
      const lines = res.split('\n');
      const fn = ind => +(lines[ind].split(':')[1].trim());

      return {
        x: fn(2),
        y: fn(3),
        width: fn(6),
        height: fn(7)
      };
    });
};
