import * as Effect from '@effect/io/Effect';
import * as Cause from '@effect/io/Cause';
import * as Data from '@effect/data/Data';
import * as Match from '@effect/match';
import * as Option from '@effect/data/Option';
import * as Either from '@effect/data/Either';
import { pipe } from '@effect/data/Function';

// Three Type Error
// 1) Failure
// 2) Defect
// 3) Interruption

interface FooError extends Data.Case {
  readonly _tag: 'FooError';
  readonly error: string;
}

const FooError = Data.tagged<FooError>('FooError');

import React from 'react';

const Basic03 = () => {
  return <div></div>;
};

export default Basic03;
