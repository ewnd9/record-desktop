import React from 'react';

import { remote } from 'electron';

export default React.createClass({
  getInitialState() {
    const { getFolder } = remote.require('../dist/config');
    return { folder: getFolder() };
  },
  onClick() {
    const { selectFolder } = remote.require('../dist/utils');
    const { setFolder } = remote.require('../dist/config');

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
