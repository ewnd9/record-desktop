import { exec } from '../utils';
import { log } from '../../utils';

export default function slop() {
  return exec('slop -f "%g"').then(res => {
    log(`slop: ${res}`);

    if (/^\d+x\d+\+\d+\+\d+/.test(res)) {
      const [dim, x, y] = res.split('+');
      const [width, height] = dim.split('x');

      return { width, height, x, y };
    } else {
      const [x, y, width, height] = res.split('\n').map(_ => _.split('=')[1]);
      return { width, height, x, y };
    }
  });
};
