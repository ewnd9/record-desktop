import { exec } from '../utils';

export default function slop() {
  return exec(`slop -f%g`).then(res => {
    const [dim, x, y] = res.split('+');
    const [width, height] = dim[0].split('x');
    return { width, height, x, y };
  });
};
