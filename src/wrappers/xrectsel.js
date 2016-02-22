import { exec } from '../utils';

export default function xrectsel() {
  return exec(`xrectsel`).then(res => {
    const [width, height, x, y] = res.split(/[\+x]+/);
    return { width, height, x, y };
  });
};
