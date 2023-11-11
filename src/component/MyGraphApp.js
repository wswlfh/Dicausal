import React, { useContext, useRef, useState } from 'react';
import ReactDOM from "react-dom/client";
import { Col, Row, Layout, Drawer, notification, Skeleton, Radio, Image, Modal, Spin } from 'antd';
import '../index.css';
import G6 from '@antv/g6';
import { LayoutContext } from "./Layout";
import globalConfig from './GlobalConfig';
import { sendFormData, sendAdjMatrix } from './utils/api';


G6.registerNode(
    'background-animate',
    {
        afterDraw(cfg, group) {
            const r = cfg.size / 2;
            const back1 = group.addShape('circle', {
                zIndex: -3,
                attrs: {
                    x: 0,
                    y: 0,
                    r,
                    fill: cfg.color,
                    opacity: 0.6,
                },
                name: 'back1-shape',
            });
            const back2 = group.addShape('circle', {
                zIndex: -2,
                attrs: {
                    x: 0,
                    y: 0,
                    r,
                    fill: cfg.color,
                    opacity: 0.6,
                },
                name: 'back2-shape',
            });
            const back3 = group.addShape('circle', {
                zIndex: -1,
                attrs: {
                    x: 0,
                    y: 0,
                    r,
                    fill: cfg.color,
                    opacity: 0.6,
                },
                name: 'back3-shape',
            });
            group.sort(); // Sort according to the zIndex
            back1.animate(
                {
                    // Magnifying and disappearing
                    r: r + 10,
                    opacity: 0.1,
                },
                {
                    duration: 3000,
                    easing: 'easeCubic',
                    delay: 0,
                    repeat: true, // repeat
                },
            ); // no delay
            back2.animate(
                {
                    // Magnifying and disappearing
                    r: r + 10,
                    opacity: 0.1,
                },
                {
                    duration: 3000,
                    easing: 'easeCubic',
                    delay: 1000,
                    repeat: true, // repeat
                },
            ); // 1s delay
            back3.animate(
                {
                    // Magnifying and disappearing
                    r: r + 10,
                    opacity: 0.1,
                },
                {
                    duration: 3000,
                    easing: 'easeCubic',
                    delay: 2000,
                    repeat: true, // repeat
                },
            ); // 3s delay
        },
    },
    'circle',
);

G6.registerEdge(
    'line-dash',
    {
        afterDraw(cfg, group) {
            // get the first shape in the group, it is the edge's path here=
            const shape = group.get('children')[0];
            const lineDash = [4, 2, 1, 2];
            let index = 0;
            // Define the animation
            shape.animate(
                () => {
                    index++;
                    if (index > 9) {
                        index = 0;
                    }
                    const res = {
                        lineDash,
                        lineDashOffset: -index,
                    };
                    // returns the modified configurations here, lineDash and lineDashOffset here
                    return res;
                },
                {
                    repeat: true, // whether executes the animation repeatly
                    duration: 3000, // the duration for executing once
                },
            );
        },
    },
    'line',
);


