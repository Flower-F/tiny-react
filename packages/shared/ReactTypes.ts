export type Type = any;
export type Key = any;
export type Props = any;
export type Ref = any;
export type ElementType = any;

export interface ReactElement {
  /** This tag allows us to uniquely identify this as a React Element */
  $$typeof: symbol | number;
  key: Key;
  type: Type;
  props: Props;
  ref: Ref;
  __mark: string;
}

export type Action<State> = State | ((prevState: State) => State);
