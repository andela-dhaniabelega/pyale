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
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { createStore, applyMiddleware } from "redux";
import { Provider } from 'react-redux';
import rootReducer from "./store/reducers/rootReducer";
import thunk from 'redux-thunk';

const store = createStore(rootReducer, applyMiddleware(thunk));

class Root extends React.Component {
  render() {
  	return(
  		<BrowserRouter basename={'/'} >
		  	<Switch>
			  <Route exact path={`${process.env.PUBLIC_URL}/`} component={HomeTwo}/>
			  <Route path={`${process.env.PUBLIC_URL}/home-one`} component={HomeOne}/> 
			  <Route path={`${process.env.PUBLIC_URL}/home-two`} component={HomeTwo}/> 
			  <Route path={`${process.env.PUBLIC_URL}/home-three`} component={HomeThree}/> 
			  <Route path={`${process.env.PUBLIC_URL}/home-four`} component={HomeFour}/> 
			  <Route path={`${process.env.PUBLIC_URL}/home-five`} component={HomeFive}/> 
			  <Route path={`${process.env.PUBLIC_URL}/home-six`} component={HomeSix}/> 
			  <Route path={`${process.env.PUBLIC_URL}/home-seven`} component={HomeSeven}/> 
			  <Route path={`${process.env.PUBLIC_URL}/home-eight`} component={HomeEight}/> 
			  <Route path={`${process.env.PUBLIC_URL}/home-nine`} component={HomeNine}/>  
			  <Route exact path={`${process.env.PUBLIC_URL}/login`} component={Login}/>
			  <Route exact path={`${process.env.PUBLIC_URL}/detail`} component={PropertyDetail}/>
			  <Route exact path={`${process.env.PUBLIC_URL}/properties`} component={Properties}/>
			  <Route exact path={`${process.env.PUBLIC_URL}/portal`} component={TenantPortal}/>
			  <Route path={`${process.env.PUBLIC_URL}/password-forget`} component={PasswordForget}/>
			  <Route path={`${process.env.PUBLIC_URL}/sign-up`} component={SignUp}/>  
			</Switch>
		</BrowserRouter>
  	);
  }
 }

ReactDOM.render(<Provider store={store}><Root /></Provider>, document.getElementById('root'));
registerServiceWorker();
