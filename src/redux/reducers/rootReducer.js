import authReducer from "./authReducer";
import tenant from "./tenant"
import properties from "./properties"
import authReset from "./authReset"
import tenantReset from "./tenantReset"
import email from "./email"
import { combineReducers } from "redux";

const rootReducer = combineReducers({
  auth: authReducer,
  tenant,
  properties,
  authReset,
  tenantReset,
  email
});

export default rootReducer
