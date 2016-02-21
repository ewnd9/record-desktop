import React from 'react';
import styles from './style.css';

import remote from 'remote';
const remoteBinaries = remote.require(process.env.APP_DIR + '/dist/binaries');

export default React.createClass({
  getInitialState() {
    return { binaries: [] };
  },
  componentDidMount() {
    remoteBinaries
      .getBinaries()
      .then(binaries => this.setState({ binaries }))
      .catch(err => console.log(err));
  },
  render() {
    return (
      <div className={styles.container}>
        {
          this.state.binaries.map(binary => (
            <div key={binary.name} className={styles.buttonWrapper}>
              <button className={`btn btn-lg ${styles.button} ${!!binary.path ? '' : 'btn-danger'}`}>{binary.name}</button>
              <div>
                {
                  binary.description.map((description, index) => (
                    <div key={index} className={styles.description}>{description}</div>
                  ))
                }
              </div>
            </div>
          ))
        }
      </div>
    );
  }
});
