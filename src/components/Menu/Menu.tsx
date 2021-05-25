import { AppState } from "../../redux/store";
import { connect, ConnectedProps } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import styles from "./Menu.module.css";

function Menu({ store }: ReduxProps) {
  const location = useLocation();

  const productsPath = `/store/${store?.id}/products`;
  const categoriesPath = `/store/${store?.id}/categories`;

  const activeClass = (path: string) =>
    new RegExp(path).test(location.pathname) && styles.active;

  return (
    <ul className={styles.ul}>
      <div className={styles.routes}>
        <img
          width="60"
          height="40"
          src={(store || {}).logo as string}
          style={{ marginInline: 12 }}
        />
        <li className={styles.li}>
          <Link
            className={`${styles.a} ${activeClass(productsPath)}`}
            to={productsPath}
          >
            Products
          </Link>
        </li>
        <li className={styles.li}>
          <Link
            className={`${styles.a} ${activeClass(categoriesPath)}`}
            to={categoriesPath}
          >
            Categories
          </Link>
        </li>
      </div>
      <li className={styles.li} style={{ float: "right" }}>
        <Link className={styles.a} to="/">
          Sign out
        </Link>
      </li>
    </ul>
  );
}

const connector = connect((state: AppState) => ({ store: state.store }));
type ReduxProps = ConnectedProps<typeof connector>;
export default connector(Menu);