const GLOBAL_SETTING = {

    BehaviorBind: (graph, threshold) => {
        if (!graph) return;
        const mouseenter = (evt) => {
            const { item } = evt;
            try {
                graph.setItemState(item, 'hover', true);

            } catch (e) {
                console.log(e);
            }
        }
        const mouseleave = (evt) => {
            const { item } = evt;
            try {
                graph.setItemState(item, 'hover', false);

            } catch (e) {
                console.log(e);
            }
            //@ts-ignore
        }
        const resetEdges = e => {
            try {
                graph.getNodes().forEach(node => {
                    try {
                        graph.setItemState(node, 'dark', false);
                        graph.setItemState(node, 'focus', false);

                    } catch (e) {
                        console.log(e);
                    }
                })
                graph.getEdges().forEach(edge => {
                    try {
                        graph.setItemState(edge, 'dark', false);

                    } catch (e) {
                        console.log(e);
                    }
                })
            } catch (e) {
                console.log(e);
            }


            while (tempEdges.length > 0) {
                graph.removeItem(tempEdges.pop())
            }
            //graph.refresh();

        }
        const tempEdges = [];
        const addEdges = (target, sources) => {
            for (let i = 0; i < sources.length; i++) {
                let source = graph.findById(sources[i]);
                graph.addItem('edge', {
                    type: 'line-dash',
                    source: source,
                    target: target,
                    style: {
                        stroke: '#4e70e2',
                        lineWidth: 2,
                        endArrow: true,
                        strokeOpacity: 0.5
                    }
                },)

                let edge = graph.find('edge', (edge) => {
                    return edge.getSource() === source && edge.getTarget() === target;
                })

                tempEdges.push(edge);
            }
        }
        const ShowDescription = ({ threshold, threshold_1, threshold_2, threshold_3, nodeItem }) => {
            const [value, setValue] = useState(threshold);  // 默认阈值级别设置为 'Low'
            const onChange = (e) => {
                console.log('radio checked', e.target.value);
                setValue(e.target.value);
                resetEdges();

                let shapMeanList
                if (e.target.value === 'Low') {
                    shapMeanList = threshold_1.shapMeanList;
                } else if (e.target.value === 'Medium') {
                    shapMeanList = threshold_2.shapMeanList;
                } else if (e.target.value === 'High') {
                    shapMeanList = threshold_3.shapMeanList;
                }
                if (shapMeanList) {
                    let keys = Object.keys(shapMeanList);
                    const g6Data = globalConfig.getG6Data();
                    const nodes = g6Data.nodes;
                    // 找出与 keys 匹配的节点 ID 集合
                    const matchingIds = nodes
                        .filter(node => keys.includes(node.label))
                        .map(node => node.id);
                    // 现在 matchingIds 包含与 keys 匹配的节点 ID
                    addEdges(nodeItem, matchingIds);
                }
            };

            const getImages = (thresholdData) => {
                const { shap_1, shap_2, shap_3 } = thresholdData;
                return (
                    <Image.PreviewGroup>
                        <Image height={200} width={350}
                            style={{ objectFit: 'contain' }}
                            src={`data:image/png;base64,${shap_1}`} />

                        <Image height={200} width={350}
                            style={{ objectFit: 'contain' }}
                            src={`data:image/png;base64,${shap_2}`} />

                        {/* <Image height={200} width={350}
                            style={{ objectFit: 'contain' }}
                            src={`data:image/png;base64,${shap_3}`} /> */}
                        <Image height={200} width={350}
                            style={{ objectFit: 'contain' }}
                            src={`data:image/png;base64,${shap_3}`} />
                    </Image.PreviewGroup>
                );
            };

            return (
                <div>
                    <div>
                        <span>阈值级别:   </span>
                        <Radio.Group onChange={onChange} value={value}>
                            <Radio value={"Low"}>Low</Radio>
                            <Radio value={"Medium"}>Medium</Radio>
                            <Radio value={"High"}>High</Radio>
                        </Radio.Group>
                    </div>
                    <div>
                        {/* {loading && <Skeleton active />}
                        {!loading && value === 'Low' && getImages(threshold_1)}
                        {!loading && value === 'Medium' && getImages(threshold_2)}
                        {!loading && value === 'High' && getImages(threshold_3)} */}
                        {value === 'Low' && getImages(threshold_1)}
                        {value === 'Medium' && getImages(threshold_2)}
                        {value === 'High' && getImages(threshold_3)}
                    </div>
                </div>
            );
        };
        const nodeClick = (evt) => {
            const { item } = evt;

            //不是key effect 遣返
            if (!GLOBAL_SETTING.key_effects.includes(item.getModel().label) && GLOBAL_SETTING.final_effect !== item.getModel().label) return;
            //全部节点
            graph.getNodes().forEach(node => {
                try {
                    graph.setItemState(node, 'dark', true);

                } catch (e) {
                    console.log(e);
                }
            })
            graph.getEdges().forEach(edge => {
                try {
                    graph.setItemState(edge, 'dark', true);

                } catch (e) {
                    console.log(e);
                }
            })
            try {
                //本节点
                graph.setItemState(item, 'dark', false);
                graph.setItemState(item, 'focus', true)

            } catch (e) {
                console.log(e);
            }

            let addKeySet = new Set();  // 使用 Set 来避免重复

            // 获取所有数据
            const g6Data = globalConfig.getG6Data();
            const nodes = g6Data.nodes;
            const keyEffects = globalConfig.getAllKeyEffect();
            const nodeLabel = item.getModel().label;

            // 找到当前节点对应的 comboId
            const currentNode = nodes.find(node => node.label === nodeLabel);
            const currentSub = currentNode?.comboId;

            if (GLOBAL_SETTING.key_effects.includes(nodeLabel)) {
                const neighbors = item.getNeighbors('source');  // 获取所有源（即入边）邻居节点
                neighbors.forEach(neighbor => addKeySet.add(neighbor.getModel().label));  // 添加到 Set

                if (currentSub) {
                    // 提取出 sub 后面的数字
                    const currentSubIndex = parseInt(currentSub.replace('sub', ''), 10);
                    if (isNaN(currentSubIndex)) {
                        console.error("comboId 格式不正确:", currentSub);
                        return;
                    }

                    // 遍历所有上游的 sub
                    for (let i = 0; i < currentSubIndex; i++) {
                        const subName = `sub${i}`;
                        const nodesInSub = nodes.filter(node => node.comboId === subName);

                        // 提取 sub 中的所有 keyEffect 并添加到 Set
                        nodesInSub
                            .filter(node => keyEffects.includes(node.label))
                            .forEach(node => addKeySet.add(node.label));
                    }
                }
            } else {
                //final
                GLOBAL_SETTING.key_effects.forEach(key => addKeySet.add(key));
            }

            const addKey = [...addKeySet];

            console.log('addKeyaddKeyaddKey', addKey);

            notification.open({
                message: '正在加载...',
                description: <Spin size="large" />,
                duration: 0,  // 0 表示不会自动关闭
                key: 'loadingNotification',
                placement: 'topRight', // 设置弹窗出现的位置
            });
            sendFormData(globalConfig.getGlobalForm(), item.getModel().label, addKey)
                .then((response) => {
                    console.log('Response data:', response);
                    //关闭等待弹窗，重新设置延时

                    const data = Object.values(response)[0];

                    const { threshold_1, threshold_2, threshold_3 } = data;

                    let shapMeanList

                    if (threshold === 'Low') {
                        shapMeanList = threshold_1.shapMeanList;
                    } else if (threshold === 'Medium') {
                        shapMeanList = threshold_2.shapMeanList;
                    } else if (threshold === 'High') {
                        shapMeanList = threshold_3.shapMeanList;
                    }

                    if (shapMeanList) {
                        let keys = Object.keys(shapMeanList);
                        let values = Object.values(shapMeanList);
                        // 假设 globalConfig.getG6Data() 返回一个对象，其中包含 nodes 数组
                        const g6Data = globalConfig.getG6Data();
                        const nodes = g6Data.nodes;
                        // 找出与 keys 匹配的节点 ID 集合
                        const matchingIds = nodes
                            .filter(node => keys.includes(node.label))
                            .map(node => node.id);
                        // 现在 matchingIds 包含与 keys 匹配的节点 ID
                        addEdges(item, matchingIds);
                    }

                    //通知提示
                    notification.open({
                        message: '特征贡献度 - ' + item.getModel().label,
                        description: <ShowDescription threshold={threshold}
                            threshold_1={threshold_1}
                            threshold_2={threshold_2}
                            threshold_3={threshold_3}
                            nodeItem={item} />,
                        placement: 'bottomLeft',
                        duration: null,
                        style: {
                            width: '400px',
                            // height: '450px'
                        }
                    });
                })
                .catch((error) => {
                    console.error('An error occurred:', error);
                    // 在这里处理错误
                });
        }

        graph.off('node:mouseenter', mouseenter);
        graph.on('node:mouseenter', mouseenter);

        graph.off('node:mouseleave', mouseleave);
        graph.on('node:mouseleave', mouseleave);

        graph.off('node:contextmenu');
        graph.on('node:contextmenu', nodeClick);

        graph.off('canvas:click')
        graph.on('canvas:click', resetEdges)

        graph.on('keydown', e => {
            const nodes = graph.getNodes();
            nodes.forEach(e => {
                e.lock();
            })
            graph.removeBehaviors('drag-combo', 'default');
        });
        graph.on('keyup', e => {
            const nodes = graph.getNodes();
            nodes.forEach(e => {
                e.unlock();
            })
            graph.addBehaviors('drag-combo', 'default');
        });

    },
    plugins: {
        toolbar: new G6.ToolBar({
            position: { x: 500, y: 100 }
        }),
        tooltip: new G6.Tooltip({
            position: 'top',
            getContent(e) {
                const outDiv = document.createElement('tooltip');
                //提示只出现一定时间
                setTimeout(function () {
                    outDiv.style.display = "none";
                }, 2000);

                outDiv.style.width = 'fit-content';
                outDiv.style.height = 'fit-content';
                try {
                    const model = e.item.getModel();
                    if (e.item.getType() === 'node') {
                        let type = model.label === GLOBAL_SETTING.final_effect ? 'final effect'
                            : GLOBAL_SETTING.key_effects.includes(model.label) ? 'key effects' : 'normal'

                        let upstream = '';
                        e.item.getNeighbors('source').forEach(e => {
                            try {
                                upstream += e ? e.getModel().label + ' ' : ' ';
                            } catch (e) {
                                console.log(e)
                            }
                        })

                        let downstream = '';
                        e.item.getNeighbors('target').forEach(e => {
                            try {
                                downstream += e ? e.getModel().label + ' ' : ' ';
                            } catch (e) {
                                console.log(e)
                            }
                        })
                        outDiv.innerHTML = `<li><b>sub</b>: ${model.comboId}</li>
                                        <li><b>name</b>: ${model.label}</li>
                                        <li><b>id</b>: ${model.id}</li>
                                        <li><b>type</b>: ${type}</li>
                                        <li><b>upstream</b>:${upstream} </li>
                                        <li><b>downstream</b>: ${downstream} </li>
                                                                            `;
                    } else {
                        const source = e.item.getSource();
                        const target = e.item.getTarget();
                        outDiv.innerHTML = `<li><b>target</b>：${source.getModel().label} </li>
                                        <li><b>source</b>：${target.getModel().label} </li>
                                        `;
                    }
                } catch (e) {
                    console.log(e)
                }
                return outDiv;
            },
            itemTypes: ['node', 'edge']
        }),
        menu: new G6.Menu({
            // offsetX: 6,
            // offsetY: 10,
            itemTypes: ['edge'],
            getContent(e) {
                const outDiv = document.createElement('div');
                outDiv.innerHTML = `<button id="delete">delete</button>`
                return outDiv
            },
            handleMenuClick(target, item, graph) {
                graph.removeItem(item, true);
            },
        }),

    },
    final_effect: '',
    key_effects: [],
}


