import { exec } from '../utils';

export default function slop() {
  return exec(`slop`).then(res => {
    const [x, y, width, height] = res.split('\n').map(_ => _.split('=')[1]);
    return { width, height, x, y };
  });
};
