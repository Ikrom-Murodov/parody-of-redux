/* eslint-disable @typescript-eslint/no-explicit-any */

import { IDispatch } from '@/types/store';
import { IAction } from '@/types/action';

/**
 * A middleware is a higher-order function that composes a dispatch function
 *  to return a new dispatch function. It often turns async actions into
 *  actions.
 *
 * @interface
 */
export interface IMiddleware<S = any, A extends IAction = IAction> {
  (store: { getState(): S }): (next: IDispatch<A>) => (action: A) => void;
}
