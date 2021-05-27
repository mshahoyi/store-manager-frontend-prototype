// Render Prop
import React, { ChangeEvent, useEffect, useState } from "react";
import { Formik, FormikProps, withFormik } from "formik";
import { storeApi } from "../api/storeApi";
import { Store } from "../types/storeTypes";
import { useParams } from "react-router-dom";

const StoreUpsert = ({ values, setValues, ...rest }: FormikProps<Store>) => {
  const [loading, setLoading] = useState(false);
  const [store, setStore] = useState({} as Store);
  const { id } = useParams<{ id?: string }>();
  const storeId = Number(id);

  useEffect(() => {
    if (id) {
      setLoading(true);
      storeApi
        .get(storeId)
        .then((store) => {
          setStore(store);
          setValues({ id: store.id } as Store);
        })
        .finally(() => setLoading(false));
    }
  }, []);

  return (
    <div>
      {loading && <h3>Loading...</h3>}
      <form onSubmit={rest.handleSubmit}>
        <div>
          <input
            name="name"
            onChange={(e) => setValues({ ...values, name: e.target.value })}
            onBlur={rest.handleBlur}
            value={values.name === undefined ? store.name || "" : values.name}
          />
          {rest.errors.name && rest.touched.name && rest.errors.name}
        </div>
        <div>
          <img
            src={
              values.logo instanceof File
                ? URL.createObjectURL(values.logo)
                : (store.logo as string)
            }
            width="300"
            height="200"
          />
        </div>
        <div>
          <input
            type="file"
            name="logo"
            onChange={(e) =>
              setValues({ ...values, logo: e.target.files?.[0] || null })
            }
            onBlur={rest.handleBlur}
          />
          {rest.errors.logo && rest.touched.logo && rest.errors.logo}
        </div>
        <button type="submit" disabled={rest.isSubmitting}>
          Submit
        </button>
      </form>
      {rest.isSubmitting && <h3>Submitting...</h3>}
    </div>
  );
};

export default withFormik<{}, Store>({
  handleSubmit(values, { setSubmitting }) {
    setSubmitting(true);
    if (values.id) {
      storeApi.patch(values.id, values).finally(() => setSubmitting(false));
    } else {
      storeApi.post(values).finally(() => setSubmitting(false));
    }
  },
})(StoreUpsert);
