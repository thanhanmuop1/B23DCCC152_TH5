import { useState } from 'react';
import { message, Form } from 'antd';
import { IRegistration, IRegistrationHistory } from '@/types/registration';
import { IClub } from '@/types/club';

export default () => {
  const [registrations, setRegistrations] = useState<IRegistration[]>([]);
  const [formVisible, setFormVisible] = useState<boolean>(false);
  const [currentRegistration, setCurrentRegistration] = useState<IRegistration | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [detailVisible, setDetailVisible] = useState<boolean>(false);
  const [historyVisible, setHistoryVisible] = useState<boolean>(false);
  const [currentHistory, setCurrentHistory] = useState<IRegistrationHistory[]>([]);
  const [rejectModalVisible, setRejectModalVisible] = useState<boolean>(false);
  const [rejectMultipleModalVisible, setRejectMultipleModalVisible] = useState<boolean>(false);
  const [rejectReason, setRejectReason] = useState<string>('');
  const [form] = Form.useForm();

  // Lấy danh sách đơn đăng ký từ localStorage
  const fetchRegistrations = () => {
    const storedRegistrations = localStorage.getItem('registrations');
    if (storedRegistrations) {
      setRegistrations(JSON.parse(storedRegistrations));
    }
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

  // Lưu đơn đăng ký (thêm mới/cập nhật)
  const saveRegistration = (registration: IRegistration) => {
    let updatedRegistrations: IRegistration[];
    let actionType: 'created' | 'updated' = 'created';
    
    if (currentRegistration) {
      updatedRegistrations = registrations.map(r => 
        r.id === registration.id ? { ...registration, updatedAt: new Date().toISOString() } : r
      );
      actionType = 'updated';
      message.success('Cập nhật đơn đăng ký thành công');
    } else {
      const newRegistration = {
        ...registration,
        id: `reg-${Date.now()}`,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      updatedRegistrations = [...registrations, newRegistration];
      registration = newRegistration;
      message.success('Thêm mới đơn đăng ký thành công');
    }
    
    localStorage.setItem('registrations', JSON.stringify(updatedRegistrations));
    setRegistrations(updatedRegistrations);
    setFormVisible(false);
    setCurrentRegistration(null);
    
    // Lưu lịch sử thao tác
    saveHistory(registration.id, actionType);
  };

  // Xóa đơn đăng ký
  const deleteRegistration = (id: string) => {
    const updatedRegistrations = registrations.filter(registration => registration.id !== id);
    localStorage.setItem('registrations', JSON.stringify(updatedRegistrations));
    setRegistrations(updatedRegistrations);
    message.success('Xóa đơn đăng ký thành công');
  };

  // Duyệt đơn đăng ký
  const approveRegistration = (id: string) => {
    const updatedRegistrations = registrations.map(registration => 
      registration.id === id 
        ? { ...registration, status: 'approved', updatedAt: new Date().toISOString() } 
        : registration
    );
    
    localStorage.setItem('registrations', JSON.stringify(updatedRegistrations));
    setRegistrations(updatedRegistrations);
    message.success('Duyệt đơn đăng ký thành công');
    
    // Lưu lịch sử thao tác
    saveHistory(id, 'approved');
  };

  // Từ chối đơn đăng ký
  const rejectRegistration = (id: string, reason: string) => {
    if (!reason.trim()) {
      message.error('Vui lòng nhập lý do từ chối');
      return;
    }
    
    const updatedRegistrations = registrations.map(registration => 
      registration.id === id 
        ? { 
            ...registration, 
            status: 'rejected', 
            rejectReason: reason,
            updatedAt: new Date().toISOString() 
          } 
        : registration
    );
    
    localStorage.setItem('registrations', JSON.stringify(updatedRegistrations));
    setRegistrations(updatedRegistrations);
    setRejectModalVisible(false);
    setRejectReason('');
    message.success('Từ chối đơn đăng ký thành công');
    
    // Lưu lịch sử thao tác
    saveHistory(id, 'rejected', reason);
  };

  // Duyệt nhiều đơn đăng ký
  const approveMultipleRegistrations = () => {
    if (selectedRowKeys.length === 0) {
      message.error('Vui lòng chọn ít nhất một đơn đăng ký');
      return;
    }
    
    const updatedRegistrations = registrations.map(registration => 
      selectedRowKeys.includes(registration.id)
        ? { ...registration, status: 'approved', updatedAt: new Date().toISOString() } 
        : registration
    );
    
    localStorage.setItem('registrations', JSON.stringify(updatedRegistrations));
    setRegistrations(updatedRegistrations);
    
    // Lưu lịch sử thao tác cho từng đơn
    selectedRowKeys.forEach(id => {
      saveHistory(id as string, 'approved');
    });
    
    setSelectedRowKeys([]);
    message.success(`Đã duyệt ${selectedRowKeys.length} đơn đăng ký thành công`);
  };

  // Từ chối nhiều đơn đăng ký
  const rejectMultipleRegistrations = (reason: string) => {
    if (selectedRowKeys.length === 0) {
      message.error('Vui lòng chọn ít nhất một đơn đăng ký');
      return;
    }
    
    if (!reason.trim()) {
      message.error('Vui lòng nhập lý do từ chối');
      return;
    }
    
    const updatedRegistrations = registrations.map(registration => 
      selectedRowKeys.includes(registration.id)
        ? { 
            ...registration, 
            status: 'rejected', 
            rejectReason: reason,
            updatedAt: new Date().toISOString() 
          } 
        : registration
    );
    
    localStorage.setItem('registrations', JSON.stringify(updatedRegistrations));
    setRegistrations(updatedRegistrations);
    
    // Lưu lịch sử thao tác cho từng đơn
    selectedRowKeys.forEach(id => {
      saveHistory(id as string, 'rejected', reason);
    });
    
    setSelectedRowKeys([]);
    setRejectMultipleModalVisible(false);
    setRejectReason('');
    message.success(`Đã từ chối ${selectedRowKeys.length} đơn đăng ký thành công`);
  };

  // Lưu lịch sử thao tác
  const saveHistory = (registrationId: string, action: 'created' | 'approved' | 'rejected' | 'updated', reason?: string) => {
    const historyEntry: IRegistrationHistory = {
      id: `hist-${Date.now()}`,
      registrationId,
      action,
      adminName: 'Admin', // Thay thế bằng tên người dùng thật khi có hệ thống đăng nhập
      reason,
      timestamp: new Date().toISOString(),
    };
    
    const storedHistory = localStorage.getItem('registrationHistory');
    let history: IRegistrationHistory[] = [];
    
    if (storedHistory) {
      history = JSON.parse(storedHistory);
    }
    
    history.push(historyEntry);
    localStorage.setItem('registrationHistory', JSON.stringify(history));
  };

  // Lấy lịch sử thao tác của một đơn đăng ký
  const fetchRegistrationHistory = (registrationId: string) => {
    const storedHistory = localStorage.getItem('registrationHistory');
    if (storedHistory) {
      const history = JSON.parse(storedHistory);
      const filteredHistory = history.filter((h: IRegistrationHistory) => h.registrationId === registrationId);
      setCurrentHistory(filteredHistory);
    } else {
      setCurrentHistory([]);
    }
    setHistoryVisible(true);
  };

  // Hiển thị form thêm mới/chỉnh sửa
  const showForm = (registration: IRegistration | null = null) => {
    setCurrentRegistration(registration);
    setFormVisible(true);
  };

  // Ẩn form
  const hideForm = () => {
    setFormVisible(false);
    setCurrentRegistration(null);
  };

  // Hiển thị modal xem chi tiết
  const showDetail = (registration: IRegistration) => {
    setCurrentRegistration(registration);
    setDetailVisible(true);
  };

  // Ẩn modal xem chi tiết
  const hideDetail = () => {
    setDetailVisible(false);
    setCurrentRegistration(null);
  };

  // Hiển thị modal từ chối
  const showRejectModal = (registration: IRegistration) => {
    setCurrentRegistration(registration);
    setRejectModalVisible(true);
  };

  // Ẩn modal từ chối
  const hideRejectModal = () => {
    setRejectModalVisible(false);
    setCurrentRegistration(null);
    setRejectReason('');
  };

  // Hiển thị modal từ chối nhiều đơn
  const showRejectMultipleModal = () => {
    if (selectedRowKeys.length === 0) {
      message.error('Vui lòng chọn ít nhất một đơn đăng ký');
      return;
    }
    setRejectMultipleModalVisible(true);
  };

  // Ẩn modal từ chối nhiều đơn
  const hideRejectMultipleModal = () => {
    setRejectMultipleModalVisible(false);
    setRejectReason('');
  };

  // Ẩn modal lịch sử
  const hideHistory = () => {
    setHistoryVisible(false);
    setCurrentHistory([]);
  };

  // Khởi tạo form
  const initForm = (registration: IRegistration | null) => {
    if (registration) {
      form.setFieldsValue({
        ...registration,
      });
    } else {
      form.resetFields();
    }
  };

  // Submit form
  const submitForm = () => {
    form.submit();
  };

  // Xử lý submit form
  const handleFormSubmit = (values: any) => {
    if (currentRegistration) {
      // Cập nhật
      const formData = {
        ...values,
        id: currentRegistration.id,
      };
      saveRegistration(formData);
    } else {
      // Thêm mới
      const formData = {
        ...values,
        id: '',
      };
      saveRegistration(formData);
    }
  };

  return {
    registrations,
    formVisible,
    currentRegistration,
    selectedRowKeys,
    detailVisible,
    historyVisible,
    currentHistory,
    rejectModalVisible,
    rejectMultipleModalVisible,
    rejectReason,
    form,
    fetchRegistrations,
    getClubs,
    getClubName,
    saveRegistration,
    deleteRegistration,
    approveRegistration,
    rejectRegistration,
    approveMultipleRegistrations,
    rejectMultipleRegistrations,
    saveHistory,
    fetchRegistrationHistory,
    showForm,
    hideForm,
    showDetail,
    hideDetail,
    showRejectModal,
    hideRejectModal,
    showRejectMultipleModal,
    hideRejectMultipleModal,
    hideHistory,
    initForm,
    submitForm,
    handleFormSubmit,
    setSelectedRowKeys,
    setRejectReason,
  };
}; 