const GLOBAL_STYLE = {
    ItemStyle: (graph) => {
        const fills = [
            '#FBE5A2',
            '#F6C3B7',
            '#B6E3F5',
            '#BDD2FD',
            '#BDEFDB',
            '#C2C8D5',
            '#D3C6EA',
            '#FFD8B8',
            '#AAD8D8',
            '#FFD6E7',
            '#bc9fc1',
            '#a2c6b3'
        ];
        const strokes = [
            '#F6BD16',
            '#E8684A',
            '#6DC8EC',
            '#5B8FF9',
            '#5AD8A6',
            '#5D7092',
            '#9270CA',
            '#FF9D4D',
            '#269A99',
            '#FF99C3',
            '#b86fc4',
            '#52c287'
        ];
        const fills2 = [
            '#fff9f6',
            '#f8f8ff',
            '#fff6f6',
            '#f1faff',
            '#f3fdfb',
            '#fef9ff',
        ]
        const random = Math.round(Math.random() * 1000);
        //设置combo样式，此函数可以看做是foreach，对每个graph含有的元素遍历操作,是初始化完后才执行
        graph.combo((combo) => {
            if (combo.style) return {};
            let index = random;
            let s = combo.id;
            for (let i = 0; i < s.length; i++) {
                index += s.charCodeAt(i);
            }
            return {
                labelCfg: {
                    position: 'bottom'
                },
                style: {
                    fill: fills2[index % fills2.length],
                    stroke: '#c7c7c7',
                    opacity: 0.7
                }
            }
        })

        graph.node((node) => {
            if (node.style) return {};

            let fill, stroke, type = 'circle';
            // let index = random;
            let index = 0;
            //不属于任何combo内的节点
            //如果是finalEffect


            if (node.label === GLOBAL_SETTING.final_effect) {
                fill = '#f67a7a';
                stroke = '#fa3f3f';
                return {
                    type: 'background-animate',
                    color: '#f6476c',
                    size: 30,
                    labelCfg: {
                        position: 'bottom'
                    },
                    style: {
                        fill: fill,
                        stroke: stroke
                    }
                }
            } else if (node.comboId === undefined) {
                fill = '#666'
                stroke = '#666'
            } else {
                let s = node.comboId;
                for (let i = 0; i < s.length; i++) {
                    index += s.charCodeAt(i);
                }
                fill = fills[index % fills.length];
                stroke = strokes[index % strokes.length];

                //KEY_EFFECT
                if (GLOBAL_SETTING.key_effects.includes(node.label)) {
                    return {
                        type: 'background-animate',
                        color: stroke,
                        size: 25,
                        labelCfg: {
                            position: 'bottom'
                        },
                        style: {
                            fill: fill,
                            stroke: stroke
                        }
                    }
                }

            }

            return {
                type: type,
                size: 20,
                labelCfg: {
                    position: 'bottom'
                },
                style: {
                    fill: fill,
                    stroke: stroke
                }
            }
        })

        graph.edge((edge) => {
            if (edge.style) return {};

            //通过交互新建的边
            if (edge.type === 'inside') {
                return {
                    style: {
                        stroke: '#aa1313',
                        lineWidth: 2,
                        endArrow: true,
                        strokeOpacity: 0.5
                    }

                }
            }
            //默认边
            return {
                style: {
                    stroke: '#999595',
                    lineWidth: 2,
                    endArrow: true,
                    strokeOpacity: 0.5
                }
            }
        })
    },

    nodeStateStyles: {
        highlight: {
            opacity: 1,
        },
        dark: {
            opacity: 0.2,
        },
        focus: {
            fill: '#ffffff',
            stroke: '#007bbd',
            shadowColor: '#5729fa',
            shadowBlur: 20
        },
        hover: {
            // keyShape 的状态样式
            fill: '#ffffff',
            stroke: '#007bbd',
            shadowColor: '#5729fa',
            shadowBlur: 20
        },
    }

}

