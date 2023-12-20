import { ChangeEvent, useDeferredValue, useState, useTransition } from 'react';

import Start from "./Threejs/Start"



// concurrent
function CocurrentComponents() {
  const [input, setInput] = useState('');
  const defferedValue = useDeferredValue(input);

  const [isPending, startTransition] = useTransition();

  console.log(isPending);

  const handleChange = ({
    target: { value },
  }: ChangeEvent<HTMLInputElement>) => {
    startTransition(() => {
      setInput(value);
    });
  };

  return (
    <div>
      <input onChange={handleChange} value={input} />
      <div>{defferedValue}</div>
    </div>
  );
}

export default function App() {
  return (
    <div className="mx-auto my-8 mt-10 w-8/12 rounded border border-gray-200 p-4 shadow-md dark:border-neutral-600 dark:bg-neutral-800 dark:shadow-none">
      <Start />
    </div>
  );
}
