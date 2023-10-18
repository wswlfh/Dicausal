const data1 = {
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

export const data2 = {
    nodes: [
        {
            id: '切片流量',
            label: '切片流量',
            comboId: 'sub0'
        },
        {
            id: '烟叶流量',
            label: '烟叶流量',
            comboId: 'sub0'
        },
        {
            id: '切前润叶入口水分',
            label: '切前润叶入口水分',
            comboId: 'sub0'
        },
        {

            id: '水流量调节量',
            label: '水流量调节量',
            comboId: 'sub0'
        },
        {
            id: '加水累积量',
            label: '加水累积量',
            comboId: 'sub0'
        },
        {
            id: '水流量',
            label: '水流量',
            comboId: 'sub0'
        },
        {
            id: '大片率',
            label: '大片率',

            comboId: 'sub0'
        }, {
            id: '中片率',
            label: '中片率',

            comboId: 'sub0'
        },


        {
            id: '烘前水分_x',
            label: '烘前水分_x',
            comboId: 'sub1'
        },
        {
            id: 'KLD烘后温度',
            label: 'KLD烘后温度',
            comboId: 'sub1'
        },
        {
            id: 'HDT烘前水分',
            label: 'HDT烘前水分',
            comboId: 'sub2'
        },
        {
            id: '烘前皮带秤',
            label: '烘前皮带秤',
            comboId: 'sub1'
        },
        {
            id: 'KLD区1筒壁温度',
            label: 'KLD区1筒壁温度',
            comboId: 'sub1'
        },
        {
            id: '叶丝填充值',
            label: '叶丝填充值',

            comboId: 'sub1'
        },
        {
            id: '叶丝长丝率',
            label: '叶丝长丝率',

            comboId: 'sub1'
        },
        {
            id: '叶丝中丝率',
            label: '叶丝中丝率',

            comboId: 'sub1'
        },


        {
            id: '计划投料量',
            label: '计划投料量',
            comboId: 'sub2'
        },
        {
            id: '片烟秤重量',
            label: '片烟秤重量',
            comboId: 'sub2'
        },
        {
            id: '计划修正量',
            label: '计划修正量',
            comboId: 'sub2'
        },
        {
            id: '片烟修正量',
            label: '片烟修正量',
            comboId: 'sub2'
        },
        {
            id: '投料片烟水分',
            label: '投料片烟水分',
            comboId: 'sub2'
        },
        {
            id: '叶丝装箱水分',
            label: '叶丝装箱水分',
            comboId: 'sub2'
        },
        {
            id: '其他批次叶丝秤量',
            label: '其他批次叶丝秤量',
            comboId: 'sub2'
        },

        {
            id: 'C_QTY1',
            label: 'C_QTY1',
            comboId: 'sub2'
        },

        {
            id: '烟丝填充值',
            label: '烟丝填充值',

            comboId: 'sub2'
        },
        {
            id: '烟丝长丝率',
            label: '烟丝长丝率',
            comboId: 'sub2'
        },
        {
            id: '烟丝中丝率',
            label: '烟丝中丝率',

            comboId: 'sub2'
        },
        {
            id: '总出丝率',
            label: '总出丝率',
            class: 'final'
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
            target: '总出丝率',
        },
        {
            source: 'sub1',
            target: 'sub2',
        },

        {
            source: 'sub1',
            target: '总出丝率',
        },
        {
            source: 'sub2',
            target: '总出丝率',
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

export const data3 = {
    nodes: [
        {
            id: '切片流量',
            label: '切片流量',
            comboId: 'sub0'
        },
        {
            id: '烟叶流量',
            label: '烟叶流量',
            comboId: 'sub0'
        },
        {
            id: '切前润叶入口水分',
            label: '切前润叶入口水分',
            comboId: 'sub0'
        },
        {

            id: '水流量调节量',
            label: '水流量调节量',
            comboId: 'sub0'
        },
        {
            id: '加水累积量',
            label: '加水累积量',
            comboId: 'sub0'
        },
        {
            id: '水流量',
            label: '水流量',
            comboId: 'sub0'
        },
        {
            id: '大片率',
            label: '大片率',

            comboId: 'sub0'
        }, {
            id: '中片率',
            label: '中片率',

            comboId: 'sub0'
        },


        {
            id: '烘前水分_x',
            label: '烘前水分_x',
            comboId: 'sub1'
        },
        {
            id: 'KLD烘后温度',
            label: 'KLD烘后温度',
            comboId: 'sub1'
        },
        {
            id: 'HDT烘前水分',
            label: 'HDT烘前水分',
            comboId: 'sub2'
        },
        {
            id: '烘前皮带秤',
            label: '烘前皮带秤',
            comboId: 'sub1'
        },
        {
            id: 'KLD区1筒壁温度',
            label: 'KLD区1筒壁温度',
            comboId: 'sub1'
        },
        {
            id: '叶丝填充值',
            label: '叶丝填充值',

            comboId: 'sub1'
        },
        {
            id: '叶丝长丝率',
            label: '叶丝长丝率',

            comboId: 'sub1'
        },
        {
            id: '叶丝中丝率',
            label: '叶丝中丝率',

            comboId: 'sub1'
        },


        {
            id: '计划投料量',
            label: '计划投料量',
            comboId: 'sub2'
        },
        {
            id: '片烟秤重量',
            label: '片烟秤重量',
            comboId: 'sub2'
        },
        {
            id: '计划修正量',
            label: '计划修正量',
            comboId: 'sub2'
        },
        {
            id: '片烟修正量',
            label: '片烟修正量',
            comboId: 'sub2'
        },
        {
            id: '投料片烟水分',
            label: '投料片烟水分',
            comboId: 'sub2'
        },
        {
            id: '叶丝装箱水分',
            label: '叶丝装箱水分',
            comboId: 'sub2'
        },
        {
            id: '其他批次叶丝秤量',
            label: '其他批次叶丝秤量',
            comboId: 'sub2'
        },

        {
            id: 'C_QTY1',
            label: 'C_QTY1',
            comboId: 'sub2'
        },

        {
            id: '烟丝填充率',
            label: '烟丝填充值',

            comboId: 'sub2'
        },
        {
            id: '烟丝长丝率',
            label: '烟丝长丝率',

            comboId: 'sub2'
        },
        {
            id: '烟丝中丝率',
            label: '烟丝中丝率',

            comboId: 'sub2'
        },
        {
            id: '总出丝率',
            label: '总出丝率',
            class: 'final'
        },
    ],
    edges: [
        {
            source: '切片流量',
            target: '大片率',
        },
        {
            source: '烟叶流量',
            target: '大片率',
        },
        {
            source: '切前润叶入口水分',
            target: '大片率',
        },
        {
            source: '水流量调节量',
            target: '大片率',
        },
        {
            source: '加水累积量',
            target: '大片率',
        },

        {
            source: '烟叶流量',
            target: '中片率',
        },

        {
            source: '水流量调节量',
            target: '中片率',
        },
        {
            source: '加水累积量',
            target: '中片率',
        },

        {
            source: '烘前水分_x',
            target: '叶丝填充值',
        },
        {
            source: 'KLD烘后温度',
            target: '叶丝填充值',
        },

        {
            source: 'KLD区1筒壁温度',
            target: '叶丝填充值',
        },

        {
            source: 'KLD区1筒壁温度',
            target: '叶丝长丝率',
        },
        {
            source: 'HDT烘前水分',
            target: '叶丝长丝率',
        },
        {
            source: '切前润叶入口水分',
            target: '叶丝长丝率',
        },
        {
            source: '中片率',
            target: '叶丝长丝率',
        },


        {
            source: '中片率',
            target: '叶丝中丝率',
        },

        {
            source: '烘前皮带秤',
            target: '叶丝中丝率',
        },
        {
            source: '烘前水分_x',
            target: '叶丝中丝率',
        },

        {
            source: '烘前水分_x',
            target: '烟丝填充值',
        },

        {
            source: '计划修正量',
            target: '烟丝填充值',
        },
        {
            source: '叶丝装箱水分',
            target: '烟丝填充值',
        },
        {
            source: 'C_QTY1',
            target: '烟丝填充值',
        },

        {
            source: '叶丝装箱水分',
            target: '烟丝长丝率',
        },
        {
            source: 'C_QTY1',
            target: '烟丝中丝率',
        },


        {
            source: '烟叶流量',
            target: '总出丝率',
        },


        {
            source: '叶丝填充值',
            target: '总出丝率',
        },
        {
            source: '叶丝长丝率',
            target: '总出丝率',
        },
        {
            source: '叶丝中丝率',
            target: '总出丝率',
        },
        {
            source: '大片率',
            target: '总出丝率',
        },
        {
            source: '中片率',
            target: '总出丝率',
        },
        {
            source: '计划投料量',
            target: '总出丝率',
        },
        {
            source: '烟丝填充值',
            target: '总出丝率',
        },

        {
            source: '烟丝中丝率',
            target: '总出丝率',
        },

    ],
};

