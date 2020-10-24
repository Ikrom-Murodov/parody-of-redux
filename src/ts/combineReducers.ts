/* eslint-disable @typescript-eslint/no-explicit-any */

import { IReducer } from '@/types/reducer';
import { IAction } from '@/types/action';

type ReducersMapObject<S = any, A extends IAction = IAction> = {
  [K in keyof S]: IReducer<S[K], A>;
};

/**
 * Turns an object whose values are different reducer functions, into a single
 *  reducer function. It will call every child reducer, and gather their results
 *  into a single state object, whose keys correspond to the keys of the passed
 *  reducer functions.
 *
 * @param {ReducersMapObject} reducers - An object whose values correspond to different reducer
 *  functions that need to be combined into one.
 *
 * @returns A reducer function that invokes every reducer inside the passed
 *  object, and builds a state object with the same shape.
 */
export function combineReducers<S = any>(
  reducers: ReducersMapObject<S, any>,
): IReducer<S, any> {
  return (state: any = {}, action: any): S => {
    const nextState: any = {};

    Object.entries(reducers).forEach(([key, reducer]: any) => {
      nextState[key] = reducer(state[key], action);
    });

    return nextState;
  };
}
