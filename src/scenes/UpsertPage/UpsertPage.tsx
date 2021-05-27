import { useHistory, useParams } from "react-router-dom";
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
  setSubmitting,
  ...rest
}: UpsertPageProps & FormikProps<Record<string, unknown>>) {
  const history = useHistory();
  const { id } = useParams<{ id?: string }>();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState(
    {} as Record<string, Record<string, unknown>[]>
  );
  const [fetchError, setFetchError] = useState(null as string | null);
  const [data, setData] = useState({} as Record<string, unknown>);
  const [submitFeedback, setSubmitFeedback] = useState("" as string);

  useEffect(() => {
    // fetch item for pointer fields
    const requests = fetchItems();

    if (id) {
      requests.unshift(fetchData());
    }

    setLoading(true);
    Promise.all(requests).finally(() => setLoading(false));
  }, []);

  const fetchItems = () => {
    return (
      fields
        // obly pointer fields need item fetching
        .filter((f) => typeof f.items === "function")
        .map((field) =>
          field.items!().then((array) =>
            setItems({ ...items, [field.name]: array })
          )
        )
    );
  };

  const fetchData = async () => {
    try {
      const data = await dataFetcher(Number(id));
      setFetchError(null);
      setData(data as never);
    } catch (e) {
      setFetchError(e.toString());
    }
  };

  function renderField<T>(field: FormField<T>) {
    switch (field.type) {
      case "number":
      case "text":
        return (
          <div key={field.name as string}>
            <label htmlFor={field.name as string}>{field.label}</label>
            <input
              value={
                values[field.name as string] === undefined
                  ? (data[field.name as string] as string) || ""
                  : (values[field.name as string] as string)
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
              style={{ display: "block" }}
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
              items={items[field.name as string] || []}
              itemText={field.itemText!}
              itemValue={field.itemValue!}
              value={
                values[field.name as string] === undefined
                  ? (data[field.name as string] as string) || ""
                  : (values[field.name as string] as string)
              }
              onChange={(value) =>
                handleAutocompleteChange(field.name as string, value)
              }
            />
          </div>
        );

      default:
        return <h6>Not supported yet</h6>;
    }
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
    const newValues = { ...values };
    setValueAtKeyPath(newValues, name, value);
    setValues(newValues);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setSubmitFeedback("");
    try {
      // if there is no id, it means it is an add
      if (data.id) {
        await rest.submitUpdate(Number(data.id), values);
      } else {
        await rest.submitCreate(values);
      }
      setSubmitFeedback("Operation Successful");
      history.goBack();
    } catch (e) {
      setSubmitFeedback("Submission Error. " + e.toString());
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {loading && <h3>Loading...</h3>}
      <div style={{ textAlign: "start" }}>
        {fields.map((field) => (
          <div style={{ marginBlock: 12 }}>{renderField(field)}</div>
        ))}
      </div>
      <div>
        <Button secondary type="reset" onClick={() => history.goBack()}>
          Cancel
        </Button>
        <Button disabled={rest.isSubmitting} primary type="submit">
          Submit
        </Button>
      </div>
      {fetchError && <h4>{fetchError}</h4>}
      {submitFeedback && <p>{submitFeedback}</p>}
    </form>
  );
}

export default withFormik<UpsertPageProps, Record<string, unknown>>({
  handleSubmit() {},
})(UpsertPage);

export interface UpsertPageProps {
  dataFetcher: (id: number) => Promise<unknown>;
  fields: FormField<unknown>[];
  submitUpdate: (id: number, values: unknown) => Promise<unknown>;
  submitCreate: (values: unknown) => Promise<unknown>;
}

export interface FormField<T> {
  label: string;
  name: keyof T;
  type: "number" | "text" | "file" | "pointer";
  items?: () => Promise<unknown[]>;
  itemText?: string;
  itemValue?: string;
}
