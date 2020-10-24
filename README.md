# Parody of redux library.

##### This library uses webpack. I added my webpack config to the project. You can learn more [here](https://github.com/Ikrom-Murodov/Webpack-4).

This library is a parody of redux library.

### Installation.
```
npm parody-of-redux-library
```

# Usage example.


### Type Checking State.

Adding types to each slice of state is a good place to start since it does not rely on other types. In this example we start by describing the chat reducer's slice of state:

```ts
// src/store/chat/types.ts

export interface IMessage {
  user: string;
  message: string;
  timestamp: number;
}

export interface IChatState {
  messages: IMessage[];
}
```

And then do the same for the system reducer's slice of state:


```ts
// src/store/system/types.ts

export interface ISystemState {
  loggedIn: boolean;
  session: string;
  userName: string;
}
```
Note that we are exporting these interfaces to reuse them later in reducers and action creators.


### Type Checking Actions & Action Creators.

We will be using string literals and using typeof to declare our action constants and infer types.
Note that we are making a tradeoff here when we declare our types in a separate file.
In exchange for separating our types into a separate file,
we get to keep our other files more focused on their purpose.
While this tradeoff can improve the maintainability of the codebase,
it is perfectly fine to organize your project however you see fit.

Chat Action Constants & Shape:

```ts
// src/store/chat/types.ts
export const SEND_MESSAGE = 'SEND_MESSAGE';
export const DELETE_MESSAGE = 'DELETE_MESSAGE';

interface ISendMessageAction {
  type: typeof SEND_MESSAGE;
  payload: IMessage;
}

interface IDeleteMessageAction {
  type: typeof DELETE_MESSAGE;
  meta: {
    timestamp: number;
  };
}

export type TChatActionTypes = ISendMessageAction | IDeleteMessageAction;
```
Note that we are using TypeScript's Union Type here to express all possible actions.

With these types declared we can now also type check chat's action creators. In this case we are taking advantage of TypeScript's inference:

```ts
// src/store/chat/actions.ts

import {
  IMessage,
  SEND_MESSAGE,
  DELETE_MESSAGE,
  TChatActionTypes,
} from './types';

// TypeScript infers that this function is returning SendMessageAction
export function sendMessage(newMessage: IMessage): TChatActionTypes {
  return {
    type: SEND_MESSAGE,
    payload: newMessage,
  };
}

// TypeScript infers that this function is returning DeleteMessageAction
export function deleteMessage(timestamp: number): TChatActionTypes {
  return {
    type: DELETE_MESSAGE,
    meta: {
      timestamp,
    },
  };
}
```

System Action Constants & Shape:

```ts
// src/store/system/types.ts
export const UPDATE_SESSION = 'UPDATE_SESSION';

interface IUpdateSessionAction {
  type: typeof UPDATE_SESSION;
  payload: ISystemState;
}

export type TSystemActionTypes = IUpdateSessionAction;
```
With these types we can now also type check system's action creators:


```ts
// src/store/system/actions.ts

import { ISystemState, UPDATE_SESSION, TSystemActionTypes } from './types';

export function updateSession(newSession: ISystemState): TSystemActionTypes {
  return {
    type: UPDATE_SESSION,
    payload: newSession,
  };
}
```

### Type Checking Reducers.

Reducers are just pure functions that take the previous state, an action and then return the next state. 
In this example, we explicitly declare the type of actions this reducer will receive along with what it 
should return (the appropriate slice of state). With these additions TypeScript will give rich 
intellisense on the properties of our actions and state. In addition, we will also get errors when 
a certain case does not return the ChatState.


Type checked chat reducer:
```ts
// src/store/chat/reducers.ts

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
```
Type checked system reducer:

```ts
// src/store/system/reducers.ts

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
      return {
        ...state,
        ...action.payload,
      };
    }
    default:
      return state;
  }
}
```

Create index.ts file to import everything at once.
```ts
//  src/store/system/index.ts

import * as systemTypes from './types';
import * as systemReducers from './reducers';
import * as systemActions from './actions';

export { systemTypes, systemActions, systemReducers };
```


```ts
//  src/store/chat/index.ts

import * as chatReducers from './reducers';
import * as chatActions from './actions';
import * as chatTypes from './types';

export { chatActions, chatReducers, chatTypes };
```

We now need to generate the root reducer function, which is normally done using combineReducers. 
Note that we do not have to explicitly declare a new interface for RootState. 
We can use ReturnType to infer state shape from the rootReducer.


```ts
// src/store/index.ts
import { combineReducers } from 'parody-of-redux-library';
import * as chat from './chat';
import * as system from './system';

const rootReducer = combineReducers({
  chat: chat.chatReducers.chatReducer,
  system: system.systemReducers.systemReducer,
});

const actions = {
  ...chat.chatActions,
  ...system.systemActions,
};

type TRootState = ReturnType<typeof rootReducer>;

type TRootActions =
  | chat.chatTypes.TChatActionTypes
  | system.systemTypes.TSystemActionTypes;

export { rootReducer, TRootState, TRootActions, actions };
```

### Usage example.

```ts
import {
  createStore,
  applyMiddleware,
  IMiddleware,
  IStore,
  ISubscriber,
} from 'parody-of-redux-library';

import { rootReducer, actions, TRootActions, TRootState } from './src/store';

// This object is the initial state storage.
const initialState: TRootState = {
  chat: {
    messages: [
      {
        user: 'Ikrom Murodov',
        timestamp: 18,
        message: 'Hello world',
      },
    ],
  },

  system: {
    session: '',
    loggedIn: true,
    userName: 'Ikrom',
  },
};

// We created a middleware function.
const logger: IMiddleware<TRootState, TRootActions> = (st) => (next) => (
  action,
): void => {
  console.log('store', st);
  console.log('next dispatch', next);
  console.log('action', action);

  next(action);
};

// We created the store.
const store: IStore<TRootState, TRootActions> = createStore<
  TRootState,
  TRootActions
>(rootReducer, initialState, applyMiddleware(logger));

// Get the tree of the current state of your application.
console.log(store.getState()); // initialState;

// Adds a change listener. It will be called whenever the states could potentially change.
const subscriber: ISubscriber = store.subscribe((state: TRootState) => {
  console.log('state to changed', state);
});

// subscriber -> the subscribe function is a function to remove
// the listener added by `Store.subscribe ()`

// The dispatch function Dispatches an action. This is the only way to cause a change in state.
store.dispatch(
  actions.sendMessage({
    message: 'Hello Ikrom Murodov. I am the World. :)',
    timestamp: 22,
    user: 'The World',
  }),
);
```
