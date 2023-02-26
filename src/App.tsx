import React, {ReactNode, useEffect, useState} from 'react';
import './App.css';
import axios from './stub/mocks';
import {Student} from "./models/student.model";
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from "./store";
import {dataLoaded, setLoading} from "./store/studentsState";
import Table, { Column } from './table/table';

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

function App() {
    const dispatch = useDispatch();
    const state = useSelector((state: RootState) => state.students);
    const loading = useSelector((state: RootState) => state.students.initialLoading === 'loading');
    const additionalLoading = useSelector((state: RootState) => state.students.additionalLoading === 'loading');

    const getStubData = async (additional: boolean, skip?: number) => {
        dispatch(setLoading({additional}));
        // 401 404 etc
        const res = await axios.get('/students', { params: {skip} });
        dispatch(dataLoaded({additional, students: res.data}));
    }

    useEffect( () => void getStubData(false, 0), []);

    return <div className='container'>
        <Table columns={columnsConfig}
               data={state.students}
               loading={loading}
               additionalLoading={additionalLoading}
               threshold={400}
               loadMore={count => getStubData(true, count)}
        ></Table>
    </div>
}

export default App;
