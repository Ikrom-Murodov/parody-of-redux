/* eslint-disable @typescript-eslint/no-explicit-any */
import { IAction } from '@/types/action';
import { IReducer } from '@/types/reducer';

/**
 * A store enhancer is a higher-order function that composes a store creator
 *  to return a new, enhanced store creator. This is similar to middleware in
 *  that it allows you to alter the store interface in a composable way.
 *
 * @interface
 */
export interface IStoreEnhancer<S = any, A extends IAction = IAction> {
  (
    createStore: ICreateStore<S, A>,
    reducer: IReducer<S, A>,
    initialState?: S,
  ): IStore<S, A>;
}

/**
 * Creates a Redux store that holds the complete state tree of your app.
 *
 * @interface
 */
export interface ICreateStore<S = any, A extends IAction = IAction> {
  (reducer: IReducer<S, A>, initialState?: S): IStore<S, A>;
}

/**
 * A callback function to be invoked on every dispatch.
 * @interface
 */
export interface ISubscriber<S = any> {
  (state: S): void;
}

/**
 * Dispatches an action. It is the only way to trigger a state change.
 *
 * @interface
 */
export interface IDispatch<A extends IAction = IAction> {
  (action: A): void;
}

/**
 * Function to remove listener added by `Store.subscribe()`.
 *
 * @interface
 */
export interface IUnsubscribe {
  (): void;
}

/**
 * A store is an object that holds the application's state tree.
 *
 * @interface
 */
export interface IStore<S = any, A extends IAction = IAction> {
  /**
   * Dispatches an action. It is the only way to trigger a state change.
   *
   * @param {IAction} action - A plain object describing the change that makes
   *  sense for your application.
   *
   * @returns - This method returns nothing.
   */
  dispatch: IDispatch<A>;

  /**
   * Get the tree of the current state of your application.
   *
   * @returns The current state tree of your application.
   */
  getState(): S;

  /**
   * Adds a change listener. It will be called whenever the states
   *  could potentially change.
   *
   * @param {function} subscriber -  A callback function to be invoked on every
   *  dispatch.
   *
   * @returns A callback function to remove this change listener.
   */
  subscribe(subscriber: ISubscriber<S>): IUnsubscribe;
}
