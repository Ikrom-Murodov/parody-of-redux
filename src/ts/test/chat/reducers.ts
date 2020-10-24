import {
  IChatState,
  TChatActionTypes,
  SEND_MESSAGE,
  DELETE_MESSAGE,
} from './types';

const initialState: IChatState = {
  messages: [],
};

export function chatReducer(
  state = initialState,
  action: TChatActionTypes,
): IChatState {
  switch (action.type) {
    case SEND_MESSAGE:
      return {
        messages: [...state.messages, action.payload],
      };

    case DELETE_MESSAGE:
      return {
        messages: state.messages.filter(
          (message) => message.timestamp !== action.meta.timestamp,
        ),
      };

    default:
      return state;
  }
}
