import React, { useEffect } from 'react';
import { Card, Space } from 'antd';
import { useModel } from 'umi';
import Overview from '@/components/Statistics/Overview';
import ClubChart from '@/components/Statistics/ClubChart';
import ExportMembers from '@/components/Statistics/ExportMembers';

const StatisticsPage: React.FC = () => {
  const { calculateStatistics } = useModel('statistics');

  useEffect(() => {
    calculateStatistics();
  }, []);

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Card title="Thống kê tổng quan">
        <Overview />
      </Card>

      <Card 
        title="Biểu đồ thống kê đơn đăng ký theo câu lạc bộ"
        extra={<ExportMembers />}
      >
        <ClubChart />
      </Card>
    </Space>
  );
};

export default StatisticsPage; 