/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/ban-types */

import { IAction } from '@/types/action';
import { IReducer } from '@/types/reducer';
import { IStore, IDispatch, IStoreEnhancer, ICreateStore } from '@/types/store';

import { IMiddleware } from '@/types/middleware';

function combineMiddlewareIntoChain(...functions: Function[]): Function {
  return functions.reduce((a, b) => (...args: any): any => a(b(...args)));
}

/**
 * Creates a store enhancer that applies middleware to the dispatch method
 *  of the Redux store.
 *
 *  @return {IStoreEnhancer} -  A store enhancer applying the middleware.
 */
export function applyMiddleware<S = any, A extends IAction = IAction>(
  ...middlewares: IMiddleware<S, A>[]
): IStoreEnhancer<S, A> {
  return (
    createStore: ICreateStore<S, A>,
    reducer: IReducer<S, A>,
    initialState?: S,
  ): IStore<S, A> => {
    const store = createStore(reducer, initialState);
    let dispatch: IDispatch<A> = (action: A) => {};

    const getState = {
      getState: (): S => store.getState(),
    };

    const chain = middlewares.map((middleware) => middleware(getState));
    dispatch = combineMiddlewareIntoChain(...chain)(store.dispatch);

    return {
      ...store,
      dispatch,
    };
  };
}
