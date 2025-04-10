import React from 'react';
import { Modal, Form, Select } from 'antd';
import { useModel } from 'umi';

const { Option } = Select;

interface ChangeClubModalProps {
  visible: boolean;
  onCancel: () => void;
}

const ChangeClubModal: React.FC<ChangeClubModalProps> = ({
  visible,
  onCancel,
}) => {
  const {
    selectedMembers,
    selectedClubId,
    setSelectedClubId,
    getClubs,
    getClubName,
    changeClubForMembers,
    currentClubId,
  } = useModel('membership');

  const clubs = getClubs();
  const filteredClubs = currentClubId 
    ? clubs.filter(club => club.id !== currentClubId) 
    : clubs;

  const handleOk = () => {
    if (selectedClubId) {
      changeClubForMembers(selectedClubId);
    }
  };

  return (
    <Modal
      title="Chuyển CLB cho thành viên"
      visible={visible}
      onOk={handleOk}
      onCancel={onCancel}
      okText="Xác nhận chuyển"
      cancelText="Hủy"
    >
      <Form layout="vertical">
        <Form.Item
          label={`Bạn đang chuyển ${selectedMembers.length} thành viên từ ${currentClubId ? getClubName(currentClubId) : ''} sang CLB mới:`}
          required
        >
          <Select
            placeholder="Chọn CLB mới"
            value={selectedClubId}
            onChange={(value) => setSelectedClubId(value as string)}
            style={{ width: '100%' }}
          >
            {filteredClubs.map(club => (
              <Option key={club.id} value={club.id}>
                {club.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ChangeClubModal; 