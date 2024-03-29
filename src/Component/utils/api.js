import axios from 'axios';

// 可以在这里设置一些全局的 axios 设置，比如基础 URL、头部等
const apiClient = axios.create({
    baseURL: 'http://127.0.0.1:5000', // 假设 Flask 应用在 localhost 的 5000 端口运行
    headers: {
        'Content-Type': 'application/json',
    },
});

// 发送表单数据,获取特征贡献度
export const sendFormData = async (formData, shapKey, addEffectsKeys) => {
    const config = { ...formData, additional_effects_keys: addEffectsKeys };
    try {
        const response = await apiClient.post('/shap_analysis', config, {
            params: {
                shapKey: shapKey
            }
        });
        return response.data; // 这里返回的是服务器响应的数据
    } catch (error) {
        throw error;
    }
};

// 发送邻接矩阵到后端
export const sendAdjMatrix = async (adjMatrix, subAdjMatrix) => {
    try {
        const response = await apiClient.post('/causal_diagrams', { adjMatrix, subAdjMatrix });
        return response.data;  // 这里返回的是服务器响应的数据
    } catch (error) {
        throw error;
    }
};

