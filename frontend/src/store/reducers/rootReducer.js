import authReducer from "./authReducer";
import tenant from "./tenant"
import { combineReducers } from "redux";

const rootReducer = combineReducers({
  auth: authReducer,
  tenant
});

export default rootReducer
