import React from 'react';
import styles from './style.css';

import { remote } from 'electron';

import ShortcutInput from './shortcut-input';
import FolderSelect from './folder-select';
import ShadowSelect from './shadow-select';
import HasNotificationsInput from './has-notifications-input';

export default React.createClass({
  render() {
    const { path } = remote.require('../dist/config');
    const { actions } = remote.require('../dist/shortcuts');

    return (
      <div className={styles.container}>
        <section>
          <FolderSelect />
        </section>

        <section>
          <div className={styles.shortcutsContainer}>
            <div>Examples of available shortcuts:</div>
            <div className={styles.codeContainer}>
              <div><span className={styles.code}>{'ctrl+shift+z'}</span></div>
              <div><span className={styles.code}>{'alt+d'}</span></div>
              <div><span className={styles.code}>{'super+a'}</span></div>
            </div>
            <div>
              <div>There is some onKeyPress validation so just try to write down some shortcuts and it will be red if shortcut is not available or incorrect</div>
              <div>More on <a href="https://github.com/atom/electron/blob/master/docs/api/accelerator.md">electron api</a></div>
            </div>
          </div>
        </section>

        <section>
          {
            Object.keys(actions).map(key => {
              const { label, combo } = actions[key];
              return <ShortcutInput key={label} label={label} combo={combo} action={key} />;
            })
          }
        </section>

        <section className={styles.codeContainer}>
          <div>Config:{' '}<span className={styles.code}>{path}</span></div>
          <div>Logs:{' '}<span className={styles.code}>{'/tmp/record-desktop'}</span></div>
        </section>

        <section className={styles.shadowSelectContainer}>
          <ShadowSelect />
        </section>

        <section>
          <HasNotificationsInput />
        </section>
      </div>
    );
  }
});
