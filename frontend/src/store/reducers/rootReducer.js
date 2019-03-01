import authReducer from "./authReducer";
import tenant from "./tenant"
import properties from "./properties"
import { combineReducers } from "redux";

const rootReducer = combineReducers({
  auth: authReducer,
  tenant,
  properties
});

export default rootReducer
