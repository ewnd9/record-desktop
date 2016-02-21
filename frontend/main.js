require('bootstrap/dist/css/bootstrap.min.css');
require('./index.css');

import { ipcRenderer } from 'electron';
import { NOTIFICATION } from './../shared/constants';

ipcRenderer.on(NOTIFICATION, (event, { text }) => {
  const myNotification = new Notification('Journal', {
    body: text
  });
});

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, IndexRoute, hashHistory } from 'react-router';

import ImageList from './components/image-list/image-list';
import Settings from './components/settings/settings';

const history = hashHistory;

const App = React.createClass({
  getInitialState() {
    return { path: '/' }
  },
  componentDidMount() {
    history.listen(path => {
      this.setState({ path: path.pathname });
    });
  },
  render() {
    return (
      <div>
        <div className="settings-bar">
          {
            this.state.path === '/' && (
              <Link to={`/settings`}>
                <span className="glyphicon glyphicon-cog" aria-hidden="true"></span>
              </Link>
            ) || (
              <Link to={`/`}>
                <span className="glyphicon glyphicon-cog" aria-hidden="true"></span>
              </Link>
            )
          }
        </div>
        <div className="main container-fluid">
          {this.props.children}
        </div>
      </div>
    );
  }
});

ReactDOM.render(<Router history={history}>
  <Route path="/" component={App}>
    <IndexRoute component={ImageList} />
    <Route path="settings" component={Settings} />
  </Route>
</Router>, document.getElementById('root'));
