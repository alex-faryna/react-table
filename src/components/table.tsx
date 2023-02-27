import React, {ReactNode, useEffect, useState} from "react";

export type ColumnTemplate<T> = (row: T) => ReactNode;
export type ColumnData = { id: number | string };

export type Column<T extends ColumnData> = { header?: string } &
    ({ body: ColumnTemplate<T> } | { key: keyof T & (string | number) });

function Table<T extends ColumnData>(
    {
        columns,
        data,
        loadMore,
        rowClick,
        loading,
        additionalLoading,
        error,
        threshold = 10.0
    }: {
        columns: Column<T>[],
        data: T[],
        rowClick?: (data: T, ev: React.MouseEvent) => void,
        loadMore?: (count: number) => void,
        loading: boolean,
        error: boolean,
        additionalLoading: boolean,
        threshold?: number
    }) {
    const [dots, setDots] = useState(0);

    const createRow = (row: T) => columns.map((column, idx) =>
        <td key={idx} onClick={ev => rowClick?.(row, ev)}>
            {'body' in column ? column.body(row) : `${row[column.key]}`}
        </td>);

    const body = data.map(row => <tr key={row.id}>{createRow(row)}</tr>);
    const header = columns.map(({header}, idx) => <th key={idx}>{header}</th>);

    const scroll = (event: React.UIEvent) => {
        if (loading || additionalLoading) {
            return;
        }
        const element = event.target as HTMLElement;
        const scrolled = Math.abs(element.scrollHeight - element.scrollTop - element.clientHeight) <= threshold;
        if (scrolled) {
            loadMore && loadMore(loading ? 0 : data.length);
        }
    }
    const empty = <tr>
        <td colSpan={columns.length || 1}>Empty</td>
    </tr>;

    const loadingTemplate = <tr>
        <td colSpan={columns.length || 1}>Loading{'.'.repeat(dots)}</td>
    </tr>;

    useEffect(() => {
        const intervalId = setInterval(() => {
            setDots((dots) => (dots + 1) % 4);
        }, 500);
        return () => clearInterval(intervalId);
    }, []);

    return <div className='table-container' onScroll={scroll}>
        <table className={data?.length ? '' : 'empty'}>
            <thead>
            <tr>{header}</tr>
            </thead>
            <tbody>{loading ? loadingTemplate : (data?.length ? body : empty)}</tbody>
            <tfoot>
            <tr>
                <td colSpan={columns.length || 1}>
                    {additionalLoading ? 'Loading...' : (error ? 'Error loading data' : `${loading ? 0 : data.length} items`)}
                </td>
            </tr>
            </tfoot>
        </table>
    </div>
}

export default Table;