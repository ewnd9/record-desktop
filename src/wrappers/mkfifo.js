import { exec, execSync, spawnAsync } from '../utils';

import path from 'path';

export default function mkfifo() {
  const file = `/tmp/fifo-${Math.random()}`;
  execSync(`rm -f ${file} && mkfifo ${file}`);

  const proc = spawnAsync(`sh`, [path.resolve(__dirname, '..', '..', 'cat.sh'), file]);
  const onEnd = () => proc.kill();

  proc.stdout.pipe(process.stdout);
  proc.stderr.pipe(process.stderr);

  return { onEnd, file };
};
