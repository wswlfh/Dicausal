import React, { useState } from 'react';
import ReactDOM from 'react-dom/client'
//import MyGraphApp from './MyGraphApp'
import { PriorKnowledge, CauseAndEffect } from './MyGraphApp'
import { AnimationDemo } from '../AnimationDemo'
import ShowForm from './Form';
import '../index.css';
import { Layout, Table, Button, Space, Empty, Collapse, Select, Row, Col, Card } from 'antd';
import { UploadOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import UploadAndSet from './UploadAndSet'
import globalConfig from './GlobalConfig';  // 假设这是一个从 globalState 中导入的设置函数


const { Header, Content, Footer, Sider } = Layout;
const { Panel } = Collapse;
export const LayoutContext = React.createContext(null)
const App: React
    .FC = () => {
        const [, setCollapsedL] = useState(false);
        const [, setCollapsedR] = useState(false);
        const [loadings, setLoadings] = useState<boolean[]>([]);

        const [threshold, setThreshold] = useState("Low");
        const [formDone, setFormDone] = useState(false);
        const [g6Data, setG6Data] = useState(null); // 初始化 data 为 null


        React.useEffect(() => {
            const handleDataChange = () => {
                let newData = globalConfig.getG6Data();
                if (newData && newData.nodes && newData.nodes.length > 0) { // 检查 newData 是否有效
                    console.log('newDatanewDatanewData', newData);
                    setG6Data(newData);
                }
            };
            globalConfig.addListener(handleDataChange); // 添加监听器
            return () => {
                globalConfig.removeListener(handleDataChange); // 移除监听器
            };
        }, []);

        //画图
        React.useEffect(() => {
            let isDraw = globalConfig.getIsDraw()
            if (g6Data && isDraw) {
                ReactDOM.createRoot(
                    document.getElementById('prior-knowledge')
                ).render(
                    <LayoutContext.Provider value={threshold}>
                        <PriorKnowledge data={g6Data} />
                    </LayoutContext.Provider>
                );
                globalConfig.setIsDraw(false)
            }
        }, [g6Data,]);


        // 用于存储和展示 tableData 的本地状态
        const [localTableData, setLocalTableData] = useState(globalConfig.getCsvTableData());
        // 上传成功后的操作
        const handleUploadSuccess = (data: any) => {
            globalConfig.setCsvTableData(data);

            setLocalTableData(globalConfig.getCsvTableData());  // 更新本地状态
        };
        // 文件移除后的操作
        const handleRemoveSuccess = () => {
            globalConfig.resetCsvTableData()
            setLocalTableData(globalConfig.getCsvTableData());  // 更新本地状态
        };
        // 使用 useEffect 来监听全局状态的变化
        React.useEffect(() => {
            setLocalTableData(globalConfig.getCsvTableData());
        }, []);

        return (

            <Layout style={{ minHeight: '100vh' }}>

                <Layout className="site-layout">
                    <Content className="site-layout-background" >
                        <div>
                            <Card title="数据上传" bordered={false} >
                                <UploadAndSet
                                    onUploadSuccess={handleUploadSuccess}
                                    onRemoveSuccess={handleRemoveSuccess}
                                />
                                <Table
                                    columns={localTableData.columns}
                                    dataSource={localTableData.dataSource}
                                    scroll={{ y: 200, x: 'max-content' }}
                                    size="small" />
                            </Card>
                        </div>
                        <div style={{ marginTop: 10, }}>
                            <ShowForm />
                        </div>


                    </Content>
                </Layout>

            </Layout>
        );
    };

export default App;