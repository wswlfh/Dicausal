import React, {useState} from 'react';
import {
    MinusCircleOutlined, PlusOutlined,
    PlayCircleTwoTone, UploadOutlined, ExportOutlined
} from '@ant-design/icons';
import {
    Button, Form, Space,
    Collapse, Slider, Tooltip, InputNumber,
    Row, Col, Select, Upload
} from 'antd';
import ReactDOM from "react-dom/client";
import {PriorKnowledge} from "./MyGraphApp";

const {Panel} = Collapse;

const areas = [
    {label: 'plcg', value: 'plcg'},
    {label: 'PIP3', value: 'PIP3'},
    {label: 'PIP2', value: 'PIP2'},
    {label: 'PKC', value: 'PKC'},
    {label: 'PKA', value: 'PKA'},
    {label: 'praf', value: 'praf'},
    {label: 'pjnk', value: 'pjnk'},
    {label: 'p38', value: 'p38'},
    {label: 'pmek', value: 'pmek'},
    {label: 'p4442', value: 'p4442'},
    {label: 'pakts473', value: 'pakts473'},
];

const App: React.FC = () => {
    //表单数据的毁回调使用
    const onFinish = (values: any) => {
        console.log('Received values of form:', values);
    };

    //表格提交的等待状态
    const [loadings, setLoadings] = useState<boolean[]>([]);


    const annotation = {
        subGraph: 'Apply domain knowledge to divide variables into groups to get causal relationships ',
        keyEffects: 'Key effects  indicate the end of the sub-graph. They can be influenced by variables of the\n' +
            'same group and key effects of its upstream groups. \n',
        threshold: 'threshold is the limit of levels of getting the causal relationships',
        finalEffect: 'Final effects indicate the end of the graph. They will not influence any other variables'
    }

    const IntegerStep = () => {
        const [inputValue, setInputValue] = useState(1);
        const onChange = (newValue: number) => {
            setInputValue(newValue);
        };

        return (
            <Row>
                <Col span={10}>
                    <Slider
                        min={1}
                        max={10}
                        onChange={onChange}
                        value={typeof inputValue === 'number' ? inputValue : 5}
                    />
                </Col>
                <Col span={4}>
                    <InputNumber
                        min={1}
                        max={10}
                        defaultValue={5}
                        style={{margin: '0 16px'}}
                        value={inputValue}
                        onChange={onChange}
                    />
                </Col>
            </Row>

        );
    };

    return (
        <Form name="configuration" onFinish={onFinish} autoComplete="off">
            <Collapse>
                <Panel header="Config" key="1">
                    <Space style={{marginBottom: "15px"}}>
                        <Upload>
                            <Button>
                                <UploadOutlined/> Upload
                            </Button>
                        </Upload>
                        <Upload>
                            <Button>
                                <ExportOutlined/> Export
                            </Button>
                        </Upload>
                    </Space>
                    <Form.Item>
                        <Space>
                            <Tooltip title={annotation.subGraph} color={'blue'}>
                                <Button type="dashed">sub-graphs</Button>
                            </Tooltip>
                            <Tooltip title={annotation.keyEffects} color={'blue'}>
                                <Button type="dashed">key effects</Button>
                            </Tooltip>
                        </Space>
                    </Form.Item>


                    <Form.List name="config">
                        {(fields, {add, remove}) => (
                            <>

                                {fields.map(({key, name, ...restField}) => (
                                    <div>
                                        <label>sub{key}</label>
                                        <Space key={key} style={{display: 'flex',}} align="baseline">
                                            <Form.Item
                                                {...restField}

                                                //name后面接的是input的value的key
                                                name={[name, 'variable']}
                                            >
                                                <Select
                                                    mode="multiple"
                                                    allowClear
                                                    style={{width: '160px'}}
                                                    placeholder="Select variable"
                                                    options={areas}/>
                                            </Form.Item>
                                            <Form.Item
                                                {...restField}
                                                //name后面接的是input的value的key
                                                name={[name, 'key_effect']}
                                            >
                                                <Select
                                                    mode="multiple"
                                                    allowClear
                                                    style={{width: '150px'}}
                                                    placeholder="Select key effect"
                                                    options={areas}/>
                                            </Form.Item>
                                            <MinusCircleOutlined onClick={() => remove(name)}/>
                                        </Space>
                                    </div>
                                ))}
                                <Form.Item>
                                    <Button onClick={() => add()} block icon={<PlusOutlined/>}>
                                        Add Sub-Graphs
                                    </Button>
                                </Form.Item>

                                <Form.Item>
                                    <Tooltip title={annotation.threshold} color={'blue'}>
                                        <Button type="dashed">threshold</Button>
                                    </Tooltip>
                                    <IntegerStep/>
                                </Form.Item>

                                <Form.Item>
                                    <Tooltip title={annotation.finalEffect} color={'blue'}>
                                        <Button type="dashed">final effect</Button>
                                    </Tooltip>

                                    <Select
                                        mode="multiple"
                                        allowClear
                                        style={{width: '150px'}}
                                        placeholder="Select final effect"
                                        options={areas}/>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>
                </Panel>
            </Collapse>

            <br/>
            <Form.Item>
                <Tooltip title={'Run'} color={'blue'}>
                    <Button type="primary"
                            htmlType="submit"
                            style={{marginLeft: '80%'}}
                            onClick={() => {
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
                                        document.getElementById('prior-knowledge') as HTMLElement
                                    ).render(<PriorKnowledge/>);
                                }, 3000)
                            }}
                            loading={loadings[0]}>
                        <PlayCircleTwoTone/>
                    </Button>
                </Tooltip>
            </Form.Item>
        </Form>
    );
};

export default App;