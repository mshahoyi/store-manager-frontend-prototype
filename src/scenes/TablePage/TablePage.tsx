import {
  Model,
  modelDataTable,
  modelDatatableHeaders,
} from "../../utils/modelHelpers";
import { useEffect, useState } from "react";
import { ApiPaginatedData } from "../../types/sharedTypes";
import { Category } from "../../types/categoryTypes";
import { Product } from "../../types/productTypes";
import PaginationTable from "../../components/PaginationTable";
import { Button } from "../../components/Button";
import { useHistory, useLocation, Link } from "react-router-dom";

export default function TablePage({ model }: { model: Model }) {
  const history = useHistory();
  const location = useLocation();
  const [data, setData] = useState({} as ApiPaginatedData<Category | Product>);
  const [loading, setLoading] = useState(true);
  const [fetchError, setError] = useState(null as null | string);

  useEffect(() => {
    fetchData();
  }, [model]);

  const fetchData = () => {
    setLoading(true);
    modelDataTable[model]()
      .then((data) => {
        setData(data);
        setError(null);
      })
      .catch((e) => setError(e.toString))
      .finally(() => setLoading(false));
  };

  return (
    <>
      <Link to={`${location.pathname}/${model}-upsert`}>
        <Button primary>Add</Button>
      </Link>

      {fetchError && <h5>{fetchError}</h5>}
      <PaginationTable
        headers={modelDatatableHeaders[model]}
        data={[]}
        loading={loading}
      />
    </>
  );
}
