import React from 'react';
import styles from './style.css';
import remote from 'remote';

const { register, unregister } = remote.require(process.env.APP_DIR + '/dist/register-shortcuts');

const Input = React.createClass({
  getInitialState() {
    return { isCorrect: true, active: this.props.combo };
  },
  onKeyPress(event) {
    unregister(this.state.active);

    const combo = event.target.value;
    const isCorrect = register('asd', combo);

    if (isCorrect) {
      this.setState({ isCorrect, active: combo });
    } else {
      this.setState({ isCorrect });
    }
  },
  render() {
    const { label, combo } = this.props;

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
               defaultValue={combo}
               onChange={this.onKeyPress} />
      </div>
    );
  }
});

export default React.createClass({
  getInitialState() {
    const RECORD_AREA = 'RECORD_AREA';
    const RECORD_ACTIVE = 'RECORD_ACTIVE';
    const STOP = 'STOP';
    const SCREEN_AREA = 'SCREEN_AREA';
    const SCREEN_ACTIVE = 'SCREEN_ACTIVE';

    const obj = (label, combo) => ({ label, combo });

    const actions = {
      [RECORD_AREA]: obj('Start recording an area', 'super+a'),
      [RECORD_ACTIVE]: obj('Start recording an active window', 'super+z'),
      [STOP]: obj('Stop recording', 'super+d'),
      [SCREEN_AREA]: obj('Take a screenshot of an area', 'super+s'),
      [SCREEN_ACTIVE]: obj('Take a screenshot of an active window', 'super+x')
    };

    return { actions };
  },
  render() {
    return (
      <div className={styles.container}>
        {
          Object.keys(this.state.actions).map(key => {
            const { label, combo } = this.state.actions[key];
            return <Input key={label} label={label} combo={combo} />;
          })
        }
      </div>
    );
  }
});
