'use strict';

/*
inspiration: https://github.com/wulkano/aperture
https://github.com/wulkano/aperture/pull/5/files
https://github.com/wulkano/aperture/pull/32
*/

const execa = require('execa');
const PCancelable = require('p-cancelable');

export function ffmpeg({ outputFile, fps = 30, x, y, width, height, offset = 0, showCursor }) {
  return new PCancelable((resolve, reject, onCancel) => {
    const args = ['-f', 'x11grab'];

    if (typeof width !== 'undefined') {
      if (offset > 0) {
        x = x - offset;
        y = y - offset;
        width = width + offset * 2;
        height = height + offset * 2;
      }

      args.push('-video_size', `${width}x${height}`);
      args.push('-i', `:0+${x},${y}`)
    } else {
      args.push('-i', ':0');
    }

    args.push('-y') // force overwrite existing file
    args.push('-framerate', fps, '-draw_mouse', +(showCursor === true), outputFile);

    const proc = execa('ffmpeg', args);

    proc.then(resolve, reject);
    onCancel(() => {
      proc.stdin.setEncoding('utf8');
      proc.stdin.write('q');
    });
  });
}

