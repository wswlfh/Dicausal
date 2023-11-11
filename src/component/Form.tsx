import React, { useState } from 'react';
import { MinusCircleOutlined, QuestionCircleOutlined, UploadOutlined, ExportOutlined } from "@ant-design/icons";
import { Button, Form, Select, Space, Tooltip, Upload, Checkbox, Divider, Row, Col, Spin, notification, Image, Card } from "antd";
import globalConfig from './GlobalConfig';
import { sendFormData } from './utils/api';

import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';

const CheckboxGroup = Checkbox.Group;
// const filteredOptions = ['Apple', 'Pear', 'Orange'];





interface FormData {
    list: Array<{ sub: number, effect: string[], key_effect: string[] }>;
    final_effect: string[];
}


const App: React.FC = () => {
    const [form] = Form.useForm();

    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [shapData, setShapData] = useState(null);
    const [filteredOptions, setFilteredOptions] = useState<string[]>([]);
    const [hasSetFilteredOptions, setHasSetFilteredOptions] = useState(false);


    const [checkedList, setCheckedList] = useState<CheckboxValueType[]>([]);

    const checkAll = filteredOptions.length === checkedList.length;
    const indeterminate = checkedList.length > 0 && checkedList.length < filteredOptions.length;

    const onChange = (list: CheckboxValueType[]) => {
        setCheckedList(list);
    };

    const onCheckAllChange = (e: CheckboxChangeEvent) => {
        setCheckedList(e.target.checked ? filteredOptions : []);
    };



    React.useEffect(() => {
        const updateFilteredOptions = () => {
            // 仅在第一次时设置 filteredOptions
            if (!hasSetFilteredOptions) {
                setFilteredOptions(globalConfig.getColumnTitles());
                setHasSetFilteredOptions(true);  // 更新标志状态
            }
        };
        // 在这里添加监听器
        globalConfig.addListener(updateFilteredOptions);

        // 清理函数：移除监听器
        return () => {
            globalConfig.removeListener(updateFilteredOptions);
        };
    }, [hasSetFilteredOptions]);

    React.useEffect(() => {
        const updateForm = () => {
            const newGlobalForm = globalConfig.getGlobalForm();
            form.setFieldsValue(newGlobalForm);
        };
        globalConfig.addListener(updateForm);
        // 在组件卸载时移除监听器
        return () => {
            globalConfig.removeListener(updateForm);
        };
    }, [form]);



    const getImages = (thresholdData: any) => {
        const { threshold_1, threshold_2, threshold_3 } = thresholdData;
        const { shap_1, shap_2, shap_3 } = threshold_1;
        return (
            <Image.PreviewGroup>
                <Image height={250} width={700}
                    style={{ objectFit: 'contain' }}
                    src={`data:image/png;base64,${shap_1}`} />

                <Image height={250} width={700}
                    style={{ objectFit: 'contain' }}
                    src={`data:image/png;base64,${shap_2}`} />

            </Image.PreviewGroup>
        );
    };

    const onFinish = async (values: FormData) => {
        if (!values || !values.final_effect) return
        values.list = [{ sub: 0, effect: [], key_effect: [] }]
        console.log(values);
        notification.open({
            message: '正在加载...',
            description: <Spin size="large" />,
            duration: 0,  // 0 表示不会自动关闭
            key: 'loadingNotification',
            placement: 'topRight', // 设置弹窗出现的位置
        });
        sendFormData(values, values.final_effect[0], checkedList)
            .then((response) => {
                notification.open({
                    message: '',
                    duration: 0.1,  // 0 表示不会自动关闭
                    key: 'loadingNotification',
                    placement: 'topRight', // 设置弹窗出现的位置
                });
                const data = Object.values(response)[0];
                //@ts-ignore
                setShapData(data)
            })

    };


    return (
        <div>

            <Row gutter={16}>
                <Col span={8}>
                    <Card title="配置" bordered={false} >

                        <div style={{ marginBottom: 20 }}>
                            <Checkbox
                                indeterminate={indeterminate}
                                onChange={onCheckAllChange}
                                checked={checkAll}
                            >
                                全选
                            </Checkbox>
                            <div style={{ borderTop: '1px dashed #8b8888', margin: '5px 0' }}></div>
                            <div style={{ height: '300px', overflowY: 'auto' }}>
                                <Checkbox.Group style={{ width: '100%' }} value={checkedList} onChange={onChange}>
                                    <Row>
                                        {filteredOptions.map(option => (
                                            <Col span={24} key={option} style={{ margin: '5px 0' }}>
                                                <Checkbox value={option}>{option}</Checkbox>
                                            </Col>
                                        ))}
                                    </Row>
                                </Checkbox.Group>
                            </div>
                        </div>

                        <Form
                            form={form}
                            wrapperCol={{ span: 24 }}
                            autoComplete="off"
                            onFinish={onFinish}
                        >

                            <Form.Item label="最终指标" name="final_effect">
                                <Select
                                    mode="multiple"
                                    placeholder="选择最终指标"
                                    onChange={(values: string[]) => {
                                        values.forEach(value => {
                                            if (!selectedItems.includes(value)) {
                                                setSelectedItems(prevArray => [...prevArray, value]);
                                                setFilteredOptions(prevArray => prevArray.filter(e => e !== value));
                                            }
                                        });
                                    }}
                                    onDeselect={(value) => {
                                        setSelectedItems(prevArray => prevArray.filter(e => e !== value));
                                        setFilteredOptions(prevArray => [...prevArray, value]);
                                    }}
                                    options={filteredOptions.map((item) => ({
                                        value: item,
                                        label: item,
                                    }))}
                                />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit">
                                    提交
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>
                <Col span={16}>
                    <Card title="特征贡献度" bordered={false} >
                        {shapData && getImages(shapData)}
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default App;
