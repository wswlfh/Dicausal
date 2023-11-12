interface Column {
  dataIndex: string;
  key: string;
  title: string;
}

interface CsvTableData {
  columns: Column[];
  dataSource: any[];
}

interface ShapMeanList {
  [key: string]: number;
}

interface ThresholdData {
  shapMeanList: ShapMeanList;
  shap_1: string;
  shap_2: string;
  shap_3: string;
}

interface KeyEffectData {
  threshold_1: ThresholdData;
  threshold_2: ThresholdData;
  threshold_3: ThresholdData;
}

interface ShapApiResData {
  [key: string]: KeyEffectData;
}

interface FormData {
  list: Array<{ sub: number, effect: string[], key_effect: string[] }>;
  final_effect: string[];
}

//G6
interface G6Node {
  id: string;
  label: string;
  comboId?: string;
}

interface G6Edge {
  source: string;
  target: string;
}

interface G6Combo {
  id: string;
  label: string;
}

interface G6Data {
  nodes: G6Node[];
  edges: G6Edge[];
  combos: G6Combo[];
}

class GlobalConfig {
  private csvTableData: CsvTableData = { columns: [], dataSource: [] };
  private shapApiResData: ShapApiResData = {};
  private isDraw: boolean = false;

  private listeners: Function[] = [];

  // 在 GlobalConfig 类中
  private globalForm: FormData = {
    list: [],
    final_effect: []
  };

  private initialGlobalForm: FormData = {
    list: [],
    final_effect: []
  };
  // 获取 globalForm
  getGlobalForm(): FormData {
    return this.globalForm;
  }

  // 设置 globalForm
  setGlobalForm(newData: FormData): void {
    this.globalForm = newData;
    if (this.initialGlobalForm.list.length === 0 && this.initialGlobalForm.final_effect.length === 0)
      this.initialGlobalForm = JSON.parse(JSON.stringify(this.globalForm));
    this.notifyListeners();  // 数据更新后通知监听器
  }


  getCsvTableData(): CsvTableData {
    return this.csvTableData;
  }

  getColumnTitles(): string[] {
    return this.csvTableData?.columns?.map(column => column.title) || [];
  }

  setCsvTableData(newTableData: CsvTableData): void {
    this.csvTableData = newTableData;
    this.notifyListeners();
  }

  resetCsvTableData(): void {
    this.csvTableData = { columns: [], dataSource: [] };
  }

  // 获取 ShapApiResData
  getShapApiResData(): ShapApiResData {
    return this.shapApiResData;
  }

  // 设置 ShapApiResData
  setShapApiResData(newData: ShapApiResData): void {
    this.shapApiResData = newData;
    this.notifyListeners();  // 数据更新后通知监听器
  }

  // 获取 globalForm 中所有的 effect
  getAllEffect(): string[] {
    return this.initialGlobalForm.list.flatMap(item => item.effect);
  }

  // 获取 globalForm 中所有的 key_effect
  getAllKeyEffect(): string[] {
    return this.initialGlobalForm.list.flatMap(item => item.key_effect);
  }

  // 获取 globalForm 中的 final_effect
  getFinalEffect(): string[] {
    return this.initialGlobalForm.final_effect;
  }

  // 在 GlobalConfig 类中添加
  getG6Data(): G6Data {
    const nodes: G6Node[] = [];
    const edges: G6Edge[] = [];
    const combos: G6Combo[] = [];

    let nodeIdCounter = 0;  // 新增的计数器

    // 生成 nodes 和 combos
    this.globalForm.list.forEach(({ effect, key_effect }, index) => {
      const comboId = `sub${index}`;
      // combos.push({ id: comboId, label: comboId });

      effect.forEach((effectName) => {
        nodes.push({ id: String(nodeIdCounter++), label: effectName, comboId: comboId });
      });

      key_effect.forEach((keyEffectName) => {
        nodes.push({ id: String(nodeIdCounter++), label: keyEffectName, comboId: comboId });
      });
    });

    // 生成最终效应节点
    this.globalForm.final_effect.forEach((finalEffectName) => {
      nodes.push({ id: String(nodeIdCounter), label: finalEffectName });
    });

    // 生成 edges
    // for (let i = 0; i < this.initialGlobalForm.list.length; i++) {
    //   const sourceComboId = `sub${i}`;

    //   // 当前子系统到最终效应的边
    //   this.globalForm.final_effect.forEach(() => {
    //     edges.push({ source: sourceComboId, target: String(nodeIdCounter) });
    //   });

    //   // 当前子系统到其他较大子系统的边
    //   for (let j = i + 1; j < this.globalForm.list.length; j++) {
    //     const targetComboId = `sub${j}`;
    //     edges.push({ source: sourceComboId, target: targetComboId });
    //   }
    // }

    return { nodes, edges, combos };
  }


  //判断是否要重新画图
  setIsDraw(newData: boolean) {
    this.isDraw = newData;
    this.notifyListeners();  // 数据更新后通知监听器
  }

  getIsDraw() {
    return this.isDraw;
  }

  //监听自定义事件，当数据更新的时候触发
  addListener(fn: Function) {
    // console.log('Add Listener', fn);

    this.listeners.push(fn);
  }

  removeListener(fn: Function) {
    const index = this.listeners.indexOf(fn);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }

  notifyListeners() {
    this.listeners.forEach(fn => {
      // console.log('Execute Listener', fn);
      fn()
    });
  }

}
// 创建一个全局的配置实例
const globalConfig = new GlobalConfig();

//暴露给windows
(window as any).globalConfig = globalConfig;


export default globalConfig;
