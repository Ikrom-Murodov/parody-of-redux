/* eslint-disable no-param-reassign */

import { IAction } from '@/types/action';
import { IReducer } from '@/types/reducer';
import {
  IStore,
  IStoreEnhancer,
  ISubscriber,
  IUnsubscribe,
} from '@/types/store';

/**
 * Creates a Redux store that holds the complete state tree of your app.
 *
 * @param {IReducer} reducer - At reducing function that returns the nex state tree,
 *  given the current state tree and an action to handle.
 *
 * @param {*} initialState or enhancer - The initial state of your application or
 *  enhancer the store enhancer.
 *
 * @param {IStoreEnhancer=} enhancer - enhancer the store enhancer.
 *
 * @returns {IStore} - A Redux store that lets you read the state, dispatch actions and
 *   subscribe to changes.
 */
export function createStore<S, A extends IAction>(
  reducer: IReducer<S, A>,
  initialState?: S | IStoreEnhancer<S, A>,
  enhancer?: IStoreEnhancer<S, A>,
): IStore<S, A> {
  if (typeof initialState === 'function' && typeof enhancer === 'function') {
    throw new Error(`It looks like you are passing several store enhancers to createStore(). This is not supported.
    `);
  }

  if (typeof initialState === 'function' && typeof enhancer === 'undefined') {
    enhancer = initialState as IStoreEnhancer<S, A>;
    initialState = undefined;
  }

  if (typeof enhancer !== 'undefined') {
    if (typeof enhancer !== 'function') {
      throw new Error('Expected the enhancer to be a function.');
    }

    return enhancer(createStore, reducer, initialState as S);
  }

  if (typeof reducer !== 'function') {
    throw new Error('Expected the reducer to be a function.');
  }

  let state: S = reducer(initialState as S, { type: '__INIT__' } as A);
  let subscribers: ISubscriber<S>[] = [];

  return {
    /**
     * Get the tree of the current state of your application.
     *
     * @returns The current state tree of your application.
     */
    getState: (): S => state,

    /**
     * Adds a change listener. It will be called whenever the states
     *  could potentially change.
     *
     * @param {function} cb - A callback function to be invoked on every
     *  dispatch.
     *
     * @returns A callback function to remove this change listener.
     */
    subscribe(cb: ISubscriber<S>): IUnsubscribe {
      subscribers.push(cb);

      return (): void => {
        subscribers = subscribers.filter((subscriber) => subscriber !== cb);
      };
    },

    /**
     * Dispatches an action. It is the only way to trigger a state change.
     *
     * @param {IAction} action - A plain object describing the change that makes
     *  sense for your application.
     *
     * @returns - This method returns nothing.
     */
    dispatch(action: A): void {
      if (typeof action !== 'object') {
        throw new Error(
          'Actions must be plain objects. Use custom middleware for async actions.',
        );
      }

      if (typeof action.type === 'undefined') {
        throw new Error('action.type can not be undefined');
      }

      state = reducer(state, action);
      subscribers.forEach((subscriber) => subscriber(state));
    },
  };
}
