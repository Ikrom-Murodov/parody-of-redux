export const SEND_MESSAGE = 'SEND_MESSAGE';
export const DELETE_MESSAGE = 'DELETE_MESSAGE';

export interface IMessage {
  user: string;
  message: string;
  timestamp: number;
}

export interface IChatState {
  messages: IMessage[];
}

export interface ISendMessageAction {
  type: typeof SEND_MESSAGE;
  payload: IMessage;
}

export interface IDeleteMessageAction {
  type: typeof DELETE_MESSAGE;
  meta: {
    timestamp: number;
  };
}

export type TChatActionTypes = ISendMessageAction | IDeleteMessageAction;
