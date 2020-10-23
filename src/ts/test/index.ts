import * as chat from '@/redux-test/chat';
import * as system from '@/redux-test/system';

const actions = {
  ...chat.chatActions,
  ...system.systemActions,
};

const reducers = {
  ...chat.chatReducers,
  ...system.systemReducers,
};

type TRootActions =
  | chat.chatTypes.TChatActionTypes
  | system.systemTypes.TSystemActionTypes;

export { TRootActions, actions, reducers };
