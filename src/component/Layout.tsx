import React, { useState } from 'react';
import ReactDOM from 'react-dom/client'
//import MyGraphApp from './MyGraphApp'
import { PriorKnowledge, CauseAndEffect } from './MyGraphApp'
import { AnimationDemo } from '../AnimationDemo'
import ShowForm from './Form';
import '../index.css';
import { Layout, Table, Button, Space, Empty, Collapse, Select, Skeleton } from 'antd';
import { UploadOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import UploadAndSet from './UploadAndSet'
import globalConfig from './GlobalConfig';  // 假设这是一个从 globalState 中导入的设置函数


const { Header, Content, Footer, Sider } = Layout;
const { Panel } = Collapse;
export const LayoutContext = React.createContext(null)
const Interface: React
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
        }, [g6Data,     ]);


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
                <Sider
                    className="input-form"
                    collapsible
                    theme="light"
                    collapsedWidth={0}
                    width={400}
                    onCollapse={(value) => setCollapsedL(value)}
                    defaultCollapsed={true}
                >
                    {/*<div className="logo"> Configuration</div>*/}
                    {/*<h5>Configuration</h5>*/}
                    <h5>配置</h5>
                    <div className="show-data" style={{}}>
                        <Collapse>
                            {/*<Panel key={0} header={"Data"}>*/}
                            <Panel key={0} header={"数据集"} forceRender>
                                <Space.Compact style={{ marginBottom: "15px" }}>
                                    <UploadAndSet
                                        onUploadSuccess={handleUploadSuccess}
                                        onRemoveSuccess={handleRemoveSuccess}
                                    />


                                </Space.Compact>
                                <Collapse defaultActiveKey="1" ghost>
                                    {/*<Panel header="Table" key="1">*/}
                                    <Panel header="数据表格" key="1">
                                        <div id="table">
                                            <Table
                                                columns={localTableData.columns}
                                                dataSource={localTableData.dataSource}

                                                scroll={{ y: 240, x: 'max-content' }}
                                                size="small" />
                                        </div>
                                    </Panel>
                                </Collapse>

                            </Panel>
                        </Collapse>
                    </div>

                    <Collapse>
                        {/*<Panel header="Threshold" key="2">*/}
                        <Panel header="阈值设置" key="2" forceRender>

                            <Select
                                allowClear
                                style={{ width: '160px' }}
                                defaultValue="Low"
                                placeholder="选择级别"
                                onSelect={(value) => {
                                    setThreshold(value)
                                }}
                                options={[
                                    { label: 'Low', value: 'Low' },
                                    { label: 'Medium', value: 'Medium' },
                                    { label: 'High', value: 'High' },
                                ]} />
                        </Panel>
                        <Panel header="配置项" key="1" forceRender>
                            <div id="form">
                                {/* <LayoutContext.Provider value={setFormDone}>
                                    <ShowForm />
                                </LayoutContext.Provider> */}
                                <ShowForm />
                            </div>
                        </Panel>
                    </Collapse>


                </Sider>

                <Layout className="site-layout">
                    <Header className="site-layout-background" style={{ padding: 0, }}>
                        <span style={{ fontWeight: "bold" }}>DiCausal</span>
                    </Header>
                    <Content className="site-layout-background" style={{ margin: '0 8px' }}>
                        {/* <div id="prior-knowledge">
                            <LayoutContext.Provider value={threshold}>
                                {g6Data && g6Data.nodes && g6Data.nodes.length > 0 ? <PriorKnowledge
                                    key={Math.random()}
                                    data={g6Data} /> : <Empty />}
                            </LayoutContext.Provider>
                        </div> */}
                        <div id="prior-knowledge">
                            <Empty />
                        </div>
                    </Content>
                    {/*<Footer style={{textAlign: 'center'}}>Ant Design ©2018 Created by Ant UED</Footer>*/}
                </Layout>

                <Sider
                    className="cae-graph"
                    collapsible
                    theme="light"
                    defaultCollapsed={true}
                    reverseArrow={true}
                    collapsedWidth={0}
                    onCollapse={(value) => setCollapsedR(value)}
                    width={600}
                >
                    <div>
                        {/*<h5>Cause-And-Effect</h5>*/}
                        <Button type="primary" onClick={() => {
                            //转
                            setLoadings(prevLoadings => {
                                const newLoadings = [...prevLoadings];
                                newLoadings[0] = true;
                                newLoadings[1] = false;
                                return newLoadings;
                            });
                            //等待三秒执行
                            setTimeout(() => {
                                //不转
                                setLoadings(prevLoadings => {
                                    const newLoadings = [...prevLoadings];
                                    newLoadings[0] = false;
                                    newLoadings[1] = true;
                                    return newLoadings;
                                });
                                // ReactDOM.createRoot(
                                //     document.getElementById('cause-and-effect') as HTMLElement
                                // ).render(<CauseAndEffect/>);
                            }, 3000);
                        }} loading={loadings[0]}>
                            {/*PC Algorithm*/}
                            因果发现
                        </Button>
                    </div>

                    <div id="cause-and-effect">
                        {!loadings[0] && !loadings[1] && <Empty />}
                        {loadings[0] && !loadings[1] && <Skeleton active />}
                        {!loadings[0] && loadings[1] && < CauseAndEffect />}
                    </div>
                </Sider>
            </Layout>
        );
    };

export default Interface;