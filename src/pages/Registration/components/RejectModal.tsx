import React from 'react';
import { Modal, Input, Form } from 'antd';
import { useModel } from 'umi';
import { IRegistration } from '@/types/registration';

const { TextArea } = Input;

interface RejectModalProps {
  visible: boolean;
  registration: IRegistration | null;
  multiple?: boolean;
  onCancel: () => void;
}

const RejectModal: React.FC<RejectModalProps> = ({
  visible,
  registration,
  multiple = false,
  onCancel,
}) => {
  const { 
    rejectReason, 
    setRejectReason, 
    rejectRegistration, 
    rejectMultipleRegistrations,
    selectedRowKeys,
  } = useModel('registration');

  const handleOk = () => {
    if (multiple) {
      rejectMultipleRegistrations(rejectReason);
    } else if (registration) {
      rejectRegistration(registration.id, rejectReason);
    }
  };

  return (
    <Modal
      title={multiple ? `Từ chối ${selectedRowKeys.length} đơn đăng ký` : "Từ chối đơn đăng ký"}
      visible={visible}
      onOk={handleOk}
      onCancel={onCancel}
      okText="Xác nhận"
      cancelText="Hủy"
    >
      <Form layout="vertical">
        <Form.Item
          label="Lý do từ chối"
          required
          rules={[{ required: true, message: 'Vui lòng nhập lý do từ chối!' }]}
        >
          <TextArea
            rows={4}
            value={rejectReason}
            onChange={e => setRejectReason(e.target.value)}
            placeholder="Nhập lý do từ chối đơn đăng ký"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RejectModal; 