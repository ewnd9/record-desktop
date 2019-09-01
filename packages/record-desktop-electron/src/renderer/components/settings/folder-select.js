import React from 'react';

import { remote } from 'electron';

export default class Settings extends React.Component {
  constructor(props) {
    super(props);

    const { getFolder } = remote.require('../dist/config');
    this.state = { folder: getFolder() };
  }

  onClick() {
    const { selectFolder } = remote.require('../dist/utils');
    const { setFolder } = remote.require('../dist/config');

    const result = selectFolder();

    if (result) {
      setFolder(result);
      this.setState(() => ({ folder: result }));
    }
  }

  render() {
    return (
      <div>
        <button className="btn btn-default" onClick={this.onClick}>
          { this.state.folder || 'Select a directory to save files' }
        </button>
      </div>
    );
  }
};
