import { useEffect, useState } from "react";
import { Store } from "../types/storeTypes";
import { storeApi } from "../api/storeApi";
import { Link } from "react-router-dom";
import StoreCard from "../components/StoreCard";
import { Button } from "../components/Button";
import { Container } from "../components/Container";
import styles from "./Stores.module.css";

export default function Stores() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    storeApi
      .list()
      .then((stores) => setStores(stores))
      .finally(() => setLoading(false));
  };

  const deleteStore = (id: number) => {
    setLoading(true);
    storeApi
      .delete(id)
      .then(() => fetchData())
      .finally(() => setLoading(false));
  };

  return (
    <Container>
      <h3 className={styles.header}> Select Store Below... Or </h3>
      <Link to="/upsert-store">
        <Button>Add Store</Button>
      </Link>

      {loading && <h3 className={styles.loading}>Loading...</h3>}

      <div className="text-start" style={{ paddingBlock: 24 }}>
        {stores.map((store) => (
          <StoreCard
            key={store.id}
            store={store}
            onDelete={deleteStore}
            className={"col-4 col-md-3 col-lg-2 " + styles.card}
          />
        ))}
      </div>
    </Container>
  );
}
