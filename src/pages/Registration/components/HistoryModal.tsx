import React from 'react';
import { Modal, Timeline, Tag } from 'antd';
import { useModel } from 'umi';
import { IRegistrationHistory } from '@/types/registration';
import moment from 'moment';
import { 
  CheckCircleOutlined, 
  CloseCircleOutlined, 
  EditOutlined, 
  PlusCircleOutlined 
} from '@ant-design/icons';

interface HistoryModalProps {
  visible: boolean;
  onCancel: () => void;
}

const HistoryModal: React.FC<HistoryModalProps> = ({
  visible,
  onCancel,
}) => {
  const { currentHistory } = useModel('registration');

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'created':
        return <PlusCircleOutlined style={{ color: '#1890ff' }} />;
      case 'approved':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'rejected':
        return <CloseCircleOutlined style={{ color: '#f5222d' }} />;
      case 'updated':
        return <EditOutlined style={{ color: '#faad14' }} />;
      default:
        return null;
    }
  };

  const getActionText = (action: string) => {
    switch (action) {
      case 'created':
        return <Tag color="blue">Tạo mới</Tag>;
      case 'approved':
        return <Tag color="green">Duyệt</Tag>;
      case 'rejected':
        return <Tag color="red">Từ chối</Tag>;
      case 'updated':
        return <Tag color="orange">Cập nhật</Tag>;
      default:
        return <Tag>Unknown</Tag>;
    }
  };

  const sortedHistory = [...currentHistory].sort((a, b) => 
    moment(b.timestamp).valueOf() - moment(a.timestamp).valueOf()
  );

  return (
    <Modal
      title="Lịch sử thao tác"
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={700}
    >
      {sortedHistory.length === 0 ? (
        <p>Không có lịch sử thao tác nào.</p>
      ) : (
        <Timeline mode="left">
          {sortedHistory.map((history: IRegistrationHistory) => (
            <Timeline.Item 
              key={history.id} 
              dot={getActionIcon(history.action)}
            >
              <div style={{ marginBottom: 8 }}>
                <span style={{ marginRight: 8 }}>
                  {getActionText(history.action)}
                </span>
                <span style={{ color: '#888' }}>
                  bởi {history.adminName} - {moment(history.timestamp).format('DD/MM/YYYY HH:mm:ss')}
                </span>
              </div>
              {history.reason && (
                <div style={{ color: '#333', marginTop: 4 }}>
                  Lý do: {history.reason}
                </div>
              )}
            </Timeline.Item>
          ))}
        </Timeline>
      )}
    </Modal>
  );
};

export default HistoryModal; 