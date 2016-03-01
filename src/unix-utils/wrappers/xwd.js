import { exec } from '../utils';

export default function xwd(width, height, x, y, outputFile) {
  return exec(`xwd -silent -root | convert - -crop ${width}x${height}+${x}+${y} ${outputFile}`);
};
