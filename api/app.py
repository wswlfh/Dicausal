import pathlib

from flask import Flask, request, jsonify
import matplotlib
import matplotlib.pyplot as plt
from flask import Flask, request, jsonify, json
import pandas as pd
import numpy as np
import io
import chardet  # 导入 chardet 库
from flask_cors import CORS  # 导入 CORS
import shap
import base64
from io import BytesIO
import random
from copy import deepcopy
from sklearn.ensemble import RandomForestRegressor
from castle.algorithms import PC
from castle.common.priori_knowledge import PrioriKnowledge

font_path = pathlib.Path("simhei.ttf")
matplotlib.use('agg')
app = Flask(__name__)

CORS(app)  # 为 app 设置 CORS
# CORS(app, resources={r"/*": {"origins": "*"}})  # 初始化 CORS
# CORS(app, origins=["http://localhost:3000"]) # 限制某个源才能访问

df = None  # Initialize df as a global variable


@app.route('/')
def hello():
    return 'Welcome to My Watchlist!'


@app.route('/upload', methods=['POST'])
def upload_file():
    global df
    uploaded_file = request.files['file']
    if uploaded_file.filename != '':
        file_extension = uploaded_file.filename.split('.')[-1]

        if file_extension == 'csv':
            file_bytes = uploaded_file.read()
            result = chardet.detect(file_bytes)
            detected_encoding = result.get('encoding', 'utf-8')

            if detected_encoding is None:
                detected_encoding = 'utf-8'

            decoded_str = file_bytes.decode(detected_encoding)
            str_io = io.StringIO(decoded_str)
            df = pd.read_csv(str_io)

        elif file_extension == 'xlsx':
            df = pd.read_excel(uploaded_file, engine='openpyxl')

        else:
            return jsonify({"error": "Unsupported file format"}), 400

        # Replace NaN with empty string
        df.fillna("", inplace=True)

        columns = [{"title": col, "dataIndex": col, "key": col}
                   for col in df.columns]
        dataSource = df.to_dict(orient='records')

        # Add unique keys for dataSource
        for index, record in enumerate(dataSource):
            record['key'] = str(index)

        return json.dumps({"columns": columns, "dataSource": dataSource}, ensure_ascii=False), 200, {
            'Content-Type': 'application/json;charset=utf-8'}
    else:
        return jsonify({"error": "No file uploaded"}),


def analyze_group(key_effects, other_effects, target_feature, model):
    X = df[key_effects + other_effects]
    y = df[target_feature]
    model.fit(X, y)

    explainer = shap.Explainer(model, X)
    shap_values = explainer(X)

    avg_shap_values = np.abs(shap_values.values).mean(axis=0)[
                      len(key_effects):]
    effect_shap_pairs = sorted(
        zip(other_effects, avg_shap_values), key=lambda x: x[1], reverse=True)

    thresholds_results = {}

    for threshold in [1, 2, 3]:
        if threshold == 1:
            selected_effects = effect_shap_pairs[:int(
                len(effect_shap_pairs))]
        elif threshold == 2:
            selected_effects = effect_shap_pairs[:int(
                len(effect_shap_pairs) * 0.6)]
        elif threshold == 3:
            selected_effects = effect_shap_pairs[:int(
                len(effect_shap_pairs) * 0.4)]

        selected_effects = selected_effects[:30]  # 取前三十条
        selected_effects_dict = {effect: round(
            shap_value, 2) for effect, shap_value in selected_effects}

        # Generate the summary plot for the current threshold
        selected_effect_names = [f[0] for f in selected_effects]
        filtered_shap_values = shap_values[:, [
                                                  X.columns.get_loc(f) for f in selected_effect_names]]

        buffer1 = BytesIO()
        plt.yticks(fontproperties=font_path)
        shap.summary_plot(filtered_shap_values.values,
                          X[selected_effect_names], plot_type="bar", show=False)
        plt.savefig(buffer1, format="png")
        plt.close()
        shap_1 = base64.b64encode(buffer1.getvalue()).decode()

        # Create the BytesIO object for dot plot
        shap_values_for_pie = list(selected_effects_dict.values())
        shap_labels_for_pie = list(selected_effects_dict.keys())
        buffer2 = BytesIO()
        plt.yticks(fontproperties=font_path)
        shap.summary_plot(filtered_shap_values.values,
                          X[selected_effect_names], show=False)
        plt.savefig(buffer2, format="png")
        plt.close()
        shap_2 = base64.b64encode(buffer2.getvalue()).decode()

        # Create the BytesIO object for pie chart
        buffer_pie = BytesIO()
        # plt.figure()
        # plt.yticks(fontproperties=font_path)
        # plt.pie(shap_values_for_pie,
        #         labels=shap_labels_for_pie, autopct='%1.1f%%')
        # plt.title(
        #     f'{key_effects[0]}: SHAP Value Distribution for threshold {threshold}')
        # plt.savefig(buffer_pie, format="png")
        # plt.close()
        shap_3 = base64.b64encode(buffer_pie.getvalue()).decode()

        thresholds_results[f'threshold_{threshold}'] = {
            'shapMeanList': selected_effects_dict,
            'shap_1': shap_1,
            'shap_2': shap_2,
            'shap_3': shap_3
        }

    return thresholds_results


