import React from 'react';
import styles from './style.css';

import { remote } from 'electron';

export default React.createClass({
  getInitialState() {
    const { getCombo } = remote.require('../dist/config');
    return { isCorrect: true, active: getCombo(this.props.action) };
  },
  onKeyPress(event) {
    const { setCombo } = remote.require('../dist/config');

    const shortcuts = remote.require('../dist/shortcuts');
    shortcuts.unregister(this.state.active);

    const combo = event.target.value;
    const isCorrect = shortcuts.register(this.props.action, combo);

    if (isCorrect) {
      setCombo(this.props.action, combo);
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
