import { useState } from 'react';
import { message, Form } from 'antd';
import { IClub } from '@/types/club';
import moment from 'moment';

export default () => {
  const [clubs, setClubs] = useState<IClub[]>([]);
  const [formVisible, setFormVisible] = useState<boolean>(false);
  const [currentClub, setCurrentClub] = useState<IClub | null>(null);
  const [form] = Form.useForm();

  // Fetch clubs from localStorage
  const fetchClubs = () => {
    const storedClubs = localStorage.getItem('clubs');
    if (storedClubs) {
      setClubs(JSON.parse(storedClubs));
    }
  };

  // Save club (create/update)
  const saveClub = (club: IClub) => {
    let updatedClubs: IClub[];
    if (currentClub) {
      updatedClubs = clubs.map(c => 
        c.id === club.id ? { ...club, updatedAt: new Date().toISOString() } : c
      );
      message.success('Cập nhật câu lạc bộ thành công');
    } else {
      const newClub = {
        ...club,
        id: `club-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      updatedClubs = [...clubs, newClub];
      message.success('Thêm mới câu lạc bộ thành công');
    }
    localStorage.setItem('clubs', JSON.stringify(updatedClubs));
    setClubs(updatedClubs);
    setFormVisible(false);
    setCurrentClub(null);
  };

  // Delete club
  const deleteClub = (id: string) => {
    const updatedClubs = clubs.filter(club => club.id !== id);
    localStorage.setItem('clubs', JSON.stringify(updatedClubs));
    setClubs(updatedClubs);
    message.success('Xóa câu lạc bộ thành công');
  };

  // Show form for create/edit
  const showForm = (club: IClub | null = null) => {
    setCurrentClub(club);
    setFormVisible(true);
  };

  // Hide form
  const hideForm = () => {
    setFormVisible(false);
    setCurrentClub(null);
  };

  // Form handling
  const initForm = (club: IClub | null) => {
    if (club) {
      form.setFieldsValue({
        ...club,
        foundedDate: moment(club.foundedDate),
      });
    } else {
      form.resetFields();
    }
  };

  const handleImageValidation = (file: File) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('Chỉ cho phép upload file ảnh!');
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Ảnh phải nhỏ hơn 2MB!');
      return false;
    }
    return true;
  };

  const handleImageUpload = (file: File) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        form.setFieldsValue({ avatar: e.target?.result });
        resolve(e.target?.result);
      };
      reader.readAsDataURL(file);
    });
  };

  const submitForm = () => {
    form.submit();
  };

  const handleFormSubmit = (values: any) => {
    const formData = {
      ...values,
      id: currentClub?.id || '',
      foundedDate: values.foundedDate.toISOString(),
    };
    saveClub(formData);
  };

  return {
    clubs,
    formVisible,
    currentClub,
    form,
    fetchClubs,
    saveClub,
    deleteClub,
    showForm,
    hideForm,
    initForm,
    handleImageValidation,
    handleImageUpload,
    submitForm,
    handleFormSubmit,
  };
}; 