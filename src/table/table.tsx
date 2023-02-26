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
        loading,
        additionalLoading,
        threshold = 10.0
    }: { columns: Column<T>[], data: T[], loadMore?: (count: number) => void, loading: boolean, additionalLoading: boolean, threshold?: number }) {
    const createRow = (row: T) => columns.map((column, idx) =>
        <td key={idx}>{'body' in column ? column.body(row) : `${row[column.key]}`}</td>);

    const body = data.map(row => <tr key={row.id}>{createRow(row)}</tr>);
    const header = columns.map(({header}, idx) => <th key={idx}>{header}</th>);

    const scroll = (event: React.UIEvent) => {
        if (additionalLoading) {
            return;
        }
        const element = event.target as HTMLElement;
        const scrolled = Math.abs(element.scrollHeight - element.scrollTop - element.clientHeight) <= threshold;
        if (scrolled) {
            loadMore && loadMore(data.length);
        }
    }
    const empty = <tr>
        <td colSpan={columns.length || 1}>Empty</td>
    </tr>;

    return <div className='table-container' onScroll={scroll}>
        <table className={data?.length ? '' : 'empty'}>
            <thead>
            <tr>{header}</tr>
            </thead>
            <tbody>{data?.length ? body : empty}</tbody>
            <tfoot>
            <tr>
                <td colSpan={columns.length || 1}>
                    {additionalLoading ? 'Loading...' : `${data.length} items`}
                </td>
            </tr>
            </tfoot>
        </table>
    </div>
}

export default Table;