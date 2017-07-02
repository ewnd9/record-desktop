import React from 'react';

import { remote } from 'electron';

export default React.createClass({
  getInitialState: () => {
    const { getHasNotifications } = remote.require('../dist/config');
    return { value: getHasNotifications() }
  },
  onChange(e) {
    const value = e.target.value === 'true';

    const { setHasNotifications } = remote.require('../dist/config');
    setHasNotifications(value);

    this.setState({ value });
  },
  render() {
    const { value } = this.state;

    return (
      <div>
        <div className="form-group">
          <div>
            <label htmlFor="foo_controls">Notifications</label>
          </div>

          <div className="btn-group" data-toggle="buttons">
            <label className={`btn btn-primary ${value === true ? 'active' : ''}`}>
              <input type="checkbox" onChange={this.onChange} value={true} /> Enabled
            </label>
            <label className={`btn btn-primary ${value !== true ? 'active' : ''}`}>
              <input type="checkbox" onChange={this.onChange} value={false} /> Disabled
            </label>
          </div>
        </div>
      </div>
    );
  }
});