let PkGraph;


export const PriorKnowledge = ({ data }) => {
    // const data = data2;
    const ref = React.useRef(null);
    const [graph, setGraph] = useState(null);
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);
    const threshold = useContext(LayoutContext)
    const [dragNodes, setDragNodes] = useState([]);
    GLOBAL_SETTING.key_effects = globalConfig.getAllKeyEffect();
    GLOBAL_SETTING.final_effect = globalConfig.getFinalEffect()[0];

    //原始节点状态
    const allKeyEffect = [...globalConfig.getAllKeyEffect()];
    const allEffect = [...globalConfig.getAllEffect()];
    const finalEffect = [...globalConfig.getFinalEffect()];



    React.useEffect(() => {
        if (!graph) {
            setGraph(() => {
                return new G6.Graph({
                    container: ref.current,
                    width: 1200,
                    height: 1500,
                    fitView: true,
                    fitViewPadding: 10,
                    animate: true,
                    modes: {
                        default: [
                            'drag-node', 'drag-canvas', 'zoom-canvas',
                            'brush-select', 'drag-combo',
                            'collapse-expand-combo',
                            {
                                type: 'create-edge',
                                trigger: 'click',
                                // key: 'control',
                                edgeConfig: {
                                    type: 'inside'
                                },
                            },
                        ],
                    },

                    layout: {
                        type: 'comboCombined',
                        outerLayout: new G6.Layout['dagre']({
                            rankdir: 'TB', // 布局的方向
                            align: 'UL', // 可选
                            nodesep: 20, // 节点间距
                            ranksep: 30, // 层间距
                            controlPoints: true, // 可选
                        }),
                        innerLayout: new G6.Layout['concentric']({
                            preventOverlap: true, //防止重叠
                            minNodeSpacing: 20
                        }),

                    },
                    groupByTypes: false,
                    enabledStack: true,
                    plugins: [
                        GLOBAL_SETTING.plugins.toolbar,
                        GLOBAL_SETTING.plugins.tooltip,
                        GLOBAL_SETTING.plugins.menu
                    ],
                    nodeStateStyles: GLOBAL_STYLE.nodeStateStyles
                });
            })
        }
    }, [graph]);

    React.useEffect(() => {
        console.log(threshold);
    }, [threshold])

    React.useEffect(() => {
        PkGraph = graph;
    }, [graph])



    if (graph !== null && !done) {

        GLOBAL_STYLE.ItemStyle(graph);
        //@ts-ignore
        graph.data(data);
        graph.render();
        setDone(true);
    }

    //绑定监听事件
    GLOBAL_SETTING.BehaviorBind(graph, threshold);

    if (graph && done) {
        graph.on('dragend', e => {
            const nodes = graph.getNodes().map(node => node.getModel());

            console.log('nodes', nodes);
            console.log('graph', graph);

            if (e && e.item && e.item.getType() === 'node') {
                let formData = {
                    list: [],
                    final_effect: []
                };

                // 1. 基于 comboId 对 nodes 进行分组
                let groupedByComboId = {};
                nodes.forEach(node => {
                    if (node.comboId) {
                        if (!groupedByComboId[node.comboId]) {
                            groupedByComboId[node.comboId] = [];
                        }
                        groupedByComboId[node.comboId].push(node);
                    }
                });

                // 2. 遍历每个组
                Object.keys(groupedByComboId).forEach(comboId => {
                    let sub = parseInt(comboId.replace("sub", ""));
                    let effect = [];
                    let key_effect = [];

                    groupedByComboId[comboId].forEach(node => {
                        if (allKeyEffect.includes(node.label)) {
                            key_effect.push(node.label);
                        } else if (allEffect.includes(node.label)) {
                            effect.push(node.label);
                        }
                    });

                    formData.list.push({ sub, effect, key_effect });
                });

                // 3. 从 nodes 中查找 final_effect
                nodes.forEach(node => {
                    if (finalEffect.includes(node.label)) {
                        formData.final_effect.push(node.label);
                    }
                });

                console.log('formData', formData);
                // 调用全局类的setGlobalForm方法
                globalConfig.setGlobalForm(formData);
                console.log("FormData: ", formData);
            }
        });

    }

    //监听节点拖动


    return (<div>
        <div ref={ref} />
    </div>);
}


