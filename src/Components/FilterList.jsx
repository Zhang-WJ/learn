import React, { useDeferredValue, useState, useTransition } from 'react';
import { faker } from '@faker-js/faker';

const names = Array.from(Array(10000), () => faker.internet.userName());

export default function FilterList() {
  const [query, setQuery] = useState('');
  const [highlight, setHighlight] = useState('');
  const [isPending, startTransition] = useTransition();

  const changeHandler = ({ target: { value } }) => {
    setQuery(value);
    // startTransition(() => setHighlight(value));
  };

  const defferedVal = useDeferredValue(query, { timeoutMs: 3000 });

  return (
    <div>
      <input
        className="mt-1 mb-1 block rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        onChange={changeHandler}
        type="text"
        value={query}
      />
      {isPending
        ? 'pending'
        : Array.from(names, (name, i) => (
            <ListItem highlight={defferedVal} key={i} name={name} />
          ))}
    </div>
  );
}

function ListItem({ name, highlight }) {
  const index = name.toLowerCase().indexOf(highlight.toLowerCase());
  if (index === -1) {
    return <div>{name}</div>;
  }
  return (
    <div>
      {name.slice(0, index)}
      <span className="text-red-300">
        {name.slice(index, index + highlight.length)}
      </span>
      {name.slice(index + highlight.length)}
    </div>
  );
}
