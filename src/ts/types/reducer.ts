/* eslint-disable @typescript-eslint/no-explicit-any */
import { IAction } from '@/types/action';

/**
 * A reducer is a function that receives the current
 *  state and an action object, decides how to update the state if necessary,
 *  and returns the new state: (state, action) => newState.
 *
 * @interface
 */
export interface IReducer<S = any, A extends IAction = IAction> {
  (state: S, action: A): S;
}
