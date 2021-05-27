import { ChangeEvent, useEffect, useState } from "react";
import { getValueAtKeyPath } from "utils/sharedUtils";

function Autocomplete<T extends Record<string, unknown>>({
  items,
  itemText,
  itemValue,
  onChange,
  value,
  ...rest
}: {
  items: T[];
  value: unknown;
  itemText: string;
  itemValue: string;
  onChange: (value: unknown) => void;
  [others: string]: unknown;
}) {
  const [isShowingSuggestions, setShowingSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([] as T[]);
  const [text, setText] = useState("" as string);

  useEffect(() => {
    const item = items.find((i) => getValueAtKeyPath(i, itemValue) === value);
    if (item) {
      setText(getValueAtKeyPath(item, itemText) as string);
    }
  }, [value]);

  const handleFocus = (event: ChangeEvent<HTMLInputElement>) => {
    const parentOnFocus = rest.onFocus as (event: ChangeEvent) => void;
    parentOnFocus && parentOnFocus(event);
    // show suggestions
    setShowingSuggestions(true);
    filterSuggestions(event.target.value as string);
  };

  const handleTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    setShowingSuggestions(true);
    setText(event.target.value);
    const onInput = rest.onInput as (event: ChangeEvent) => void;
    onInput && onInput(event);
    // filter suggestions
    filterSuggestions(event.target.value as string);
  };

  const filterSuggestions = (value: string) => {
    const filteredSuggestions = items.filter((item) => {
      const text = getValueAtKeyPath(item, itemText);
      const matches = new RegExp(value, "gi").test(text as string);
      return matches;
    });
    setSuggestions(filteredSuggestions);
  };

  return (
    <>
      <input
        onFocus={handleFocus}
        onChange={handleTextChange}
        {...rest}
        value={text}
      />
      {isShowingSuggestions && (
        <ul>
          {suggestions.map((suggestion, i) => (
            <li
              key={i}
              onClick={() => {
                onChange(getValueAtKeyPath(suggestion, itemValue));
                setShowingSuggestions(false);
              }}
            >
              {getValueAtKeyPath(suggestion, itemText) as string}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export default Autocomplete;
