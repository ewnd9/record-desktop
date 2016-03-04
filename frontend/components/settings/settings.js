import React from 'react';
import styles from './style.css';
import remote from 'remote';

const shortcuts = remote.require('../dist/shortcuts');
const actions = shortcuts.actions;

const config = remote.require('../dist/config');
const { getFolder, setFolder, getScreenshotEffect, setScreenshotEffect, path, getCombo, setCombo } = config;

const { selectFolder } = remote.require('../dist/utils');

const Input = React.createClass({
  getInitialState() {
    return { isCorrect: true, active: getCombo(this.props.action) };
  },
  onKeyPress(event) {
    shortcuts.unregister(this.state.active);

    const combo = event.target.value;
    const isCorrect = shortcuts.register(this.props.action, combo);

    if (isCorrect) {
      config.setCombo(this.props.action, combo);
      this.setState({ isCorrect, active: combo });
    } else {
      this.setState({ isCorrect });
    }
  },
  render() {
    const { label } = this.props;

    return (
      <div className={`form-group form-group-lg ${styles.input} ${this.state.isCorrect ? '' : 'has-error'}`}>
        <div>
          <span htmlFor={label}>
            {label}
          </span>
        </div>
        <input id={label}
               type="text"
               className="form-control"
               placeholder="Enter the combination"
               defaultValue={this.state.active}
               onChange={this.onKeyPress} />
      </div>
    );
  }
});

const FolderSelect = React.createClass({
  getInitialState() {
    return { folder: getFolder() };
  },
  onClick() {
    const result = selectFolder();

    if (result) {
      setFolder(result);
      this.setState({ folder: result });
    }
  },
  render() {
    return (
      <div>
        <button className="btn btn-default" onClick={this.onClick}>
          { this.state.folder || 'Select a directory to save files' }
        </button>
      </div>
    );
  }
});

const ShadowSelect = React.createClass({
  getInitialState: () => ({ value: getScreenshotEffect() }),
  onChange(e) {
    const value = e.target.value;
    setScreenshotEffect(value);

    this.setState({ value });
  },
  render() {
    return (
      <div>
        <div className="form-group">
          <label htmlFor="sel1">Screenshot effect</label>
          <select className="form-control" id="sel1" value={this.state.value} onChange={this.onChange}>
            <option value="shadow">Shadow</option>
            <option value="none">None</option>
          </select>
        </div>
      </div>
    );
  }
});

export default React.createClass({
  getInitialState() {
    return { actions };
  },
  render() {
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
              const { label, combo } = this.state.actions[key];
              return <Input key={label} label={label} combo={combo} action={key} />;
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
      </div>
    );
  }
});
