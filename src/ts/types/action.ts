/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * An action is a plain JavaScript object that has a type field.
 * @interface
 */
export interface IAction<T = any> {
  type: T;
  [extraProps: string]: any;
}
