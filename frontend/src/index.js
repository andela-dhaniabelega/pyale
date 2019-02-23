import React from 'react';
import ReactDOM from 'react-dom';
import HomeOne from './HomeOne';
import HomeTwo from './HomeTwo';
import HomeThree from './HomeThree';
import HomeFour from './HomeFour';
import HomeFive from './HomeFive';
import HomeSix from './HomeSix';
import HomeSeven from './HomeSeven';
import HomeEight from './HomeEight';
import HomeNine from './HomeNine';
import Login from './Login';
import SignUp from './SignUp';
import PropertyDetail from './PropertyDetail';
import PasswordForget from './PasswordForget';
import Properties from './Properties';
import TenantPortal from './TenantPortal'
import registerServiceWorker from './registerServiceWorker';
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom';
import {connect, Provider} from 'react-redux';
import {loadUser} from './store/actions/authActions';
import {persistor, store} from "./store/configureStore";
import { PersistGate } from 'redux-persist/integration/react'

class Root extends React.Component {
  // componentDidMount() {
  //   this.props.loadUser();
  // }

  // PrivateRoute = ({component: ChildComponent, ...rest}) => {
  //   return <Route {...rest} render={props => {
  //     if (!this.props.isAuthenticated) {
  //       return <Redirect to="/login"/>;
  //     } else {
  //       return <ChildComponent {...props} />
  //     }
  //   }}/>
  // };

  render() {
    return (
      <BrowserRouter basename={'/'}>
        <Switch>
          <Route exact path='/' component={HomeTwo}/>
          <Route path={`${process.env.PUBLIC_URL}/home-one`} component={HomeOne}/>
          <Route path={`${process.env.PUBLIC_URL}/home-two`} component={HomeTwo}/>
          <Route path={`${process.env.PUBLIC_URL}/home-three`} component={HomeThree}/>
          <Route path={`${process.env.PUBLIC_URL}/home-four`} component={HomeFour}/>
          <Route path={`${process.env.PUBLIC_URL}/home-five`} component={HomeFive}/>
          <Route path={`${process.env.PUBLIC_URL}/home-six`} component={HomeSix}/>
          <Route path={`${process.env.PUBLIC_URL}/home-seven`} component={HomeSeven}/>
          <Route path={`${process.env.PUBLIC_URL}/home-eight`} component={HomeEight}/>
          <Route path={`${process.env.PUBLIC_URL}/home-nine`} component={HomeNine}/>
          <Route exact path='/login' component={Login}/>
          <Route exact path='/detail' component={PropertyDetail}/>
          <Route exact path='/properties' component={Properties}/>
          <Route exact path='/portal' component={TenantPortal}/>
          <Route path='/password-forget' component={PasswordForget}/>
          <Route path='/sign-up' component={SignUp}/>
        </Switch>
      </BrowserRouter>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.isAuthenticated,
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    loadUser: () => dispatch(loadUser())
  }
};

let RootContainer = connect(mapStateToProps, mapDispatchToProps)(Root);

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <RootContainer/>
        </PersistGate>
      </Provider>
    )
  }
}

ReactDOM.render(<App/>, document.getElementById('root'));
registerServiceWorker();
