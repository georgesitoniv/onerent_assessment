import { FETCH_PROPERTIES } from "../actions";

export default (state = null, action) => {
  switch(action.type){
    case FETCH_PROPERTIES:
      return action.payload;
    default:
      return state
  }
}
