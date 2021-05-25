import { Store } from "../../types/storeTypes";
import { Link } from "react-router-dom";
import styles from "./StoreCard.module.css";
import { Button } from "../Button";
import { useHistory } from "react-router-dom";

export function StoreCard({
  store,
  onDelete,
  ...rest
}: {
  store: Store;
  onDelete: (id: number) => void;
  [rest: string]: unknown;
}) {
  const history = useHistory();

  return (
    <>
      <Link
        to={"/store/" + store.id}
        {...rest}
        style={{ display: "inline-block" }}
      >
        <div className={styles.card}>
          <img src={store.logo as string} width="100%" height="200px" />
          <h3 className={styles.title}>{store.name}</h3>
          <div className={styles.buttonContainer}>
            <Button
              onClick={(event) => {
                event.stopPropagation();
                event.preventDefault();
                onDelete(store.id);
              }}
            >
              Delete
            </Button>
            <Button
              secondary
              onClick={(e) => {
                e.preventDefault();
                history.push("/upsert-store/" + store.id);
              }}
            >
              Edit
            </Button>
          </div>
        </div>
      </Link>
    </>
  );
}

export type StoreCardProps = Parameters<typeof StoreCard>[0];
