import styles from "./PaginationTable.module.css";

export default function PaginationTable<T>({
  headers,
  data,
  loading,
}: {
  headers: PaginationTableHeader<T>[];
  data: T[];
  loading?: boolean;
}) {
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
          </tr>
        </thead>

        {loading && <h5>Loading...</h5>}
      </table>
    </>
  );
}

export interface PaginationTableHeader<T> {
  value: keyof T | string | ((item: T) => string | number | undefined | null);
  text: string;
}
