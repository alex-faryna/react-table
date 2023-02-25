import React, { ReactNode } from 'react';
import './App.css';

type ColumnTemplate<T> = (value: unknown, key: keyof T, ...args: unknown[]) => ReactNode;
type ColumnData = Record<string, unknown> & { id: number | string };

interface Column<T extends ColumnData> {
    key: keyof T & (string | number),
    header: string,
    body?: ColumnTemplate<T>,
}

function Table<T extends ColumnData>({ columns, data }: { columns: Column<T>[], data: T[] }) {
    const createRow = (row: T) => columns.map(({ body, key }) =>
        <td key={key}>{ body ? body(row[key], key, row) : `${row[key]}` }</td>);
    const body = data.map(row => <tr key={row.id}>{ createRow(row) }</tr>);
    const header = columns.map(({ header, key }) => <th key={key}>{ header }</th>);

    return <div className='table-container'>
        <table>
            <thead>
            <tr>
                { header }
            </tr>
            </thead>
            <tbody>
            { body }
            </tbody>
        </table>
    </div>
}


function App() {

    const data = [
        {
            id: 0,
            key1: 'val1',
            key2: 56
        },
        {
            id: 1,
            key1: 'val 45',
            key2: 34
        },
        {
            id: 0,
            key1: 'val1',
            key2: 56
        },
        {
            id: 1,
            key1: 'val 45',
            key2: 34
        },
        {
            id: 0,
            key1: 'val1',
            key2: 56
        },
        {
            id: 1,
            key1: 'val 45',
            key2: 34
        },{
            id: 0,
            key1: 'val1',
            key2: 56
        },
        {
            id: 1,
            key1: 'val 45',
            key2: 34
        },{
            id: 0,
            key1: 'val1',
            key2: 56
        },
        {
            id: 1,
            key1: 'val 45',
            key2: 34
        },{
            id: 0,
            key1: 'val1',
            key2: 56
        },
        {
            id: 1,
            key1: 'val 45',
            key2: 34
        },{
            id: 0,
            key1: 'val1',
            key2: 56
        },
        {
            id: 1,
            key1: 'val 45',
            key2: 34
        },{
            id: 0,
            key1: 'val1',
            key2: 56
        },
        {
            id: 1,
            key1: 'val 45',
            key2: 34
        },
    ]

    const columns: Column<typeof data[0]>[] = [
        {
            header: 'header 1',
            key: 'key1',
        },
        {
            header: 'header 2',
            key: 'key2',
            body: (value: any, key: string, row: any) => {
                return <><h1>{ value }</h1><span>{ row['key1'] }</span></>;
            },
        }
    ];

    return <div className='container'>
        <Table columns={columns} data={data}></Table>
    </div>
}

export default App;
