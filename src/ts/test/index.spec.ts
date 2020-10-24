import {
  applyMiddleware,
  createStore,
  combineReducers,
  IReducer,
  IStore,
  ISubscriber,
  IUnsubscribe,
  IMiddleware,
  IDispatch,
} from '@/index';

import { actions, reducers } from './index';

const initialState = {
  system: {
    userName: 'Ikrom Murodov',
    loggedIn: true,
    session: '',
  },
  chat: {
    messages: [
      {
        user: 'Ikrom Murodov',
        message: 'Hello world',
        timestamp: 20,
      },
    ],
  },
};

describe('combineReducers', () => {
  let rootReducer: IReducer;

  beforeEach(() => {
    rootReducer = combineReducers({
      chat: reducers.chatReducer,
      system: reducers.systemReducer,
    });
  });

  test('Should return the reducer function.', () => {
    expect(rootReducer).toBeDefined();
  });

  test('The reducer function must return state.', () => {
    expect(rootReducer(initialState, { type: '__INIT__' })).toEqual(
      initialState,
    );
  });
});

describe('createStore', () => {
  let rootReducer: IReducer;
  let store: IStore;
  let handler: ISubscriber;

  beforeEach(() => {
    rootReducer = combineReducers({
      chat: reducers.chatReducer,
      system: reducers.systemReducer,
    });

    store = createStore(rootReducer, initialState);
    handler = jest.fn();
  });

  test('Checking the "getState" method', () => {
    expect(store.getState()).toEqual(initialState);
  });

  describe('Checking the "dispatch" method', () => {
    test('should change state if action exists', () => {
      const message = {
        user: 'World',
        message: 'Hello Ikrom Murodov',
        timestamp: 226,
      };

      const newSystem = {
        userName: 'Murodov Irom',
        loggedIn: false,
        session: 'test session',
      };

      store.dispatch(actions.updateSession(newSystem));
      expect(store.getState().system).toEqual(newSystem);

      store.dispatch(actions.sendMessage(message));
      expect(store.getState().chat.messages[1]).toEqual(message);

      store.dispatch(actions.deleteMessage(226));
      expect(store.getState().chat.messages[1]).toBeUndefined();
    });

    test('should not change state if the action does not exist', () => {
      store.dispatch({
        type: 'action-does-not-exist',
        data: {
          message: 'Hello Parody-of-redux',
        },
      });

      expect(store.getState()).toEqual(initialState);
    });
  });

  describe('Checking the "subscribe" method', () => {
    test('should call the subscriber function.', () => {
      store.subscribe(handler);

      store.dispatch({
        type: 'test',
      });

      expect(handler).toHaveBeenCalled();
      expect(handler).toHaveBeenCalledWith(store.getState());
    });

    test('Checking the possibility of unsubscribing from the event', () => {
      const unsubscribe: IUnsubscribe = store.subscribe(handler);

      unsubscribe();

      store.dispatch({
        type: 'test',
      });

      expect(handler).not.toHaveBeenCalled();
    });
  });
});

describe('applyMiddleware', () => {
  let nextDispatch: IDispatch;

  // eslint-disable-next-line
  const middleware = (action: any): void => {
    nextDispatch(action);
  };

  // eslint-disable-next-line
  const logger: IMiddleware<any, any> = (st) => (next) => {
    nextDispatch = next;
    return middleware;
  };

  let rootReducer: IReducer;

  beforeEach(() => {
    rootReducer = combineReducers({
      chat: reducers.chatReducer,
      system: reducers.systemReducer,
    });
  });

  test('Must return the store enhancer.', () => {
    expect(applyMiddleware(logger)).toBeDefined();
  });

  test('Store enhancer must return store.', () => {
    const store = applyMiddleware(logger)(
      createStore,
      rootReducer,
      initialState,
    );

    expect(store).toBeDefined();
    expect(store.dispatch).toBeDefined();
    expect(store.getState()).toEqual(initialState);
    expect(store.subscribe).toBeDefined();

    expect(store.dispatch).toBe(middleware);
  });
});