export const CauseAndEffect = () => {

    const [newG6Data, setNewG6Data] = useState(null);
    if (PkGraph && !newG6Data) {
        try {
            const edges = PkGraph.getEdges();
            const nodes = PkGraph.getNodes();
            const combos = PkGraph.getCombos();
            console.log('edgesedges', edges);
            console.log('nodesnodes', nodes);
            console.log('combos', combos);
            // 获取节点和 combo 的数量
            const nodeCount = nodes.length;
            const comboCount = combos.length;

            // 初始化邻接矩阵
            const adjMatrix = Array.from({ length: nodeCount }, () => Array(nodeCount).fill(0));
            const subAdjMatrix = Array.from({ length: (comboCount + 1) }, () => Array(comboCount + 1).fill(0));

            // 确定最大节点 ID 为 nodeCount - 1
            const maxNodeId = nodeCount - 1;

            // 获取所有的 key effect 节点
            const keyEffectNodes = nodes.filter(node => {
                return globalConfig.getAllKeyEffect().includes(node.getModel().label);
            }).map(node => parseInt(node.getModel().id, 10));  // 将 key effect 节点的 ID 转换为整数

            // 填充邻接矩阵
            edges.forEach(edge => {
                const sourceId = edge.getModel().source;
                const targetId = edge.getModel().target;
                // 判断边的起点和终点是否是 sub 节点
                const isSourceSub = sourceId.startsWith("sub");
                const isTargetSub = targetId.startsWith("sub");
                if (isSourceSub || isTargetSub) {
                    // 如果边的起点或终点是 sub 节点，则更新 subAdjMatrix
                    const sourceIndex = parseInt(sourceId[3], 10);
                    const targetIndex = isTargetSub ? parseInt(targetId[3], 10) : comboCount;
                    if (!isNaN(sourceIndex) && !isNaN(targetIndex)) {
                        subAdjMatrix[sourceIndex][targetIndex] = 1;
                    }
                }
                else {
                    // 如果边的起点和终点都不是 sub 节点，则更新 adjMatrix
                    const source = parseInt(sourceId, 10);
                    const target = parseInt(targetId, 10);

                    if (!isNaN(source) && !isNaN(target)) {
                        adjMatrix[source][target] = 1;
                    }
                }
            })


            // 将所有 key effect 节点与最终节点连接
            keyEffectNodes.forEach(source => {
                if (!isNaN(source)) {
                    adjMatrix[source][maxNodeId] = 1;
                }
            });

            sendAdjMatrix(adjMatrix, subAdjMatrix)
                .then((response) => {
                    const oldG6Data = globalConfig.getG6Data();
                    const { nodes } = oldG6Data;

                    // 初始化新的 edges 数组
                    const newEdges = [];

                    // 遍历二维数组来填充 newEdges
                    for (let i = 0; i < response.length; i++) {
                        for (let j = 0; j < response[i].length; j++) {
                            if (response[i][j] === 1) {
                                newEdges.push({
                                    source: nodes[i].id,
                                    target: nodes[j].id
                                });
                            }
                        }
                    }

                    // 构造新的 G6Data
                    const data = {
                        nodes: nodes,
                        edges: newEdges
                    };
                    setNewG6Data(data)
                }).catch(e => console.log(e))
        } catch (e) {
            console.log(e)
        }

    }
    const ref = React.useRef(null);
    let graph = null;
    React.useEffect(() => {
        if (!graph && newG6Data) {
            graph = new G6.Graph({
                container: ref.current,
                width: 600,
                height: 1000,
                fitView: true,
                fitViewPadding: 10,
                animate: true,
                modes: {
                    default: [
                        'drag-node', 'drag-canvas', 'zoom-canvas',
                        'brush-select', 'activate-relations', 'drag-combo',
                        'collapse-expand-combo'
                    ],
                },

                layout: {
                    type: 'dagre',
                    rankdir: 'LR', // 布局的方向
                    align: 'UL', // 可选
                    nodesep: 10, // 节点间距
                    ranksep: 20, // 层间距
                    // controlPoints: true, // 是否保留布局连线的控制点
                    // type: 'comboCombined',
                    // outerLayout: new G6.Layout['dagre']({
                    //     rankdir: 'TB', // 布局的方向
                    //     align: 'UL', // 可选
                    //     nodesep: 10, // 节点间距
                    //     ranksep: 15, // 层间距
                    //     controlPoints: true, // 可选
                    // }),
                    // innerLayout: new G6.Layout['concentric']({
                    //     preventOverlap: true, //防止重叠
                    //     minNodeSpacing: 20
                    // }),

                },
                groupByTypes: false,
                enabledStack: true,
                plugins: [
                    GLOBAL_SETTING.plugins.tooltip,
                    GLOBAL_SETTING.plugins.menu
                ],
                nodeStateStyles: GLOBAL_STYLE.nodeStateStyles
            });
            GLOBAL_STYLE.ItemStyle(graph);
            graph.data(newG6Data);
            graph.render();
        }
    }, [newG6Data]);

    return <div ref={ref} />;
}

