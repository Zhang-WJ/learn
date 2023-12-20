import { pipe } from '@effect/data/Function';
import * as Either from '@effect/data/Either';
import * as Effect from '@effect/io/Effect';
import * as Layer from '@effect/io/Layer';
import * as Context from '@effect/data/Context';

// Effect(R, E, A)

// success channel (A in Effect(R, E, A) type:Effect.Effect<never,never, number)
const succeed = Effect.succeed(7);
// failure channel (E in Effect(R, E, A) type:Effect.Effect<never,number, never)
const failure = Effect.fail(3);

// sync be like a lazy alternative to succeed while Effect run the A built
const sync = Effect.sync(() => Math.random());

// sync be like a lazy alternative to succeed while Effect run the E built
const failSync = Effect.failSync(() => new Date());

// lazy build whole Effect(R,E,A)
const suspend = Effect.suspend(() =>
  Math.random() > 0.5
    ? Effect.succeed(new Date())
    : Effect.fail('<.5' as const),
);

// Basic control flow
function eitherFromRandom(random: number): Either.Either<'fail', number> {
  return random > 0.5 ? Either.right(random) : Either.left('fail' as const);
}

// this will fail at sometime
const flakyEffect = pipe(
  Effect.sync(() => Math.random()),
  Effect.flatMap(eitherFromRandom),
);

// Same thing but using the number generator provided by Effect
const flakyEffectAbsolved = pipe(
  Effect.random(), // Effect.Effect<never, never, Random>
  Effect.flatMap((random) => random.next()), // Effect.Effect<never, never, number>
  Effect.flatMap(eitherFromRandom), // Effect.Effect<never, 'fail', number>
);

// Effect.runPromise(flakyEffectAbsolved);

// This is an Effect native implementation of eitherFromRandom defined above
function flakyEffectFromRandom(random: number) {
  return Effect.cond(
    () => random > 0.5,
    () => random,
    () => 'fail' as const,
  );
}

// Context
interface CustomRandom {
  readonly next: () => number;
}

const CustomRandomTag = Context.Tag<CustomRandom>();

const serviceExample = pipe(
  CustomRandomTag,
  Effect.map((random) => random.next()),
  Effect.map(flakyEffectFromRandom),
);

// provide use provideService method
const provideServiceExample = pipe(
  serviceExample,
  Effect.provideService(CustomRandomTag, { next: Math.random }),
);

// Effect.runPromise(provideServiceExample);

// provide an implement use context
const context = pipe(
  Context.empty(),
  Context.add(CustomRandomTag, { next: Math.random }),
);

const provideContextExample = pipe(
  serviceExample,
  Effect.provideContext(context),
);

const CustomRandomServiceLive = () => ({
  next: Math.random,
});

const liveProgram = pipe(
  serviceExample,
  Effect.provideLayer(
    Layer.succeed(CustomRandomTag, CustomRandomServiceLive()),
  ),
);

const CustomRandomServiceTest = () => ({
  next: () => 0.7,
});

const testProgram = pipe(
  serviceExample,
  Effect.provideService(CustomRandomTag, CustomRandomServiceTest()),
);

Effect.runPromise(testProgram);

export default function () {
  return <div>basic01</div>;
}
