import React from 'react';
import styles from './style.css';
import remote from 'remote';

const { register, unregister, actions } = remote.require(process.env.APP_DIR + '/dist/register-shortcuts');

const Input = React.createClass({
  getInitialState() {
    return { isCorrect: true, active: this.props.combo };
  },
  onKeyPress(event) {
    unregister(this.state.active);

    const combo = event.target.value;
    const isCorrect = register(this.props.action, combo);

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
    return { actions };
  },
  render() {
    return (
      <div className={styles.container}>
        {
          Object.keys(actions).map(key => {
            const { label, combo } = this.state.actions[key];
            return <Input key={label} label={label} combo={combo} action={key} />;
          })
        }
      </div>
    );
  }
});
