import React, { useEffect, useState } from 'react';
import { useModel, useParams } from 'umi';
import { Table, Button, Space, Select, Input, Tag } from 'antd';
import { 
  SyncOutlined, 
  SwapOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { IMember } from '@/types/membership';
import ChangeClubModal from './components/ChangeClubModal';
import moment from 'moment';

const { Option } = Select;

interface ClubParams {
  id: string;
}

const MembershipList: React.FC = () => {
  const { id } = useParams<ClubParams>();
  
  const {
    members,
    selectedMembers,
    changeClubModalVisible,
    fetchMembers,
    getMembersByClub,
    syncMembersFromApprovedRegistrations,
    getClubs,
    getClubName,
    showChangeClubModal,
    hideChangeClubModal,
    setSelectedMembers,
    setCurrentClubId,
  } = useModel('membership');

  const [filteredMembers, setFilteredMembers] = useState<IMember[]>([]);
  const [selectedClubFilter, setSelectedClubFilter] = useState<string | null>(id || null);

  const clubs = getClubs();

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    if (selectedClubFilter) {
      const membersByClub = getMembersByClub(selectedClubFilter);
      setFilteredMembers(membersByClub);
    } else {
      setFilteredMembers(members);
    }
  }, [members, selectedClubFilter]);

  useEffect(() => {
    if (id) {
      setSelectedClubFilter(id);
      setCurrentClubId(id);
    }
  }, [id]);

  const handleClubFilterChange = (value: string | null) => {
    setSelectedClubFilter(value);
    setCurrentClubId(value);
    setSelectedMembers([]);
  };

  const rowSelection = {
    selectedRowKeys: selectedMembers,
    onChange: (selectedRowKeys: React.Key[]) => {
      setSelectedMembers(selectedRowKeys);
    },
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

  const getStatusTag = (status: string) => {
    switch (status) {
      case 'active':
        return <Tag color="green">Hoạt động</Tag>;
      case 'inactive':
        return <Tag color="red">Không hoạt động</Tag>;
      default:
        return <Tag>Unknown</Tag>;
    }
  };

  const columns = [
    {
      title: 'Họ tên',
      dataIndex: 'fullName',
      key: 'fullName',
      sorter: (a: IMember, b: IMember) => a.fullName.localeCompare(b.fullName),
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
      onFilter: (value: string, record: IMember) =>
        record.fullName.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: (a: IMember, b: IMember) => a.email.localeCompare(b.email),
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
      onFilter: (value: string, record: IMember) => record.gender === value,
    },
    {
      title: 'Câu lạc bộ',
      dataIndex: 'clubId',
      key: 'clubId',
      render: (clubId: string) => getClubName(clubId),
    },
    {
      title: 'Sở trường',
      dataIndex: 'skills',
      key: 'skills',
      ellipsis: true,
    },
    {
      title: 'Ngày tham gia',
      dataIndex: 'joinDate',
      key: 'joinDate',
      render: (date: string) => moment(date).format('DD/MM/YYYY'),
      sorter: (a: IMember, b: IMember) => moment(a.joinDate).valueOf() - moment(b.joinDate).valueOf(),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getStatusTag(status),
      filters: [
        { text: 'Hoạt động', value: 'active' },
        { text: 'Không hoạt động', value: 'inactive' },
      ],
      onFilter: (value: string, record: IMember) => record.status === value,
    },
  ];

  // Số lượng thành viên đã chọn
  const hasSelected = selectedMembers.length > 0;

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <Space size="middle">
            <span>Câu lạc bộ:</span>
            <Select 
              style={{ width: 250 }} 
              value={selectedClubFilter} 
              onChange={handleClubFilterChange}
              allowClear
              placeholder="Tất cả CLB"
            >
              {clubs.map(club => (
                <Option key={club.id} value={club.id}>
                  {club.name}
                </Option>
              ))}
            </Select>

            <Button
              icon={<SyncOutlined />}
              onClick={syncMembersFromApprovedRegistrations}
              title="Đồng bộ thành viên từ đơn đăng ký đã duyệt"
            >
              Đồng bộ thành viên
            </Button>
          </Space>
        </div>

        <div>
          {hasSelected && (
            <Button
              type="primary"
              icon={<SwapOutlined />}
              onClick={showChangeClubModal}
            >
              Chuyển CLB cho {selectedMembers.length} thành viên
            </Button>
          )}
        </div>
      </div>

      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={filteredMembers}
        rowKey="id"
      />

      <ChangeClubModal
        visible={changeClubModalVisible}
        onCancel={hideChangeClubModal}
      />
    </div>
  );
};

export default MembershipList; 