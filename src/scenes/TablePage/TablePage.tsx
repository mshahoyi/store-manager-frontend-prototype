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
import { Link, useHistory, useLocation } from "react-router-dom";
import { categoryApi } from "../../api/categoryApi";
import { productApi } from "../../api/productApi";
import axios from "axios";

export default function TablePage({ model }: { model: Model }) {
  const history = useHistory();
  const location = useLocation();
  const [data, setData] = useState({} as ApiPaginatedData<Category | Product>);
  const [loading, setLoading] = useState(true);
  const [fetchError, setError] = useState(null as null | string);

  useEffect(() => {
    fetchData(modelDataTable[model]);
  }, [model]);

  const fetchData = (fetcher: () => Promise<ApiPaginatedData<unknown>>) => {
    setLoading(true);
    fetcher()
      .then((data) => {
        setData(data as ApiPaginatedData<Category & Product>);
        setError(null);
      })
      .catch((e) => {
        setError(e.toString());
      })
      .finally(() => setLoading(false));
  };

  const handleDelete = async (item: Category | Product) => {
    setLoading(true);
    setError(null);
    try {
      if (model === Model.category) await categoryApi.delete(item.id);
      else await productApi.delete(item.id);
      fetchData(modelDataTable[model]);
    } catch (e) {
      setError(e.toString());
      setLoading(false);
    }
  };

  const handlePageChange = (href?: string | null) => {
    if (href) {
      fetchData(() => axios.get(href).then((r) => r.data));
    }
  };

  return (
    <>
      <div style={{ textAlign: "end" }}>
        <Link to={`${location.pathname}/${model}-upsert`}>
          <Button primary>Add</Button>
        </Link>
      </div>

      <PaginationTable
        headers={modelDatatableHeaders[model]}
        data={data}
        loading={loading}
        requestPage={handlePageChange}
        actions={(item) => {
          const modelItem = item as Category | Product;

          return (
            <div>
              <Button
                primary
                onClick={() =>
                  history.push(
                    `${location.pathname}/${model}-upsert/${modelItem.id}`
                  )
                }
              >
                Edit
              </Button>
              <Button secondary onClick={() => handleDelete(modelItem)}>
                Delete
              </Button>
            </div>
          );
        }}
      />
      {fetchError && <h5>{fetchError}</h5>}
    </>
  );
}
