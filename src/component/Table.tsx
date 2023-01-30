import React from 'react';
// import 'antd/dist/antd.css';
import {Table} from 'antd';


interface DataType {
    key: React.Key;
    plcg: String;
    PIP3: String;
    PIP2: String;
    PKC: String;
    PKA: String;
    praf: String;
    pjnk: String;
    p38: String;
    pmek: String;
    p4442: String;
    pakts473: String;
}

const columns = [

    {
        title: 'plcg',
        dataIndex: 'plcg',
    },
    {
        title: 'PIP3',
        dataIndex: 'PIP3',
    },
    {
        title: 'PIP2',
        dataIndex: 'PIP2',
    },
    {
        title: 'PKC',
        dataIndex: 'PKC',
    },
    {
        title: 'PKA',
        dataIndex: 'PKA',
    },
    {
        title: 'pjnk',
        dataIndex: 'pjnk',
    },
    {
        title: 'p38',
        dataIndex: 'p38',
    },
    {
        title: 'pmek',
        dataIndex: 'pmek',
    },
    {
        title: 'p4442',
        dataIndex: 'p4442',
    },
    {
        title: 'pakts473',
        dataIndex: 'pakts473',
    },

];

const data: DataType[] = [];
for (let i = 0; i < 30; i++) {
    data.push({
        key: i,
        plcg: (Math.random() * 1000).toFixed(2),
        PIP3: (Math.random() * 1000).toFixed(2),
        PIP2: (Math.random() * 1000).toFixed(2),
        PKC: (Math.random() * 1000).toFixed(2),
        PKA: (Math.random() * 1000).toFixed(2),
        praf: (Math.random() * 1000).toFixed(2),
        pjnk: (Math.random() * 1000).toFixed(2),
        p38: (Math.random() * 1000).toFixed(2),
        pmek: (Math.random() * 1000).toFixed(2),
        p4442: (Math.random() * 1000).toFixed(2),
        pakts473: (Math.random() * 1000).toFixed(2),
    });
}
//@ts-ignore
const App: React.FC = () => <Table columns={columns} dataSource={data} scroll={{y: 250, x: '100vw'}}/>;

export default App;