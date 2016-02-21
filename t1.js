// import { createFifo, spawn, exec, recordGif } from './src/exec';
//
// const notify = text => console.log(text, new Date().getTime() - time);
// const time = new Date().getTime();
//
// const fn = (outputName) => {
//   notify('start ' + outputName);
//   const { promise, finish } = recordGif(outputName);
//
//   promise
//     .then(res => {
//       notify('Finish');
//     })
//     .catch(err => console.log(err));
//
//   setTimeout(() => {
//     notify('emitting end ' + outputName);
//     finish();
//   }, 3000);
// };
//
// setTimeout(() => fn(0), 0);
// setTimeout(() => fn(1), 5000);
// import { getActive } from './src/exec';
//
// getActive()
//   .then(res => {
//     console.log(res);
//   })
//   .catch(err => console.log(err));
var whereis = require('whereis');
whereis('wgeta', function(err, path) {
  console.log(path);
});
