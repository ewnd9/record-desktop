import test from 'ava';
import proxyquire from 'proxyquire';

test('slop old format', async t => {
  t.deepEqual(await getSlop('X=525\nY=705\nW=296\nH=168'), {
    height: '168',
    width: '296',
    x: '525',
    y: '705'
  });
});

test('slop new format', async t => {
  t.deepEqual(await getSlop('323x162+1316+247'), {
    height: '162',
    width: '323',
    x: '1316',
    y: '247'
  });
});

function getSlop(mock) {
  const slop = proxyquire.noCallThru().load('./slop', {
    '../utils': {
      exec: () => Promise.resolve(mock)
    },
    '../../utils': {
      log: () => {}
    }
  }).default;

  return slop();
}
