import React, { useEffect } from 'react';
import { Form, Input, Button, Select, Modal, Radio } from 'antd';
import { useModel } from 'umi';
import { IRegistration } from '@/types/registration';

const { Option } = Select;
const { TextArea } = Input;

interface RegistrationFormProps {
  visible: boolean;
  registration: IRegistration | null;
  onCancel: () => void;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({
  visible,
  registration,
  onCancel,
}) => {
  const {
    form,
    initForm,
    submitForm,
    handleFormSubmit,
    getClubs,
  } = useModel('registration');

  const clubs = getClubs();

  // Khởi tạo form khi mở modal
  useEffect(() => {
    if (visible) {
      initForm(registration);
    }
  }, [visible, registration]);

  const formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
  };

  const modalFooter = {
    okText: registration ? 'Cập nhật' : 'Thêm mới',
    cancelText: 'Hủy',
    onOk: submitForm,
    onCancel,
  };

  return (
    <Modal
      title={registration ? 'Chỉnh sửa đơn đăng ký' : 'Thêm mới đơn đăng ký'}
      visible={visible}
      width={800}
      {...modalFooter}
    >
      <Form
        {...formLayout}
        form={form}
        name="registration_form"
        onFinish={handleFormSubmit}
        initialValues={{
          gender: 'male',
        }}
      >
        <Form.Item
          label="Họ và tên"
          name="fullName"
          rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
        >
          <Input placeholder="Nhập họ và tên" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Vui lòng nhập email!' },
            { type: 'email', message: 'Email không hợp lệ!' },
          ]}
        >
          <Input placeholder="Nhập email" />
        </Form.Item>

        <Form.Item
          label="Số điện thoại"
          name="phone"
          rules={[
            { required: true, message: 'Vui lòng nhập số điện thoại!' },
            { pattern: /^[0-9]{10}$/, message: 'Số điện thoại không hợp lệ!' },
          ]}
        >
          <Input placeholder="Nhập số điện thoại" />
        </Form.Item>

        <Form.Item
          label="Giới tính"
          name="gender"
          rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
        >
          <Radio.Group>
            <Radio value="male">Nam</Radio>
            <Radio value="female">Nữ</Radio>
            <Radio value="other">Khác</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label="Địa chỉ"
          name="address"
          rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
        >
          <Input placeholder="Nhập địa chỉ" />
        </Form.Item>

        <Form.Item
          label="Sở trường"
          name="skills"
          rules={[{ required: true, message: 'Vui lòng nhập sở trường!' }]}
        >
          <TextArea rows={3} placeholder="Nhập sở trường của bạn" />
        </Form.Item>

        <Form.Item
          label="Câu lạc bộ"
          name="clubId"
          rules={[{ required: true, message: 'Vui lòng chọn câu lạc bộ!' }]}
        >
          <Select placeholder="Chọn câu lạc bộ">
            {clubs.map(club => (
              <Option key={club.id} value={club.id}>
                {club.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Lý do đăng ký"
          name="reason"
          rules={[{ required: true, message: 'Vui lòng nhập lý do đăng ký!' }]}
        >
          <TextArea rows={4} placeholder="Nhập lý do đăng ký" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RegistrationForm; 