import { useParams } from "react-router-dom";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { FormikProps, withFormik } from "formik";
import { setValueAtKeyPath } from "../../utils/sharedUtils";
import Autocomplete from "components/Autocomplete";
import { Button } from "components/Button";

function UpsertPage({
	dataFetcher,
	fields,
	values,
	setValues,
	...rest
}: UpsertPageProps & FormikProps<Record<string, unknown>>) {
	const { id } = useParams<{ id?: string }>();
	const [loading, setLoading] = useState(false);
	const [items, setItems] = useState({} as Record<string, Record<string, unknown>[]>);
	const [fetchError, setFetchError] = useState(null as string | null);
	const [data, setData] = useState({} as Record<string, unknown>);

	useEffect(() => {
		if (id) {
			fetchData();
		}

		// fetch item for pointer fields
		fetchItems();
	}, []);

	const fetchItems = () => {
		fields.forEach((field) => {
			// obly pointer fields need item fetching
			if (field.type === "pointer") {
				field.items!().then((array) => setItems({ ...items, [field.name]: array }));
			}
		});
	};

	const fetchData = () => {
		setLoading(true);
		dataFetcher(Number(id))
			.then((data) => {
				setFetchError(null);
				setData(data as never);
			})
			.catch((e) => setFetchError(e.toString))
			.finally(() => setLoading(false));
	};

	function renderFields<T>(fields: FormField<T>[]) {
		return fields.map((field) => {
			switch (field.type) {
				case "number":
				case "text":
					return (
						<div key={field.name as string}>
							<label htmlFor={field.name as string}>{field.label}</label>
							<input
								value={
									(values[field.name as string] as string) ||
									(data[field.name as string] as string) ||
									""
								}
								onChange={handleChange}
								onBlur={rest.handleBlur}
								name={field.name as string}
								type={field.type}
							/>
						</div>
					);

				case "file":
					return (
						<div key={field.name as string}>
							<img
								src={
									values[field.name as string] instanceof File
										? URL.createObjectURL(values[field.name as string])
										: (data[field.name as string] as string)
								}
								width="300"
								height="200"
								alt="preview"
							/>
							<input
								type="file"
								name={field.name as string}
								onChange={handleFileChange}
								onBlur={rest.handleBlur}
							/>
						</div>
					);

				case "pointer":
					return (
						<div key={field.name as string}>
							<label htmlFor={field.name as string}>{field.label}</label>
							<Autocomplete
								items={items[field.name as string]}
								itemText={field.itemText!}
								itemValue={field.itemValue!}
								value={
									(values[field.name as string] as string) ||
									(data[field.name as string] as string) ||
									""
								}
								onSelect={(value) =>
									handleAutocompleteChange(field.name as string, value)
								}
							/>
						</div>
					);

				default:
					return <h6>Not supported yet</h6>;
			}
		});
	}

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		event.preventDefault();
		const newValues = { ...values };
		setValueAtKeyPath(newValues, event.target.name, event.target.value);
		setValues(newValues);
	};

	const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
		event.preventDefault();
		const newValues = { ...values };
		setValueAtKeyPath(newValues, event.target.name, event.target.files?.[0]);
		setValues(newValues);
	};

	const handleAutocompleteChange = (name: string, value: unknown) => {
		console.log("autocomplete cahgnes", name, value);
		const newValues = { ...values };
		setValueAtKeyPath(newValues, name, value);
		setValues(newValues);
	};

	const handleSubmit = (event: FormEvent) => {
		event.preventDefault();
		rest.submit(values);
	};

	return (
		<form onSubmit={handleSubmit}>
			<div>{renderFields(fields)}</div>
			<Button secondary type="reset">
				Cancel
			</Button>
			<Button primary type="submit">
				Submit
			</Button>
		</form>
	);
}

export default withFormik<UpsertPageProps, Record<string, unknown>>({
	handleSubmit() {},
})(UpsertPage);

export interface UpsertPageProps {
	dataFetcher: (id: number) => Promise<unknown>;
	fields: FormField<unknown>[];
	submit: (values: unknown) => void;
}

export interface FormField<T> {
	label: string;
	name: keyof T;
	type: "number" | "text" | "file" | "pointer";
	items?: () => Promise<unknown[]>;
	itemText?: string;
	itemValue?: string;
}
