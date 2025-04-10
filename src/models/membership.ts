import { useState } from 'react';
import { message, Form } from 'antd';
import { IMember, IClubChangeHistory } from '@/types/membership';
import { IClub } from '@/types/club';
import { IRegistration } from '@/types/registration';

export default () => {
  const [members, setMembers] = useState<IMember[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<React.Key[]>([]);
  const [changeClubModalVisible, setChangeClubModalVisible] = useState<boolean>(false);
  const [selectedClubId, setSelectedClubId] = useState<string>('');
  const [form] = Form.useForm();
  const [currentClubId, setCurrentClubId] = useState<string | null>(null);

  // Lấy danh sách thành viên từ localStorage
  const fetchMembers = () => {
    const storedMembers = localStorage.getItem('members');
    if (storedMembers) {
      setMembers(JSON.parse(storedMembers));
    } else {
      // Nếu chưa có dữ liệu thành viên, tạo từ các đơn đăng ký đã được duyệt
      syncMembersFromApprovedRegistrations();
    }
  };

  // Lấy danh sách thành viên theo CLB
  const getMembersByClub = (clubId: string | null = null) => {
    setCurrentClubId(clubId);
    
    if (!clubId) {
      return members;
    }
    
    return members.filter(member => member.clubId === clubId);
  };

  // Đồng bộ thành viên từ đơn đăng ký đã duyệt
  const syncMembersFromApprovedRegistrations = () => {
    const storedRegistrations = localStorage.getItem('registrations');
    if (!storedRegistrations) return;
    
    const registrations: IRegistration[] = JSON.parse(storedRegistrations);
    const approvedRegistrations = registrations.filter(r => r.status === 'approved');
    
    const existingMembers = members.map(m => m.registrationId);
    const newMembers: IMember[] = [
      ...members,
      ...approvedRegistrations
        .filter(r => !existingMembers.includes(r.id))
        .map(r => ({
          id: `member-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          registrationId: r.id,
          fullName: r.fullName,
          email: r.email,
          phone: r.phone,
          gender: r.gender,
          address: r.address,
          skills: r.skills,
          clubId: r.clubId,
          joinDate: r.createdAt,
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })),
    ];
    
    setMembers(newMembers);
    localStorage.setItem('members', JSON.stringify(newMembers));
    message.success('Đồng bộ thành viên từ đơn đăng ký thành công');
  };

  // Lấy danh sách CLB từ localStorage
  const getClubs = (): IClub[] => {
    const storedClubs = localStorage.getItem('clubs');
    if (storedClubs) {
      return JSON.parse(storedClubs);
    }
    return [];
  };

  // Tìm tên CLB theo ID
  const getClubName = (clubId: string): string => {
    const clubs = getClubs();
    const club = clubs.find(c => c.id === clubId);
    return club ? club.name : 'Unknown';
  };

  // Thay đổi CLB cho nhiều thành viên
  const changeClubForMembers = (newClubId: string) => {
    if (selectedMembers.length === 0) {
      message.error('Vui lòng chọn ít nhất một thành viên');
      return;
    }
    
    if (!newClubId) {
      message.error('Vui lòng chọn CLB muốn chuyển đến');
      return;
    }
    
    const updatedMembers = members.map(member => {
      if (selectedMembers.includes(member.id)) {
        // Lưu lịch sử thay đổi CLB
        saveClubChangeHistory(member.id, member.clubId, newClubId);
        
        return {
          ...member,
          clubId: newClubId,
          updatedAt: new Date().toISOString(),
        };
      }
      return member;
    });
    
    localStorage.setItem('members', JSON.stringify(updatedMembers));
    setMembers(updatedMembers);
    setChangeClubModalVisible(false);
    setSelectedClubId('');
    setSelectedMembers([]);
    message.success(`Đã chuyển ${selectedMembers.length} thành viên sang ${getClubName(newClubId)}`);
  };

  // Lưu lịch sử thay đổi CLB
  const saveClubChangeHistory = (memberId: string, oldClubId: string, newClubId: string) => {
    const historyEntry: IClubChangeHistory = {
      id: `hist-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      memberId,
      oldClubId,
      newClubId,
      adminName: 'Admin', // Thay thế bằng tên người dùng thật khi có hệ thống đăng nhập
      timestamp: new Date().toISOString(),
    };
    
    const storedHistory = localStorage.getItem('clubChangeHistory');
    let history: IClubChangeHistory[] = [];
    
    if (storedHistory) {
      history = JSON.parse(storedHistory);
    }
    
    history.push(historyEntry);
    localStorage.setItem('clubChangeHistory', JSON.stringify(history));
  };

  // Hiển thị modal chuyển CLB
  const showChangeClubModal = () => {
    if (selectedMembers.length === 0) {
      message.error('Vui lòng chọn ít nhất một thành viên');
      return;
    }
    setChangeClubModalVisible(true);
  };

  // Ẩn modal chuyển CLB
  const hideChangeClubModal = () => {
    setChangeClubModalVisible(false);
    setSelectedClubId('');
  };

  return {
    members,
    selectedMembers,
    changeClubModalVisible,
    selectedClubId,
    form,
    currentClubId,
    fetchMembers,
    getMembersByClub,
    syncMembersFromApprovedRegistrations,
    getClubs,
    getClubName,
    changeClubForMembers,
    saveClubChangeHistory,
    showChangeClubModal,
    hideChangeClubModal,
    setSelectedMembers,
    setSelectedClubId,
    setCurrentClubId,
  };
}; 