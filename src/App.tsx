import React, {ReactNode, useEffect, useState} from 'react';
import './App.css';
import axios from './mocks';


type ColumnTemplate<T> = (value: unknown, key: keyof T, ...args: unknown[]) => ReactNode;
type ColumnData = Record<string, unknown> & { id: number | string };

interface Column<T extends ColumnData> {
    key: keyof T & (string | number),
    header: string,
    body?: ColumnTemplate<T>,
}

axios.get('/students')
    .then(function (response) {
        // handle success
        console.log(response);
    })


function Table<T extends ColumnData>({
                                         columns,
                                         data,
                                         loadMore,
                                         threshold = 10.0
                                     }: { columns: Column<T>[], data: T[], loadMore: Function, threshold?: number }) {
    const [loadingAdditional, setLoadingAdditional] = useState(false);

    const createRow = (row: T) => columns.map(({body, key}) =>
        <td key={key}>{body ? body(row[key], key, row) : `${row[key]}`}</td>);
    const body = data.map(row => <tr key={row.id}>{createRow(row)}</tr>);
    const header = columns.map(({header, key}) => <th key={key}>{header}</th>);

    const scroll = (event: React.UIEvent) => {
        const element = event.target as HTMLElement;
        const scrolled = Math.abs(element.scrollHeight - element.scrollTop - element.clientHeight) <= threshold;
        if (scrolled) {
            setLoadingAdditional(true);
            loadMore();
        }
    }

    useEffect(() => setLoadingAdditional(false), [data]);

    return <div className='table-container' onScroll={scroll}>
        <table>
            <thead>
                <tr>{header}</tr>
            </thead>
            <tbody>{body}</tbody>
            <tfoot>
            <tr>
                <td colSpan={columns.length || 1}>
                    { loadingAdditional ? 'Loading...' : `${ data.length } items` }
                </td>
            </tr>
            </tfoot>
        </table>
    </div>
}


function App() {
    const arr = [
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
            id: 10,
            key1: 'val1',
            key2: 56
        },
        {
            id: 11,
            key1: 'val 45',
            key2: 34
        },
        {
            id: 20,
            key1: 'val1',
            key2: 56
        },
        {
            id: 21,
            key1: 'val 45',
            key2: 34
        },
        {
            id: 30,
            key1: 'val1',
            key2: 56
        },
        {
            id: 31,
            key1: 'val 45',
            key2: 34
        },
        {
            id: 40,
            key1: 'val1',
            key2: 56
        },
        {
            id: 41,
            key1: 'val 45',
            key2: 34
        },
        {
            id: 50,
            key1: 'val1',
            key2: 56
        },
        {
            id: 51,
            key1: 'val 45',
            key2: 34
        },
    ];

    const [data, setData] = useState(arr);

    const columns: Column<typeof data[0]>[] = [
        {
            header: 'header 1',
            key: 'key1',
        },
        {
            header: 'header 2',
            key: 'key2',
            body: (value: any, key: string, row: any) => {
                return <><h1>{value}</h1><span>{row['key1']}</span></>;
            },
        }
    ];

    const load = () => {
        setTimeout(() => {
            setData([...data, ...data].map((row, id) => ({...row, id})));
        }, 1500);
    }

    return <div className='container'>
        <Table columns={columns} data={data} loadMore={load}></Table>
    </div>
}

export default App;
