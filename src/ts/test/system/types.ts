export const UPDATE_SESSION = 'UPDATE_SESSION';

export interface ISystemState {
  loggedIn: boolean;
  session: string;
  userName: string;
}

interface IUpdateSessionAction {
  type: typeof UPDATE_SESSION;
  payload: ISystemState;
}

export type TSystemActionTypes = IUpdateSessionAction;
