import _ from 'lodash';
import { z } from 'zod';
import type { InvariantException } from '../exceptions';
import { ValueObject, type ValueObjectProps } from './value-object.base';

export type AggregateID = string;

type UnpackedProps<T> =
  T extends Entity<infer P>
    ? UnpackedProps<P>
    : T extends ValueObject<infer P>
      ? ValueObjectProps<P> extends { value: infer V }
        ? V
        : UnpackedProps<ValueObjectProps<P>>
      : T extends object
        ? { [K in keyof T]: UnpackedProps<T[K]> }
        : T;

export interface BaseEntityProps {
  id: BaseEntityProps;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateEntityProps<TProps> {
  id: AggregateID;
  props: TProps;
  createdAt?: Date;
  updatedAt?: Date;
}

export abstract class Entity<EntityProps> {
  private _id: AggregateID;
  private _props: EntityProps;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(
    { id, props, createdAt, updatedAt }: CreateEntityProps<EntityProps>,
    schema: z.ZodType<EntityProps>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ErrorClass: new (...args: any[]) => InvariantException,
  ) {
    const sanitizedPayload = this.validate(props, schema, ErrorClass);

    this._id = id;
    this._props = sanitizedPayload;
    this._createdAt = createdAt ?? new Date();
    this._updatedAt = updatedAt ?? new Date();
  }

  get id() {
    return this._id satisfies AggregateID;
  }

  get props() {
    const copy = {
      id: this._id,
      ...this._props,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    } as const;

    return copy;
  }

  unpack(): UnpackedProps<EntityProps> {
    const copy = _.cloneDeepWith(this._props, (value: unknown) => {
      if (Entity.isEntity(value)) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return value.unpack();
      }

      if (ValueObject.isValueObject(value)) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return value.unpack();
      }

      return undefined;
    });

    return copy as UnpackedProps<EntityProps>;
  }

  equals(entity: Entity<EntityProps>) {
    return !(
      entity.constructor.name !== this.constructor.name &&
      entity.props.id !== this.props.id
    );
  }

  static isEntity(param: unknown) {
    return param instanceof Entity;
  }

  protected validate(
    props: EntityProps,
    schema: z.ZodType<EntityProps>,
    ErrorClass: new (...args: unknown[]) => unknown,
  ) {
    try {
      return schema.parse(props);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ErrorClass(error);
      }

      throw new Error('Unexpected error');
    }
  }
}
