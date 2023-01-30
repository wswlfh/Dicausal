import React, {useState} from 'react';
import ReactDOM from 'react-dom/client'
//import MyGraphApp from './MyGraphApp'
import {PriorKnowledge, CauseAndEffect} from './MyGraphApp'
import {AnimationDemo} from '../AnimationDemo'
import ShowForm from './Form';
import '../index.css';
import {Layout, Upload, Button, Space, Empty, Collapse} from 'antd';
import {UploadOutlined, ExclamationCircleFilled} from '@ant-design/icons';
import ShowTable from './Table'

const {Header, Content, Footer, Sider} = Layout;
const {Panel} = Collapse;
const App: React
    .FC = () => {
    const [, setCollapsedL] = useState(false);
    const [, setCollapsedR] = useState(false);
    const [loadings, setLoadings] = useState<boolean[]>([]);
    return (

        <Layout style={{minHeight: '100vh'}}>
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
                <h5>Configuration</h5>
                <div className="show-data" style={{}}>
                    <Collapse>
                        <Panel key={0} header={"Data"}>
                            <Space.Compact style={{marginBottom: "15px"}}>
                                <Upload>
                                    <Button>
                                        <UploadOutlined/> Upload
                                    </Button>
                                </Upload>

                                <Button type="primary" onClick={() => {
                                    //转
                                    setLoadings(prevLoadings => {
                                        const newLoadings = [...prevLoadings];
                                        newLoadings[0] = true;
                                        return newLoadings;
                                    });
                                    //等待三秒执行
                                    setTimeout(() => {
                                        //不转
                                        setLoadings(prevLoadings => {
                                            const newLoadings = [...prevLoadings];
                                            newLoadings[0] = false;
                                            return newLoadings;
                                        });
                                        ReactDOM.createRoot(
                                            document.getElementById('table') as HTMLElement
                                        ).render(<ShowTable/>);
                                    }, 3000);
                                }} loading={loadings[0]}>Analysis</Button>
                            </Space.Compact>
                            <Collapse defaultActiveKey="1" ghost>
                                <Panel header="Table" key="1">
                                    <div id="table"/>
                                </Panel>
                            </Collapse>

                        </Panel>
                    </Collapse>
                </div>
                <div id="form">
                    <ShowForm/>
                </div>
            </Sider>

            <Layout className="site-layout">
                <Header className="site-layout-background" style={{padding: 0,}}>
                    <text style={{fontWeight: "bold"}}>DiCausal</text>
                </Header>
                <Content className="site-layout-background" style={{margin: '0 8px'}}>
                    <div id="prior-knowledge">
                        <Empty/>
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
                    <h5>Cause-And-Effect</h5>
                    <Button type="primary" onClick={() => {
                        ReactDOM.createRoot(
                            document.getElementById('cause-and-effect') as HTMLElement
                        ).render(<CauseAndEffect/>);
                    }
                    }>Generate</Button>
                </div>

                <div id="cause-and-effect">
                    <Empty/>
                </div>
            </Sider>
        </Layout>
    );
};

export default App;