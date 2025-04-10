import React from 'react';
import { Button } from 'antd';
import { useModel } from 'umi';
import * as XLSX from 'xlsx';
import { IMember, IClub } from '@/types/club';

const ExportMembers: React.FC = () => {
  const { members, clubs } = useModel('club');

  const handleExport = () => {
    const approvedMembers = members.filter((m: IMember) => m.status === 'approved');
    
    // Group members by club
    const membersByClub = clubs.reduce((acc: any, club: IClub) => {
      const clubMembers = approvedMembers.filter((m: IMember) => m.clubId === club.id);
      if (clubMembers.length > 0) {
        acc[club.name] = clubMembers.map((m: IMember, index: number) => ({
          STT: index + 1,
          'Họ tên': m.name,
          'Email': m.email,
          'SĐT': m.phone,
          'CLB': club.name,
          'Giới tính': m.gender === 'male' ? 'Nam' : m.gender === 'female' ? 'Nữ' : 'Khác',
          'Địa chỉ': m.address,
          'Sở trường': m.skills.join(', '),
        }));
      }
      return acc;
    }, {});

    // Create workbook
    const wb = XLSX.utils.book_new();

    // Add each club's members to a separate sheet
    Object.entries(membersByClub).forEach(([clubName, data]: [string, any]) => {
      const ws = XLSX.utils.json_to_sheet(data);
      XLSX.utils.book_append_sheet(wb, ws, clubName);
    });

    // Save file
    XLSX.writeFile(wb, 'danh_sach_thanh_vien.xlsx');
  };

  return (
    <Button type="primary" onClick={handleExport}>
      Xuất danh sách thành viên
    </Button>
  );
};

export default ExportMembers; 