def perform_shap_analysis(configJson, shapKey=None, additional_effects_keys=None):
    model = RandomForestRegressor(n_estimators=100, random_state=0)
    final_effect = configJson['final_effect'][0]
    results = {}

    # 如果 shapKey 为空，则返回空字典
    if shapKey is None:
        return {}

    all_effects = []
    for group in configJson['list']:
        all_effects += group['effect']
    all_effects = list(set(all_effects))

    if shapKey == final_effect:
        # 如果有附加的 effect keys，则将它们也添加到 all_effects 中
        if additional_effects_keys:
            all_effects += additional_effects_keys
            all_effects = list(set(all_effects))

        results[final_effect] = analyze_group(
            [final_effect], all_effects, final_effect, model)
        return results

    for group in configJson['list']:
        if shapKey in group['key_effect']:
            group_effects_set = set(group['effect'])
            additional_effects_set = set(additional_effects_keys or [])

            # 去掉在 group['effect'] 中已经存在的 additional_effects_keys
            unique_additional_effects = additional_effects_set - group_effects_set

            other_effects = list(group_effects_set | unique_additional_effects)

            results[shapKey] = analyze_group(
                [shapKey], other_effects, final_effect, model)
            return results

    return {}  # 如果没有找到匹配的 shapKey，返回空字典


@app.route('/shap_analysis', methods=['POST'])
def shap_analysis_api():
    try:
        if 'df' not in globals():
            print("Error: Dataframe is not initialized yet")
            return jsonify({"error": "Dataframe is not initialized yet"}), 400

        configJson = request.json
        if configJson is None or 'list' not in configJson:
            print("Error: Invalid or missing configJson")
            return jsonify({"error": "Invalid or missing configJson"}), 400

        shapKey = request.args.get('shapKey')
        additional_effects_keys = configJson.get(
            'additional_effects_keys', None)

        print("Config JSON:", configJson)
        print("Shap Key:", shapKey)
        print("add Key:", additional_effects_keys)

        results = perform_shap_analysis(
            configJson, shapKey, additional_effects_keys)
        return jsonify(results)

    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 400


def get_reachable_matrix(adj_matrix, n_subSystem):
    origin_matrix = adj_matrix + np.identity(n_subSystem)
    old_matrix = deepcopy(origin_matrix)
    while True:
        new_matrix = np.matmul(old_matrix, origin_matrix)
        for i in range(n_subSystem):
            for j in range(n_subSystem):
                if new_matrix[i][j] >= 1:
                    new_matrix[i][j] = 1
        if (old_matrix == new_matrix).all():
            return new_matrix - np.identity(n_subSystem)
        old_matrix = deepcopy(new_matrix)


def get_subsystems(sub_adj_matrix, nodes):
    subsystems = []
    for i in range(len(sub_adj_matrix)):
        subsystems.append({'key_id': [], 'id': []})

    for n in nodes:
        try:
            n_id = int(n['id'])
            sub_id = int(n['comboId'][-1])
            if n['type'] == 'effect':
                subsystems[sub_id]['id'].append(n_id)
            if n['type'] == 'key':
                subsystems[sub_id]['key_id'].append(n_id)
        except:
            subsystems[sub_id+1]['key_id'].append(n_id)

    return subsystems


