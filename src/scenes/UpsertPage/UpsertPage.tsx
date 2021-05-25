import { useParams } from "react-router-dom";
import { ChangeEvent, useEffect, useState } from "react";
import { Product } from "../../types/productTypes";
import { Category } from "../../types/categoryTypes";
import { FormikProps, withFormik } from "formik";
import { setValueAtKeyPath } from "../../utils/sharedUtils";

function UpsertPage({
  dataFetcher,
  fields,
  values,
  setValues,
  ...rest
}: UpsertPageProps & FormikProps<Category | Product>) {
  const { id } = useParams<{ id?: string }>();
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null as string | null);
  const [data, setData] = useState({} as Record<string, unknown>);

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, []);

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
            <>
              <label htmlFor={field.name as string}>{field.label}</label>
              <input
                value={data[field.name as string] as string}
                onChange={handleChange}
                onBlur={rest.handleBlur}
                name={field.name as string}
                type={field.type}
              />
            </>
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

  return <>{renderFields(fields)}</>;
}

export default withFormik<UpsertPageProps, Product | Category>({
  handleSubmit() {},
})(UpsertPage);

export interface UpsertPageProps {
  dataFetcher: (id: number) => Promise<unknown>;
  fields: FormField<unknown>[];
}

export interface FormField<T> {
  label: string;
  name: keyof T;
  type: "number" | "text" | "file" | "pointer";
}
