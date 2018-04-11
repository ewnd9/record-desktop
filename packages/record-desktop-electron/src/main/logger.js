import winston from 'winston';
import notifier from 'node-notifier';
import { getHasNotifications } from './config';

const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)(),
    new (winston.transports.File)({ filename: '/tmp/record-desktop' })
  ]
});

export const log = logger.info.bind(logger);
export const notify = (text, err) => {
  log(text, err || '');

  if (getHasNotifications()) {
    notifier.notify({
      title: 'record-desktop',
      message: text + (err ? ' ' + err.message : '')
    });
  }
};
