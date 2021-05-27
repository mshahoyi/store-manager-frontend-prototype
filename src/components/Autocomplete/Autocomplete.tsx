import { ChangeEvent, useState } from "react";
import { getValueAtKeyPath } from "utils/sharedUtils";

function Autocomplete<T extends Record<string, unknown>>({
	items,
	itemText,
	itemValue,
	onSelect,
	...rest
}: {
	items: T[];
	itemText: string;
	itemValue: string;
	onSelect: (value: unknown) => void;
	[others: string]: unknown;
}) {
	const [isShowingSuggestions, setShowingSuggestions] = useState(false);
	const [suggestions, setSuggestions] = useState([] as T[]);
	const [selection, setSelection] = useState({} as T);

	const handleFocus = (event: ChangeEvent<HTMLInputElement>) => {
		const parentOnFocus = rest.onFocus as (event: ChangeEvent) => void;
		parentOnFocus && parentOnFocus(event);
		// show suggestions
		setShowingSuggestions(true);
		filterSuggestions(event.target.value as string);
	};

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		const onInput = rest.onInput as (event: ChangeEvent) => void;
		onInput && onInput(event);
		// filter suggestions
		filterSuggestions(event.target.value as string);
	};

	const filterSuggestions = (value: string) => {
		const filteredSuggestions = items.filter((item) => {
			const text = getValueAtKeyPath(item, itemText);
			const matches = new RegExp(value, "gi").test(text as string);
			console.log("value text match", value, text, matches);
			console.log(item, value, matches);
			return matches;
		});
		setSuggestions(filteredSuggestions);
	};

	return (
		<>
			<input
				onFocus={handleFocus}
				onChange={handleChange}
				{...rest}
				value={(getValueAtKeyPath(selection, itemText) as string) || ""}
			/>
			{isShowingSuggestions && (
				<ul>
					{suggestions.map((suggestion, i) => (
						<li
							key={i}
							onClick={() => {
								setSelection(suggestion);
								onSelect(getValueAtKeyPath(suggestion, itemValue));
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
