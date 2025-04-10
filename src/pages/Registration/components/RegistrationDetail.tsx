import React from 'react';
import { Modal, Descriptions, Button, Tag, Space } from 'antd';
import { useModel } from 'umi';
import { IRegistration } from '@/types/registration';
import moment from 'moment';

interface RegistrationDetailProps {
  visible: boolean;
  registration: IRegistration | null;
  onCancel: () => void;
}

const RegistrationDetail: React.FC<RegistrationDetailProps> = ({
  visible,
  registration,
  onCancel,
}) => {
  const { getClubName, fetchRegistrationHistory } = useModel('registration');

  if (!registration) return null;

  const getGenderText = (gender: string) => {
    switch (gender) {
      case 'male':
        return 'Nam';
      case 'female':
        return 'Nữ';
      default:
        return 'Khác';
    }
  };

  const getStatusTag = (status: string) => {
    switch (status) {
      case 'pending':
        return <Tag color="blue">Chờ duyệt</Tag>;
      case 'approved':
        return <Tag color="green">Đã duyệt</Tag>;
      case 'rejected':
        return <Tag color="red">Từ chối</Tag>;
      default:
        return <Tag>Unknown</Tag>;
    }
  };

  return (
    <Modal
      title="Chi tiết đơn đăng ký"
      visible={visible}
      width={800}
      footer={[
        <Button key="history" type="primary" onClick={() => fetchRegistrationHistory(registration.id)}>
          Xem lịch sử thao tác
        </Button>,
        <Button key="back" onClick={onCancel}>
          Đóng
        </Button>,
      ]}
      onCancel={onCancel}
    >
      <Descriptions bordered column={1}>
        <Descriptions.Item label="Họ và tên">{registration.fullName}</Descriptions.Item>
        <Descriptions.Item label="Email">{registration.email}</Descriptions.Item>
        <Descriptions.Item label="Số điện thoại">{registration.phone}</Descriptions.Item>
        <Descriptions.Item label="Giới tính">{getGenderText(registration.gender)}</Descriptions.Item>
        <Descriptions.Item label="Địa chỉ">{registration.address}</Descriptions.Item>
        <Descriptions.Item label="Sở trường">{registration.skills}</Descriptions.Item>
        <Descriptions.Item label="Câu lạc bộ">{getClubName(registration.clubId)}</Descriptions.Item>
        <Descriptions.Item label="Lý do đăng ký">{registration.reason}</Descriptions.Item>
        <Descriptions.Item label="Trạng thái">
          {getStatusTag(registration.status)}
        </Descriptions.Item>
        {registration.status === 'rejected' && (
          <Descriptions.Item label="Lý do từ chối">{registration.rejectReason}</Descriptions.Item>
        )}
        <Descriptions.Item label="Ngày tạo">
          {moment(registration.createdAt).format('DD/MM/YYYY HH:mm:ss')}
        </Descriptions.Item>
        <Descriptions.Item label="Ngày cập nhật">
          {moment(registration.updatedAt).format('DD/MM/YYYY HH:mm:ss')}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default RegistrationDetail; 