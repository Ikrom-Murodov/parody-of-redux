/* eslint-disable @typescript-eslint/no-explicit-any */
import { IAction } from '@/types/action';

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