def get_dataset(nodes):
    lables = []
    for n in nodes:
        lables.append(n['label'])
    X = df[lables]
    return X


def get_priori_knowledge(adj_matrix, nodes, sub_adj_matrix):
    # 初始化可达矩阵
    reach_matrix = get_reachable_matrix(sub_adj_matrix, len(sub_adj_matrix))
    # 初始化subsystems
    subsystems = get_subsystems(sub_adj_matrix, nodes)
    # 创建先验知识实例
    pk = PrioriKnowledge(len(nodes))

    # 构造先验知识
    # 加入required edges
    for i in range(len(nodes)):
        for j in range(len(nodes)):
            if adj_matrix[i][j] == 1:
                pk.add_required_edge(i, j)
                pk.add_forbidden_edge(j, i)

    # 组内：key不能指向同组的effect
    for i in range(len(subsystems)):
        item = subsystems[i]
        for i in item['id']:
            for j in item['key_id']:
                pk.add_forbidden_edge(j, i)

    # 组间：下游不能指向上游
    for up in range(len(reach_matrix)):
        for down in range(len(reach_matrix)):
            if reach_matrix[up][down] == 0:
                continue
            for x_down in subsystems[down]['id']:
                for x_up in subsystems[up]['id']:
                    # 1.1 Forbidden x->x
                    pk.add_forbidden_edge(x_down, x_up)
                for y_up in subsystems[up]['key_id']:
                    # 1.2 Forbidden x->y
                    pk.add_forbidden_edge(x_down, y_up)

            for y_down in subsystems[down]['key_id']:
                for x_up in subsystems[up]['id']:
                    # 2.1 Forbidden y->x
                    pk.add_forbidden_edge(y_down, x_up)
                for y_up in subsystems[up]['key_id']:
                    # 2.2 Forbidden y->y
                    pk.add_forbidden_edge(y_down, y_up)
    return pk


def get_causal_matrix(X, priori_knowledge=None):
    pc = PC(variant='original', priori_knowledge=priori_knowledge)
    pc.learn(X)
    causal_matrix = pc.causal_matrix
    causal_matrix_ls = []
    for row in range(causal_matrix.shape[0]):
        causal_matrix_ls.append([])
        for col in range(causal_matrix.shape[1]):
            causal_matrix_ls[row].append(int(causal_matrix[row][col]))
    return causal_matrix_ls


def modify_adj_matrix(adj_matrix, sub_adj_matrix, nodes):
    # 获取矩阵的维度
    assert len(adj_matrix) == len(adj_matrix[0])
    assert len(sub_adj_matrix) == len(sub_adj_matrix[0])

    # 切片待计算的数据集
    X = get_dataset(nodes)
    pk = get_priori_knowledge(adj_matrix, nodes, sub_adj_matrix)
    adj_matrix = get_causal_matrix(X, pk)

    return adj_matrix


@app.route('/causal_diagrams', methods=['POST'])
def gen_causal_diagrams():
    try:
        # 从请求中获取JSON数据
        json_data = request.json

        # 节点邻接矩阵
        adj_matrix = json_data.get('adjMatrix', [])
        # 子系统邻接矩阵

        sub_adj_matrix = json_data.get('subAdjMatrix', [])

        # 节点的属性，名称，id，类型，子系统归属
        nodes = json_data.get('nodes', [])

        print(nodes)
        print("接收到的节点邻接矩阵:", adj_matrix)
        print("接收到的子系统邻接矩阵:", sub_adj_matrix)
        # 从请求中获取需要添加的新边的数量，如果没有则默认为5
        num_new_edges = 5

        # 修改邻接矩阵
        modified_adj_matrix = modify_adj_matrix(adj_matrix, sub_adj_matrix, nodes)

        print("修改后的节点邻接矩阵:", modified_adj_matrix)

        return jsonify(modified_adj_matrix), 200

    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 400


if __name__ == '__main__':
    app.run(port=7160, debug=True)
