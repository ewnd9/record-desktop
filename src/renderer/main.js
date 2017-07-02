import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';

const devConsole = console;
devConsole.log('welcome to record-desktop');

const context = require('electron-contextmenu-middleware');

context.use(require('electron-input-menu'));
context.use(require('electron-image-menu'));

context.activate();

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, IndexRoute, hashHistory } from 'react-router';

import Settings from './components/settings/settings';
import Gallery from './components/gallery/gallery';

const history = hashHistory;

const App = React.createClass({
  render() {
    return (
      <div>
        <div className="settings-bar">
          {
            this.props.location.pathname === '/' && (
              <div>
                <div>
                  <Link to={`/settings`}>
                    <span className="glyphicon glyphicon-cog" aria-hidden="true"></span>
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
    <Route path="settings" component={Settings} />
  </Route>
</Router>, document.getElementById('root'));
