import styles from "./PaginationTable.module.css";
import { getValueAtKeyPath } from "../../utils/sharedUtils";
import { ApiPaginatedData } from "../../types/sharedTypes";
import { useState } from "react";

const itemsPerPage = 5;

export default function PaginationTable({
  headers,
  data,
  loading,
  actions,
  requestPage,
}: {
  headers: PaginationTableHeader<unknown>[];
  data?: ApiPaginatedData<unknown>;
  loading?: boolean;
  actions?: (item: unknown) => JSX.Element;
  requestPage: (href?: string | null) => void;
}) {
  const [currentPage, setCurrentPage] = useState();

  const getValue = (
    item: unknown,
    value: string | ((item: unknown) => unknown)
  ) => {
    if (typeof value === "function") {
      return value(item);
    } else if (typeof value === "string") {
      return getValueAtKeyPath(item as Record<string, unknown>, value);
    } else {
      return value;
    }
  };

  const pageNoArray = () => {
    if (data?.count) {
      const numberOfPages = Math.ceil(data.count / itemsPerPage);
      return Array.from(Array(numberOfPages).keys()).map((n) => n + 1);
    }
    return [1];
  };

  return (
    <>
      <table>
        <thead>
          <tr className={styles.headerRow}>
            {headers.map((header) => (
              <th key={header.text} className={styles.headerCell}>
                {header.text}
              </th>
            ))}
            <th className={styles.headerCell}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {data?.results?.map((item, i) => (
            <tr key={i}>
              {headers.map((header, i) => (
                <td key={i}>{getValue(item, header.value) as string}</td>
              ))}
              {actions && <td>{actions(item)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
      {/*  Pagination */}
      <div
        style={{
          textAlign: "start",
          backgroundColor: "lightcyan",
          marginBlock: 24,
        }}
      >
        Pages
        <div style={{ marginBlock: 12 }}>
          <span
            style={{ marginInline: 12, color: data?.first ? "black" : "gray" }}
            onClick={() => requestPage(data?.first)}
          >
            First
          </span>

          <span
            style={{ marginInline: 12, color: data?.prev ? "black" : "gray" }}
            onClick={() => requestPage(data?.prev)}
          >
            Prev
          </span>
          <span
            style={{ marginInline: 12, color: data?.next ? "black" : "gray" }}
            onClick={() => requestPage(data?.next)}
          >
            Next
          </span>
          <span
            style={{ marginInline: 12, color: data?.last ? "black" : "gray" }}
            onClick={() => requestPage(data?.last)}
          >
            Last
          </span>
        </div>
      </div>
      {loading && <h5>Loading...</h5>}
    </>
  );
}

export interface PaginationTableHeader<T> {
  value: keyof T | string | ((item: T) => string | number | undefined | null);
  text: string;
}
