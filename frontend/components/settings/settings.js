import React from 'react';
import styles from './style.css';
import remote from 'remote';

import { SELECT_FOLDER, UPDATE_FOLDER } from './../../../shared/constants';
import { ipcRenderer } from 'electron';

const { register, unregister, actions } = remote.require(process.env.APP_DIR + '/dist/register-shortcuts');
const { getFolder, path, getCombo, setCombo } = remote.require(process.env.APP_DIR + '/dist/config');

const Input = React.createClass({
  getInitialState() {
    return { isCorrect: true, active: getCombo(this.props.action) };
  },
  onKeyPress(event) {
    unregister(this.state.active);

    const combo = event.target.value;
    const isCorrect = register(this.props.action, combo);

    if (isCorrect) {
      setCombo(this.props.action, combo);
      this.setState({ isCorrect, active: combo });
    } else {
      this.setState({ isCorrect });
    }
  },
  render() {
    const { label, action } = this.props;

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
  componentDidMount: function() {
    ipcRenderer.on(UPDATE_FOLDER, () => {
      this.setState({ folder: getFolder() });
    });
  },
  componentWillUnmount: function() {
    ipcRenderer.removeAllListeners(UPDATE_FOLDER);
  },
  onClick(event) {
    ipcRenderer.send(SELECT_FOLDER);
  },
  render() {
    return (
      <div>
        <button className="btn btn-default" onClick={this.onClick}>
          { this.state.folder || 'Browse' }
        </button>
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
        <FolderSelect />
        {
          Object.keys(actions).map(key => {
            const { label, combo } = this.state.actions[key];
            return <Input key={label} label={label} combo={combo} action={key} />;
          })
        }

        <div>
          {path}
        </div>
      </div>
    );
  }
});
