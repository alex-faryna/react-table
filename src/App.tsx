import React, {ReactNode, useEffect, useState} from 'react';
import './App.css';
import axios from './stub/mocks';
import {Student} from "./models/student.model";

type ColumnTemplate<T> = (value: unknown, key: keyof T, ...args: unknown[]) => ReactNode;
type ColumnData = { id: number | string };

interface Column<T extends ColumnData> {
    key: keyof T & (string | number),
    header: string,
    body?: ColumnTemplate<T>,
}

function Table<T extends ColumnData>({ columns, data, loadMore, threshold = 10.0 }: { columns: Column<T>[], data: T[], loadMore?: Function, threshold?: number }) {
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
            loadMore && loadMore();
        }
    }
    const empty = <tr>
        <td colSpan={columns.length || 1}>Empty</td>
    </tr>;

    useEffect(() => setLoadingAdditional(false), [data]);

    return <div className='table-container' onScroll={scroll}>
        <table className={ data?.length ? '' : 'empty' }>
            <thead>
                <tr>{header}</tr>
            </thead>
            <tbody>{ data?.length ? body : empty}</tbody>
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
    const [data, setData] = useState([]);

    const getStubData = async () => {
        const res = await axios.get('/students', {
            params: {
                limit: 20,
            }
        });
        setData(res.data);
    }

    useEffect( () => {
        void getStubData();
    }, []);

    const columns: Column<Student>[] = [
        {
            header: 'Id',
            key: 'id',
        },
        {
            header: 'Name',
            key: 'name',
        },
        {
            header: 'Name',
            key: 'name',
        },
        /*{
            header: 'header 2',
            key: 'key2',
            body: (value: any, key: string, row: any) => {
                return <><h1>{value}</h1><span>{row['key1']}</span></>;
            },
        }*/
    ];

    /*const load = () => {
        setTimeout(() => {
            setData([...data, ...data].map((row, id) => ({...row, id})));
        }, 1500);
    }*/
    // loadMore={load}

    return <div className='container'>
        <Table columns={columns} data={data}></Table>
    </div>
}

export default App;
