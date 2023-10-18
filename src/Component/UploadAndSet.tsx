import React from 'react';
import { Upload, Button, message, Tooltip } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import config from '../config';

interface UploadAndSetProps {
  onUploadSuccess: (data: any) => void;  // 用于上传成功后的操作
  onRemoveSuccess: () => void;  // 用于移除文件后的操作
}

const UploadAndSet: React.FC<UploadAndSetProps> = ({ onUploadSuccess, onRemoveSuccess }) => {

  const uploadProps = {
    name: 'file',
    action: `${config.backendURL}/upload`,
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info: any) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} 上传成功`);
        onUploadSuccess(info.file.response);  // 使用传入的 onUploadSuccess 函数更新全局状态
        console.log(info.file.response);

      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 上传失败.`);
        if (info.file.error.status === 400) {
          message.error(`不支持的文件类型！`);
        }
      }
    },
    onRemove(file: any) {
      // 当文件从列表中移除时触发
      message.success(`${file.name} 已成功移除`);
      onRemoveSuccess();  // 使用传入的 onRemoveSuccess 函数来清空相应的值
    }
  };

  return (
    <div>
      <Tooltip title="目前只支持csv/xlsx/xls文件格式">
        <Upload {...uploadProps}>
          <Button icon={<UploadOutlined />}>上传</Button>
        </Upload>
      </Tooltip>


    </div>
  );
};

export default UploadAndSet;
