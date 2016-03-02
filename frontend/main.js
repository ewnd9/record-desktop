require('bootstrap/dist/css/bootstrap.min.css');
require('./index.css');

console.log('welcome to record-desktop');

import { ipcRenderer } from 'electron';
import { NOTIFICATION } from './../shared/constants';

ipcRenderer.on(NOTIFICATION, (event, { text }) => {
  console.log(text);
  new Notification('record-desktop', {
    body: text
  });
});

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, IndexRoute, hashHistory } from 'react-router';

import Settings from './components/settings/settings';
import Binaries from './components/binaries/binaries';
import Gallery from './components/gallery/gallery';

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
              <div>
                <div>
                  <Link to={`/binaries`}>
                    <span className="glyphicon glyphicon-asterisk" aria-hidden="true"></span>
                  </Link>
                </div>
              </div>
            ) || (
              <Link to={`/`}>
                <span className="glyphicon glyphicon-ok" aria-hidden="true"></span>
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
    <IndexRoute component={Gallery} />
    <Route path="binaries" component={Binaries} />
    <Route path="settings" component={Settings} />
  </Route>
</Router>, document.getElementById('root'));
