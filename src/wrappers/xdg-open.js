import { exec } from '../utils';

export default function xdgOpen(file) {
  return exec(`xdg-open ${file}`);
};
