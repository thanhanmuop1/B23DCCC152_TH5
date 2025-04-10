import React, { useEffect } from 'react';
import { Modal, Form, Input, DatePicker, Switch, Upload } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { IClub } from '@/types/club';
import TinyEditor from '@/components/TinyEditor';
import { useModel } from 'umi';

interface ClubFormProps {
  visible: boolean;
  club: IClub | null;
  onCancel: () => void;
}

const ClubForm: React.FC<ClubFormProps> = ({
  visible,
  club,
  onCancel,
}) => {
  const {
    form,
    initForm,
    handleImageValidation,
    handleImageUpload,
    handleFormSubmit,
  } = useModel('club');

  useEffect(() => {
    initForm(club);
  }, [club, visible]);

  const handleChange = async (info: any) => {
    if (info.file.status === 'done') {
      await handleImageUpload(info.file.originFileObj);
    }
  };

  return (
    <Modal
      title={club ? 'Chỉnh sửa câu lạc bộ' : 'Thêm mới câu lạc bộ'}
      visible={visible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      width={800}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFormSubmit}
      >
        <Form.Item
          name="avatar"
          label="Ảnh đại diện"
        >
          <Upload
            name="avatar"
            listType="picture-card"
            showUploadList={false}
            beforeUpload={handleImageValidation}
            onChange={handleChange}
            customRequest={({ onSuccess }) => onSuccess?.('ok')}
          >
            {form.getFieldValue('avatar') ? (
              <img 
                src={form.getFieldValue('avatar')} 
                alt="avatar" 
                style={{ width: '100%' }} 
              />
            ) : (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            )}
          </Upload>
        </Form.Item>

        <Form.Item
          name="name"
          label="Tên câu lạc bộ"
          rules={[{ required: true, message: 'Vui lòng nhập tên câu lạc bộ' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="foundedDate"
          label="Ngày thành lập"
          rules={[{ required: true, message: 'Vui lòng chọn ngày thành lập' }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="president"
          label="Chủ nhiệm CLB"
          rules={[{ required: true, message: 'Vui lòng nhập tên chủ nhiệm' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="description"
          label="Mô tả"
        >
          <TinyEditor />
        </Form.Item>

        <Form.Item
          name="isActive"
          label="Hoạt động"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ClubForm; 