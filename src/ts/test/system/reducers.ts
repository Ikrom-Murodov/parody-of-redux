import { ISystemState, TSystemActionTypes, UPDATE_SESSION } from './types';

const initialState: ISystemState = {
  loggedIn: false,
  session: '',
  userName: '',
};

export function systemReducer(
  state = initialState,
  action: TSystemActionTypes,
): ISystemState {
  switch (action.type) {
    case UPDATE_SESSION: {
      return { ...state, ...action.payload };
    }

    default:
      return state;
  }
}
