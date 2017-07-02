import React from 'react';

import { remote } from 'electron';

export default React.createClass({
  getInitialState: () => {
    const { getScreenshotEffect } = remote.require('../dist/config');
    return { value: getScreenshotEffect() }
  },
  onChange(e) {
    const value = e.target.value;

    const { setScreenshotEffect } = remote.require('../dist/config');
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
