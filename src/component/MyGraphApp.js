import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import {Col, Row, Layout} from 'antd';
import '../index.css';
import Graphin, {Utils, Behaviors, GraphinContext, Components, NodeConfig} from '@antv/graphin';

import G6 from '@antv/g6';


const {Header, Content, Footer, Sider} = Layout;
const {ZoomCanvas} = Behaviors;
const data = {
    nodes: [
        {
            id: '0',
            label: 'plcg',
            comboId: 'sub0'
        },
        {
            id: '1',
            label: 'PIP3',
            comboId: 'sub0'
        },
        {
            id: '2',
            label: 'PIP2',
            comboId: 'sub0'
        },
        {
            id: '3',
            label: 'PKC',
            comboId: 'sub1'
        },
        {
            id: '4',
            label: 'PKA',
            comboId: 'sub1'
        },
        {
            id: '5',
            label: 'praf',
            comboId: 'sub2'
        },
        {
            id: '6',
            label: 'pjnk',
            comboId: 'sub1'
        },
        {
            id: '7',
            label: 'p38',
            comboId: 'sub1'
        },
        {
            id: '8',
            label: 'pmek',
            comboId: 'sub2'
        },
        {
            id: '9',
            label: 'p44/42',
            comboId: 'sub2'
        },
        {
            id: '10',
            label: 'pakts473',
        },
    ],
    edges: [
        {
            source: 'sub0',
            target: 'sub1',
        },
        {
            source: 'sub0',
            target: 'sub2',
        },
        {
            source: 'sub0',
            target: '10',
        },
        {
            source: 'sub1',
            target: 'sub2',
        },

        {
            source: 'sub1',
            target: '10',
        },
        {
            source: 'sub2',
            target: '10',
        },

    ],
    combos: [
        {
            id: 'sub0',
            label: 'sub0'
        },
        {
            id: 'sub1',
            label: 'sub1'
        },
        {
            id: 'sub2',
            label: 'sub2'
        }]
};

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
    'line-growth',
    {
        afterDraw(cfg, group) {
            const shape = group.get('children')[0];
            const length = shape.getTotalLength();
            shape.animate(
                (ratio) => {
                    // the operations in each frame. Ratio ranges from 0 to 1 indicating the prograss of the animation. Returns the modified configurations
                    const startLen = ratio * length;
                    // Calculate the lineDash
                    const cfg = {
                        lineDash: [startLen, length - startLen],
                    };
                    return cfg;
                },
                {
                    repeat: true, // Whether executes the animation repeatly
                    duration: 2000, // the duration for executing once
                },
            );
        },

    },
    'line', // extend the built-in edge 'cubic'
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
    BehaviorBind: (graph) => {

        graph.on('node:mouseenter', (evt) => {
            console.log(evt)
            const {item} = evt;
            graph.setItemState(item, 'hover', true);
        });

        graph.on('node:mouseleave', (evt) => {
            const {item} = evt;
            graph.setItemState(item, 'hover', false);
            //@ts-ignore
        });

        const tempEdges = [];
        graph.on('node:click', (evt) => {
            const {item} = evt;
            //全部节点
            graph.getNodes().forEach(node => {
                graph.setItemState(node, 'dark', true);
            })
            graph.getEdges().forEach(edge => {
                graph.setItemState(edge, 'dark', true);
            })

            //本节点
            graph.setItemState(item, 'dark', false);
            graph.setItemState(item, 'focus', true)
            //随机加边
            let nodes = graph.getNodes();
            for (let i = 0; i < Math.round(Math.random() * 3) + 1; i++) {
                let source = item;
                let target = nodes[Math.round(Math.random() * nodes.length)];
                graph.setItemState(target, 'dark', false);
                graph.setItemState(target, 'focus', true)

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
        });

        graph.on('canvas:click', e => {
            graph.getNodes().forEach(node => {
                graph.setItemState(node, 'dark', false);
                graph.setItemState(node, 'focus', false);
            })
            graph.getEdges().forEach(edge => {
                graph.setItemState(edge, 'dark', false);
            })

            while (tempEdges.length > 0) {
                graph.removeItem(tempEdges.pop())
            }
            //graph.refresh();
        })

        graph.on('keydown', e => {
            const nodes = graph.getNodes();
            nodes.forEach(e => {
                e.lock();
            })
        });
        graph.on('keyup', e => {
            const nodes = graph.getNodes();
            nodes.forEach(e => {
                e.unlock();
            })
        });
    },
    plugins: {
        toolbar: new G6.ToolBar({
            position: {x: 500, y: 100}
        }),
        tooltip: new G6.Tooltip({
            // offsetX: 10,
            // offsetY: 20,
            position: 'top',
            getContent(e) {
                const outDiv = document.createElement('tooltip');
                //提示只出现一定时间
                setTimeout(function () {
                    outDiv.style.display = "none";
                }, 2000);
                outDiv.style.width = 'fit-content';
                outDiv.style.height = 'fit-content';
                const model = e.item.getModel();

                if (e.item.getType() === 'node') {
                    let type = model.id === GLOBAL_SETTING.final_effect ? 'final effect'
                        : GLOBAL_SETTING.key_effects.includes(model.id) ? 'key effects' : 'normal'

                    let upstream = '';
                    e.item.getNeighbors('source').forEach(e => {
                        upstream += e.getModel().label + ' ';
                    })

                    let downstream = '';
                    e.item.getNeighbors('target').forEach(e => {
                        downstream += e.getModel().label + ' ';
                    })
                    outDiv.innerHTML = `<li><b>sub</b>: ${model.comboId}</li>
                                        <li><b>name</b>: ${model.label}</li>
                                        <li><b>type</b>: ${type}</li>
                                        <li><b>upstream</b>: ${upstream}</li>
                                        <li><b>downstream</b>: ${downstream}</li>
                                                                            `;
                } else {
                    const source = e.item.getSource();
                    const target = e.item.getTarget();
                    outDiv.innerHTML = `<li><b>target</b>：${source.getModel().label} </li>
                                        <li><b>source</b>：${target.getModel().label} </li>
                                        <li><b>ShapValue</b>：${(Math.random() + Math.round(Math.random() * 10)).toFixed(2)} </li>`;
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
    final_effect: '10',
    key_effects: ['2', '7', '9'],
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
            let index = random;
            //不属于任何combo内的节点
            //如果是finalEffect


            if (node.id === GLOBAL_SETTING.final_effect) {
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
                if (GLOBAL_SETTING.key_effects.includes(node.id)) {
                    return {
                        type: 'background-animate',
                        color: stroke,
                        size: 20,
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


export const PriorKnowledge = () => {
    const ref = React.useRef(null);
    let graph = null;
    React.useEffect(() => {
        if (!graph) {
            //@ts-ignore
            graph = new G6.Graph({
                container: ref.current,
                width: 1200,
                height: 1000,
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
                            trigger: 'drag',
                            key: 'shift',
                            edgeConfig: {
                                type: 'inside'
                            },
                        },
                    ],
                },

                layout: {
                    // type: 'dagre',
                    // rankdir: 'TB', // 布局的方向
                    // align: 'UL', // 可选
                    // nodesep: 20, // 节点间距
                    // ranksep: 30, // 层间距
                    // controlPoints: true, // 是否保留布局连线的控制点
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
            GLOBAL_STYLE.ItemStyle(graph);
            //@ts-ignore
            graph.data(data);
            graph.render();

            GLOBAL_SETTING.BehaviorBind(graph);
        }
    }, []);

    return <div ref={ref}/>;
}


export const CauseAndEffect = () => {
    // const layout = {
    //     type: 'dagre',
    //     rankdir: 'TB', // 布局的方向
    //     align: 'UL', // 可选
    //     nodesep: 20, // 节点间距
    //     ranksep: 30, // 层间距
    //     controlPoints: true, // 可选
    // };
    // const minimap = new G6.Minimap();
    const data = {
        nodes: [
            {
                id: '0',
                label: 'plcg',
                comboId: 'sub0'
            },
            {
                id: '1',
                label: 'PIP3',
                comboId: 'sub0'
            },
            {
                id: '2',
                label: 'PIP2',
                comboId: 'sub0'
            },
            {
                id: '3',
                label: 'PKC',
                comboId: 'sub1'
            },
            {
                id: '4',
                label: 'PKA',
                comboId: 'sub1'
            },
            {
                id: '5',
                label: 'praf',
                comboId: 'sub2'
            },
            {
                id: '6',
                label: 'pjnk',
                comboId: 'sub1'
            },
            {
                id: '7',
                label: 'p38',
                comboId: 'sub1'
            },
            {
                id: '8',
                label: 'pmek',
                comboId: 'sub2'
            },
            {
                id: '9',
                label: 'p44/42',
                comboId: 'sub2'
            },
            {
                id: '10',
                label: 'pakts473',
                finalEffect: 'true'
            },
        ],
        edges: [
            {
                source: '0',
                target: '1',
            },
            {
                source: '0',
                target: '2',
            },
            {
                source: '0',
                target: '3',
            },
            {
                source: '1',
                target: '2',
            },
            {
                source: '1',
                target: '10',
            },
            {
                source: '2',
                target: '3',
            },
            {
                source: '3',
                target: '4',
            },
            {
                source: '3',
                target: '5',
            },
            {
                source: '3',
                target: '6',
            },
            {
                source: '3',
                target: '7',
            },
            {
                source: '3',
                target: '8',
            },
            {
                source: '4',
                target: '5',
            },
            {
                source: '4',
                target: '6',
            },
            {
                source: '4',
                target: '7',
            },
            {
                source: '4',
                target: '8',
            },
            {
                source: '4',
                target: '9',
            },
            {
                source: '4',
                target: '10',
            },
            {
                source: '5',
                target: '8',
            },
            {
                source: '8',
                target: '9',
            },
            {
                source: '9',
                target: '10',
            },
        ],
    };

    for (let i = 0; i < Math.round(Math.random() * data.edges.length) / 2; i++) {
        data.edges[Math.round(Math.random() * data.edges.length)].source = "";
        data.edges[Math.round(Math.random() * data.edges.length)].target = "";
    }


    const ref = React.useRef(null);
    let graph = null;
    React.useEffect(() => {
        if (!graph) {
            const tooltip = new G6.Tooltip({
                offsetX: 10,
                offsetY: 20,
                getContent(e) {
                    const outDiv = document.createElement('div');
                    outDiv.style.width = '180px';
                    outDiv.innerHTML = `
                            <p style="text-align: center">node info</p>
                            <div>
                                <li>name: ${e.item.getModel().label}</li>
                                <li>source: </li>
                                <li>target: </li>
                            </div>`
                    return outDiv
                },
                itemTypes: ['node']
            });
            //@ts-ignore
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
                    // type: 'dagre',
                    // rankdir: 'TB', // 布局的方向
                    // align: 'UL', // 可选
                    // nodesep: 20, // 节点间距
                    // ranksep: 30, // 层间距
                    // controlPoints: true, // 是否保留布局连线的控制点
                    type: 'comboCombined',
                    outerLayout: new G6.Layout['dagre']({
                        rankdir: 'TB', // 布局的方向
                        align: 'UL', // 可选
                        nodesep: 10, // 节点间距
                        ranksep: 15, // 层间距
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
                    GLOBAL_SETTING.plugins.tooltip,
                    GLOBAL_SETTING.plugins.menu
                ],
                nodeStateStyles: GLOBAL_STYLE.nodeStateStyles
            });
            GLOBAL_STYLE.ItemStyle(graph);
            //@ts-ignore
            graph.data(data);
            graph.render();
            GLOBAL_SETTING.BehaviorBind(graph);


        }
    }, []);

    return <div ref={ref}/>;
}

