import { exec } from '../utils';

// kudos to Glutanimate, taken from https://github.com/ewnd9/dotfiles/blob/72218bd63c0d44b0e74c1a346625cbdc1f44bb40/dropshadow.sh
const shadow = '\\( +clone -background black -shadow 80x20+0+15 \\) +swap -background transparent -layers merge +repage';

export default function xwd(width, height, x, y, outputFile, effect) {
  return exec(`xwd -silent -root | convert xwd:- -crop ${width}x${height}+${x}+${y} ${effect === 'shadow' ? shadow : ''} ${outputFile}`);
};
