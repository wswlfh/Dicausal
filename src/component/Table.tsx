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

interface DataType2 {
    key: React.Key;
    1: String;
    2: String;
    3: String;
    4: String;
    5: String;
    6: String;
    7: String;
    8: String;
    9: String;
    10: String;
    11: String;
    12: String;
    13: String;
    14: String;
    15: String;
    16: String;
    17: String;
    18: String;
    19: String;
    20: String;
    21: String;
    22: String;
    23: String;
    24: String;
    25: String;
    26: String;
    27: String;
    28: String;
    29: String;
}





const columns2 = [
    {
        title: '切片流量',
        dataIndex: '1',
    },
     {
        title: '烟叶流量',
        dataIndex: '2',
    },
     {
        title: '切前润叶入口水分',
        dataIndex: '3',
    },
     {
        title: '水流量调节量',
        dataIndex: '4',
    },
     {
        title: '加水累积量',
        dataIndex: '5',
    },
     {
        title: '水流量',
        dataIndex: '6',
    },
     {
        title: '大片率',
        dataIndex: '7',
    },
     {
        title: '中片率',
        dataIndex: '8',
    },
     {
        title: '烘前水分_x',
        dataIndex: '9',
    },
     {
        title: 'KLD烘后温度',
        dataIndex: '10',
    },
     {
        title: 'HDT烘前水分',
        dataIndex: '11',
    },
     {
        title: '烘前皮带秤',
        dataIndex: '12',
    },
     {
        title: 'KLD区1筒壁温度',
        dataIndex: '13',
    },
     {
        title: '叶丝填充值',
        dataIndex: '14',
    },
     {
        title: '叶丝长丝率',
        dataIndex: '15',
    },
     {
        title: '叶丝中丝率',
        dataIndex: '16',
    },
     {
        title: '计划投料量',
        dataIndex: '17',
    },
     {
        title: '片烟秤重量',
        dataIndex: '18',
    },
     {
        title: '计划修正量',
        dataIndex: '19',
    },
     {
        title: '片烟修正量',
        dataIndex: '20',
    },
     {
        title: '投料片烟水分',
        dataIndex: '21',
    },
     {
        title: '叶丝装箱水分',
        dataIndex: '22',
    },
     {
        title: '其他批次叶丝秤量',
        dataIndex: '23',
    },
     {
        title: 'C_QTY1',
        dataIndex: '24',
    },
     {
        title: '烟丝填充值',
        dataIndex: '25',
    },
     {
        title: '烟丝长丝率',
        dataIndex: '27',
    },
     {
        title: '烟丝中丝率',
        dataIndex: '28',
    },
    {
        title: '总出丝率',
        dataIndex: '29',
    },


];

const data: DataType2[] = [];
for (let i = 0; i < 300; i++) {
    data.push({
        key: i,
        1: (Math.random() * 1000).toFixed(2),
        2: (Math.random() * 1000).toFixed(2),
        3: (Math.random() * 1000).toFixed(2),
        4: (Math.random() * 1000).toFixed(2),
        5: (Math.random() * 1000).toFixed(2),
        6: (Math.random() * 1000).toFixed(2),
        7: (Math.random() * 1000).toFixed(2),
        8: (Math.random() * 1000).toFixed(2),
        9: (Math.random() * 1000).toFixed(2),
        10: (Math.random() * 1000).toFixed(2),
        11: (Math.random() * 1000).toFixed(2),
        12: (Math.random() * 1000).toFixed(2),
        13: (Math.random() * 1000).toFixed(2),
        14: (Math.random() * 1000).toFixed(2),
        15: (Math.random() * 1000).toFixed(2),
        16: (Math.random() * 1000).toFixed(2),
        17: (Math.random() * 1000).toFixed(2),
        18: (Math.random() * 1000).toFixed(2),
        19: (Math.random() * 1000).toFixed(2),
        20: (Math.random() * 1000).toFixed(2),
        21: (Math.random() * 1000).toFixed(2),
        22: (Math.random() * 1000).toFixed(2),
        23: (Math.random() * 1000).toFixed(2),
        24: (Math.random() * 1000).toFixed(2),
        25: (Math.random() * 1000).toFixed(2),
        26: (Math.random() * 1000).toFixed(2),
        27: (Math.random() * 1000).toFixed(2),
        28: (Math.random() * 1000).toFixed(2),
        29: (Math.random() * 1000).toFixed(2),
    });
}
//@ts-ignore
const App: React.FC = () => <Table columns={columns2} dataSource={data} scroll={{y: 250, x: '250vw'}}/>;

export default App;