import React, { useState } from 'react';
import { faker } from '@faker-js/faker';

const names = Array.from(Array(1000), () => faker.internet.userName());

export default function FilterList() {
  const [query, setQuery] = useState('');

  const changeHandler = ({ target: { value } }) => setQuery(value);

  return (
    <div>
      <input onChange={changeHandler} value={query} />
      {Array.from(names, (name, i) => (
        <ListItem highlight={query} key={i} name={name} />
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
      <span className="highlight">
        {name.slice(index, index + highlight.length)}
      </span>
      {name.slice(index + highlight.length)}
    </div>
  );
}
