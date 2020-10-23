import {
  IMessage,
  TChatActionTypes,
  DELETE_MESSAGE,
  SEND_MESSAGE,
} from './types';

export function sendMessage(newMessage: IMessage): TChatActionTypes {
  return {
    type: SEND_MESSAGE,
    payload: newMessage,
  };
}

export function deleteMessage(timestamp: number): TChatActionTypes {
  return {
    type: DELETE_MESSAGE,
    meta: {
      timestamp,
    },
  };
}
