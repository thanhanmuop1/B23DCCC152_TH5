import React, { useEffect } from 'react';
import { history, useModel } from 'umi';
import { Table, Button, Space, Modal, Switch, Image } from 'antd';
import { PlusOutlined, ExclamationCircleOutlined, TeamOutlined } from '@ant-design/icons';
import { IClub } from '@/types/club';
import ClubForm from './components/ClubForm';
import moment from 'moment';

const { confirm } = Modal;

const ClubList: React.FC = () => {
  const {
    clubs,
    formVisible,
    currentClub,
    fetchClubs,
    deleteClub,
    showForm,
    hideForm,
  } = useModel('club');

  useEffect(() => {
    fetchClubs();
  }, []);

  const handleDelete = (id: string) => {
    confirm({
      title: 'Xác nhận xóa',
      icon: <ExclamationCircleOutlined />,
      content: 'Bạn có chắc chắn muốn xóa câu lạc bộ này?',
      onOk() {
        deleteClub(id);
      },
    });
  };

  const columns = [
    {
      title: 'Ảnh đại diện',
      dataIndex: 'avatar',
      width: 100,
      render: (avatar: string) => (
        <Image
          src={avatar || 'https://via.placeholder.com/100'}
          alt="Club avatar"
          width={50}
          height={50}
          style={{ objectFit: 'cover', borderRadius: '50%' }}
          fallback="https://via.placeholder.com/50"
        />
      ),
    },
    {
      title: 'Tên câu lạc bộ',
      dataIndex: 'name',
      sorter: (a: IClub, b: IClub) => a.name.localeCompare(b.name),
    },
    {
      title: 'Ngày thành lập',
      dataIndex: 'foundedDate',
      render: (date: string) => moment(date).format('DD/MM/YYYY'),
      sorter: (a: IClub, b: IClub) => moment(a.foundedDate).unix() - moment(b.foundedDate).unix(),
    },
    {
      title: 'Chủ nhiệm CLB',
      dataIndex: 'president',
      sorter: (a: IClub, b: IClub) => a.president.localeCompare(b.president),
    },
    {
      title: 'Hoạt động',
      dataIndex: 'isActive',
      render: (isActive: boolean) => (
        <Switch checked={isActive} disabled />
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: IClub) => (
        <Space size="middle">
          <Button 
            type="link" 
            onClick={() => showForm(record)}
          >
            Chỉnh sửa
          </Button>
          <Button 
            type="link" 
            onClick={() => history.push(`/clubs/${record.id}/members`)}
          >
            <TeamOutlined /> Thành viên
          </Button>
          <Button 
            type="link" 
            danger 
            onClick={() => handleDelete(record.id)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => showForm()}
        >
          Thêm mới
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={clubs}
        rowKey="id"
      />

      <ClubForm
        visible={formVisible}
        club={currentClub}
        onCancel={hideForm}
      />
    </div>
  );
};

export default ClubList; 