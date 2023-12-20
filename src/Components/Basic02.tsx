import React from 'react';
import * as Effect from '@effect/io/Effect';
import * as Schema from '@effect/schema/Schema';
import { pipe } from '@effect/data/Function';
import { parseEither } from '../../utils/decode';

const id = '97459c0045f373f4eaf126998d8f65dc';
const fetchGist = (id: string) =>
  Effect.tryCatchPromise(
    () => fetch(`https://api.github.com/gists/${id}`),
    () => 'fetch' as const,
  ); // Effect.Effect<never, "fetch", Response>

const getJSON = (res: Response) =>
  Effect.tryCatchPromise(
    () => res.json() as Promise<unknown>,
    () => 'json' as const,
  );

const GistSchema = Schema.struct({
  url: Schema.string,
  files: Schema.record(
    Schema.string,
    Schema.struct({
      filename: Schema.string,
      type: Schema.string,
      language: Schema.string,
      raw_url: Schema.string,
    }),
  ),
});

interface Gist extends Schema.To<typeof GistSchema> {}

const getAndParseGist = pipe(
  fetchGist(id),
  Effect.flatMap(getJSON),
  Effect.flatMap(parseEither(GistSchema)),
);

Effect.runPromise(getAndParseGist)
  .then((x) => console.log('decoded gist %o', x))
  .catch((err) => console.error(err));

const Basic02 = () => {
  fetchGist(id);
  Effect.runPromise(fetchGist(id));
  return <div></div>;
};

export default Basic02;
