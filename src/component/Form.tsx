import React, { useState } from 'react';
import { MinusCircleOutlined, QuestionCircleOutlined, UploadOutlined, ExportOutlined } from "@ant-design/icons";
import { Button, Form, Select, Space, Tooltip, Upload } from "antd";
import globalConfig from './GlobalConfig';
import { sendFormData } from './utils/api'

const annotation = {
    subGraph: '利用专家应用领域知识对参数进行划分和分组，形成子系统 ',
    keyEffects: '关键指标表示子系统的终点。它们可能受到同一组变量及其上游组的关键影响。',
    threshold: '阈值级别的高低影响因果发现的效果',
    finalEffect: '最终指标是所有子系统的终点'
}

interface FormData {
    list: Array<{ sub: number, effect: string[], key_effect: string[] }>;
    final_effect: string[];
}


const App: React.FC = () => {
    const [form] = Form.useForm();

    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [filteredOptions, setFilteredOptions] = useState<string[]>([]);
    const [hasSetFilteredOptions, setHasSetFilteredOptions] = useState(false);

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
            // 假设你在 GlobalConfig 类中添加了 removeListener 方法
            globalConfig.removeListener(updateForm);
        };
    }, [form]);



    const onFinish = async (values: FormData) => {
        console.log("Received values of form:", values);
        globalConfig.setGlobalForm(values);
        globalConfig.setIsDraw(true)
    };

    const exportToJsonFile = () => {
        const values = form.getFieldsValue();
        const modifiedList = values.list.map((item: any, index: any) => {
            return { sub: index, ...item };
        });
        const modifiedValues = { ...values, list: modifiedList };
        const jsonString = JSON.stringify(modifiedValues, null, 2);
        const blob = new Blob([jsonString], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "config.json";
        a.click();
        URL.revokeObjectURL(url);
    };


    const beforeUpload = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const jsonString = e.target?.result?.toString();
            if (jsonString) {
                const values = JSON.parse(jsonString);
                form.setFieldsValue(values);
            }
        };
        reader.readAsText(file);
        return false;
    };




    return (
        <Form
            form={form}
            wrapperCol={{ span: 24 }}
            autoComplete="off"
            onFinish={onFinish}
        >
            <Space style={{ marginBottom: "15px" }}>
                <Upload showUploadList={false} beforeUpload={beforeUpload}>
                    <Button>
                        <UploadOutlined /> 上传
                    </Button>
                </Upload>
                <Button onClick={exportToJsonFile}>
                    <ExportOutlined /> 导出
                </Button>
            </Space>

            <Form.Item>
                <Space>
                    <Tooltip title={annotation.subGraph} color={'blue'}>
                        <QuestionCircleOutlined />
                        <span>子系统</span>
                    </Tooltip>
                    <Tooltip title={annotation.keyEffects} color={'blue'}>
                        <QuestionCircleOutlined />
                        <span> 关键指标</span>
                    </Tooltip>
                </Space>
            </Form.Item>

            <Form.Item>
                <Form.List name="list">
                    {(subFields, subOpt) => (
                        <div
                            style={{ display: "flex", flexDirection: "column", rowGap: 16 }}
                        >
                            {subFields.map((subField) => (
                                <div key={subField.key}>
                                    <span>sub{subField.key}</span>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ flex: 1, marginRight: '10px' }}>
                                            <Form.Item noStyle name={[subField.name, "effect"]}>
                                                <Select
                                                    mode="multiple"
                                                    placeholder="选择一般参数"
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
                                        </div>
                                        <div style={{ flex: 1, marginRight: '10px' }}>
                                            <Form.Item style={{ flex: 1, marginLeft: '10px' }} noStyle name={[subField.name, "key_effect"]}>
                                                <Select
                                                    mode="multiple"
                                                    placeholder="选择关键指标"
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
                                        </div>
                                        <MinusCircleOutlined
                                            onClick={() => {
                                                subOpt.remove(subField.name);
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                            <Button type="dashed" onClick={() => subOpt.add()} block>
                                + 添加子系统
                            </Button>
                        </div>
                    )}
                </Form.List>
            </Form.Item>
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
    );
};

export default App;
