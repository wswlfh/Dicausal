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
            globalConfig.removeListener(updateForm);
        };
    }, [form]);



    const onFinish = async (values: FormData) => {
        values.list = []
        values.list.push({ sub: -1, effect: filteredOptions, key_effect: [] })
        console.log( values);
        globalConfig.setGlobalForm(values);
        globalConfig.setIsDraw(true)
    };






    return (
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
    );
};

export default App;
