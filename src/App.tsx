import React, {ReactNode, useEffect, useState} from 'react';
import './App.css';
import axios from './stub/mocks';
import {Student} from "./models/student.model";

type ColumnTemplate<T> = (row: T) => ReactNode;
type ColumnData = { id: number | string };

type Column<T extends ColumnData> = { header?: string } &
    ({ body: ColumnTemplate<T> } | { key: keyof T & (string | number) });

function Table<T extends ColumnData>({ columns, data, loadMore, threshold = 10.0 }: { columns: Column<T>[], data: T[], loadMore?: (count: number) => void, threshold?: number }) {
    const [loadingAdditional, setLoadingAdditional] = useState(false);

    const createRow = (row: T) => columns.map((column, idx) =>
        <td key={idx}>{ 'body' in column ? column.body(row) : `${row[column.key]}` }</td>);

    const body = data.map(row => <tr key={row.id}>{createRow(row)}</tr>);
    const header = columns.map(({header}, idx) => <th key={idx}>{header}</th>);

    const scroll = (event: React.UIEvent) => {
        const element = event.target as HTMLElement;
        const scrolled = Math.abs(element.scrollHeight - element.scrollTop - element.clientHeight) <= threshold;
        if (scrolled) {
            setLoadingAdditional(true);
            loadMore && loadMore(data.length);
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
    const [data, setData] = useState<Student[]>([]);

    const getStubData = async (skip?: number) => {
        const res = await axios.get('/students', {
            params: {
                skip,
            }
        });
        setData([...data, ...res.data]);
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
            header: 'Lectures attended',
            key: 'lecturesAttended',
        },
        {
            header: 'Total lectures',
            key: 'totalLectures',
        },
        {
            header: 'Grades',
            body: row => {
                const subjects = Object.values(row.marks);
                const max = subjects.reduce((prev, subject ) => prev + subject.totalMarks, 0);
                const current = subjects.reduce((prev, subject ) => prev + subject.marksObtained, 0);
                return <span>{ `${current}/${max}` }</span>;
            }
        }
    ];

    return <div className='container'>
        <Table columns={columns} data={data} threshold={400} loadMore={count => getStubData(count)}></Table>
    </div>
}

export default App;
