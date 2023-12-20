// @ts-nocheck

function refine<T>(collection: Record<string, T>, path: string[]) {
  return path.reduce(function(refinement: Record<any, any>, element: string) {
    try {
      return refinement[element];
    } catch (ignore) {
        // empty
    }
  }, collection);
}

function by(...keys: any[]) {
  const paths = keys.map(function(element) {
    return element.toString().split('.');
  });
  return function compare(first, second) {
    let firstValue;
    let secondValue;
    if (
      paths.every(function(path) {
        firstValue = refine(first, path);
        secondValue = refine(second, path);
        return firstValue === secondValue;
      })
    ) {
      return 0;
    }

    return (
      typeof firstValue === typeof secondValue
        ? firstValue < secondValue
        : typeof firstValue < typeof secondValue
    )
      ? -1
      : 1;
  };
}

export default by;



let people = [
  { first: "Frank", last: "Farkel" },
  { first: "Fanny", last: "Farkel" },
  { first: "Sparkle", last: "Farkel" },
  { first: "Charcoal", last: "Farkel" },
  { first: "Mark", last: "Farkel" },
  { first: "Simon", last: "Farkel" },
  { first: "Gar", last: "Farkel" },
  { first: "Ferd", last: "Berfel" }
]

console.log(people.sort(by("last", "first")))

console.log(people.sort((a: any, b: any) => {
  if (a.last === b.last) {
    return a.first === b.first ? 0 : a.first < b.first ? -1 : 1
  } else {
    return a.last < b.last ? -1 : 1
  }
}))
