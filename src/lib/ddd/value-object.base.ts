import _ from 'lodash';

export type Primitives = string | number | boolean | Date | undefined | null;

export interface DomainPrimitive<T extends Primitives> {
  value: T;
}

export type ValueObjectProps<T> = T extends Primitives ? DomainPrimitive<T> : T;

export abstract class ValueObject<TProps> {
  private _props: ValueObjectProps<TProps>;

  constructor(props: ValueObjectProps<TProps>) {
    this._props = props;
  }

  get props() {
    return this._props;
  }

  unpack() {
    const copy = _.clone(this.props);

    return copy;
  }

  static isValueObject(param: unknown) {
    return param instanceof ValueObject;
  }

  protected abstract validate(): void;
}
