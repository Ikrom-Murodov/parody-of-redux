import { ISystemState, UPDATE_SESSION, TSystemActionTypes } from './types';

export function updateSession(newSession: ISystemState): TSystemActionTypes {
  return {
    type: UPDATE_SESSION,
    payload: newSession,
  };
}
