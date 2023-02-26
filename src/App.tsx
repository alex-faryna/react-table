import React, {useEffect, useState} from 'react';
import './App.css';
import axios from './stub/mocks';
import {Student} from "./models/student.model";
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from "./store";
import {dataLoaded, setLoading} from "./store/studentsState";
import Table, {Column} from './table/table';
import useDebounce from "./debounce";

const columnsConfig: Column<Student>[] = [
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

function Search({ search }: { search: (value: string) => void }) {
    const [value, setValue] = useState('');
    const debouncedValue = useDebounce<string>(value, 500);

    useEffect(() => {
        if (debouncedValue?.length >= 3) {
            search(debouncedValue);
        }
    }, [debouncedValue])

    const input = (val: string) => {
        if (val?.length <= 0) {
            search('');
        }
        setValue(val);
    }

    return <span className='search-container'>
        <input value={value} onChange={event => input(event.target.value)}></input>
        { value?.length ? <span className='clear' onClick={() => {
            setValue('');
            search('');
        }}></span> : null }
    </span>
}

function App() {
    const [search, setSearch] = useState('');
    const dispatch = useDispatch();
    const state = useSelector((state: RootState) => state.students);
    const error = useSelector((state: RootState) => state.students.initialLoading === 'error');
    const loading = useSelector((state: RootState) => state.students.initialLoading === 'loading');
    const additionalLoading = useSelector((state: RootState) => state.students.additionalLoading === 'loading');

    const getStubData = (additional: boolean, skip?: number) => {
        dispatch(setLoading({additional}));
        axios.get('/students', { params: {skip, ...(search && search.length >= 3 && { searchTerm: search })} }).then(res =>
            dispatch(dataLoaded({additional, students: res.data}))
        ).catch(() => dispatch(dataLoaded({ additional, students: [] })));
    }

    useEffect( () => {
        console.log('again');
        getStubData(false, 0);
    }, [search]);

    return <div className='container'>
        <Search search={value => setSearch(value.toLowerCase())}></Search>
        <Table columns={columnsConfig}
               data={loading ? [] : state.students}
               loading={loading}
               error={error}
               additionalLoading={additionalLoading}
               threshold={200}
               loadMore={count => getStubData(true, count)}
        ></Table>
    </div>
}

export default App;
