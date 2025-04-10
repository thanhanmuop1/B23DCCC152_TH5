import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { useModel } from 'umi';
import { IStatistics } from '@/types/club';

const Overview: React.FC = () => {
  const { statistics } = useModel('club');

  return (
    <Row gutter={16}>
      <Col span={6}>
        <Card>
          <Statistic
            title="Tổng số câu lạc bộ"
            value={statistics.totalClubs}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="Đơn chờ duyệt"
            value={statistics.pendingMembers}
            valueStyle={{ color: '#faad14' }}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="Đơn đã duyệt"
            value={statistics.approvedMembers}
            valueStyle={{ color: '#52c41a' }}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="Đơn bị từ chối"
            value={statistics.rejectedMembers}
            valueStyle={{ color: '#ff4d4f' }}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default Overview; 