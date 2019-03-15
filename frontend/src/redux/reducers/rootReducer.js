import authReducer from "./authReducer";
import tenant from "./tenant"
import properties from "./properties"
import authReset from "./authReset"
import { combineReducers } from "redux";

const rootReducer = combineReducers({
  auth: authReducer,
  tenant,
  properties,
  authReset
});

export default rootReducer
