import React from 'react';
import ReactDOM from 'react-dom';
import Login from './pages/Login';
import PropertyDetail from './pages/PropertyDetail';
import PasswordForget from './pages/PasswordForget';
import Properties from './pages/Properties';
import TenantPortal from './pages/TenantPortal'
import registerServiceWorker from './registerServiceWorker';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {Provider} from 'react-redux';
import {persistor, store} from "./store/configureStore";
import {PersistGate} from 'redux-persist/integration/react'
import TenantDocument from "./pages/TenantDocument";
import PasswordReset from "./pages/PasswordReset";
import PasswordChange from "./pages/PasswordChange";
import Settings from "./pages/Settings";
import HomeFour from "./HomeFour";


class Root extends React.Component {
  render() {
    return (
      <BrowserRouter basename={'/'}>
        <Switch>
          <Route exact path='/' component={HomeFour}/>
          <Route exact path='/login' component={Login}/>
          <Route exact path='/detail' component={PropertyDetail}/>
          <Route exact path='/properties' component={Properties}/>
          <Route exact path='/portal' component={TenantPortal}/>
          <Route exact path='/forgot_password' component={PasswordForget}/>
          <Route exact path='/password_reset' component={PasswordReset}/>
          <Route exact path='/password_change' component={PasswordChange}/>
          <Route exact path='/documents' component={TenantDocument}/>
          <Route exact path='/settings' component={Settings}/>
        </Switch>
      </BrowserRouter>
    );
  }
}

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <Root/>
    </PersistGate>
  </Provider>
  ,document.getElementById('root'));
registerServiceWorker();
