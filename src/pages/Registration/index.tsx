import React, { useEffect } from 'react';
import { useModel } from 'umi';
import { Table, Button, Space, Modal, Tag, Input } from 'antd';
import { 
  PlusOutlined, 
  ExclamationCircleOutlined, 
  SearchOutlined,
  CheckOutlined,
  CloseOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import { IRegistration } from '@/types/registration';
import RegistrationForm from './components/RegistrationForm';
import RegistrationDetail from './components/RegistrationDetail';
import RejectModal from './components/RejectModal';
import HistoryModal from './components/HistoryModal';
import moment from 'moment';

const { confirm } = Modal;

const RegistrationList: React.FC = () => {
  const {
    registrations,
    formVisible,
    currentRegistration,
    selectedRowKeys,
    detailVisible,
    historyVisible,
    rejectModalVisible,
    rejectMultipleModalVisible,
    fetchRegistrations,
    deleteRegistration,
    approveRegistration,
    showForm,
    hideForm,
    showDetail,
    hideDetail,
    showRejectModal,
    hideRejectModal,
    showRejectMultipleModal,
    hideRejectMultipleModal,
    hideHistory,
    getClubName,
    approveMultipleRegistrations,
    setSelectedRowKeys,
  } = useModel('registration');

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const handleDelete = (id: string) => {
    confirm({
      title: 'Xác nhận xóa',
      icon: <ExclamationCircleOutlined />,
      content: 'Bạn có chắc chắn muốn xóa đơn đăng ký này?',
      onOk() {
        deleteRegistration(id);
      },
    });
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
    getCheckboxProps: (record: IRegistration) => ({
      disabled: record.status !== 'pending',
      name: record.fullName,
    }),
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

  const columns = [
    {
      title: 'Họ tên',
      dataIndex: 'fullName',
      key: 'fullName',
      sorter: (a: IRegistration, b: IRegistration) => a.fullName.localeCompare(b.fullName),
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Tìm kiếm họ tên"
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm()}
            style={{ marginBottom: 8, display: 'block' }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => confirm()}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Tìm
            </Button>
            <Button onClick={() => clearFilters()} size="small" style={{ width: 90 }}>
              Xóa
            </Button>
          </Space>
        </div>
      ),
      onFilter: (value: string, record: IRegistration) =>
        record.fullName.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: (a: IRegistration, b: IRegistration) => a.email.localeCompare(b.email),
    },
    {
      title: 'SĐT',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Giới tính',
      dataIndex: 'gender',
      key: 'gender',
      render: (gender: string) => getGenderText(gender),
      filters: [
        { text: 'Nam', value: 'male' },
        { text: 'Nữ', value: 'female' },
        { text: 'Khác', value: 'other' },
      ],
      onFilter: (value: string, record: IRegistration) => record.gender === value,
    },
    {
      title: 'Câu lạc bộ',
      dataIndex: 'clubId',
      key: 'clubId',
      render: (clubId: string) => getClubName(clubId),
    },
    {
      title: 'Ngày đăng ký',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => moment(date).format('DD/MM/YYYY'),
      sorter: (a: IRegistration, b: IRegistration) => 
        moment(a.createdAt).valueOf() - moment(b.createdAt).valueOf(),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getStatusTag(status),
      filters: [
        { text: 'Chờ duyệt', value: 'pending' },
        { text: 'Đã duyệt', value: 'approved' },
        { text: 'Từ chối', value: 'rejected' },
      ],
      onFilter: (value: string, record: IRegistration) => record.status === value,
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: IRegistration) => (
        <Space size="middle">
          <Button 
            type="link" 
            icon={<EyeOutlined />}
            onClick={() => showDetail(record)}
          >
            Chi tiết
          </Button>
          <Button 
            type="link" 
            icon={<EditOutlined />}
            onClick={() => showForm(record)}
            disabled={record.status !== 'pending'}
          >
            Sửa
          </Button>
          <Button 
            type="link" 
            icon={<DeleteOutlined />}
            danger 
            onClick={() => handleDelete(record.id)}
            disabled={record.status !== 'pending'}
          >
            Xóa
          </Button>
          {record.status === 'pending' && (
            <>
              <Button 
                type="link" 
                icon={<CheckOutlined />}
                style={{ color: '#52c41a' }}
                onClick={() => approveRegistration(record.id)}
              >
                Duyệt
              </Button>
              <Button 
                type="link" 
                icon={<CloseOutlined />}
                danger
                onClick={() => showRejectModal(record)}
              >
                Từ chối
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  // Số lượng đơn đăng ký đã chọn
  const hasSelected = selectedRowKeys.length > 0;

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => showForm()}
          >
            Thêm mới
          </Button>
        </div>
        <div>
          {hasSelected && (
            <Space>
              <span style={{ marginRight: 8 }}>
                Đã chọn {selectedRowKeys.length} đơn
              </span>
              <Button
                type="primary"
                onClick={approveMultipleRegistrations}
                icon={<CheckOutlined />}
              >
                Duyệt đơn đã chọn
              </Button>
              <Button
                danger
                onClick={showRejectMultipleModal}
                icon={<CloseOutlined />}
              >
                Từ chối đơn đã chọn
              </Button>
            </Space>
          )}
        </div>
      </div>

      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={registrations}
        rowKey="id"
      />

      <RegistrationForm
        visible={formVisible}
        registration={currentRegistration}
        onCancel={hideForm}
      />

      <RegistrationDetail
        visible={detailVisible}
        registration={currentRegistration}
        onCancel={hideDetail}
      />

      <RejectModal
        visible={rejectModalVisible}
        registration={currentRegistration}
        onCancel={hideRejectModal}
      />

      <RejectModal
        visible={rejectMultipleModalVisible}
        registration={null}
        multiple
        onCancel={hideRejectMultipleModal}
      />

      <HistoryModal
        visible={historyVisible}
        onCancel={hideHistory}
      />
    </div>
  );
};

export default RegistrationList; 