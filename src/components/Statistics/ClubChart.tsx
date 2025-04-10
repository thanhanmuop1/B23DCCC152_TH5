import React from 'react';
import { Column } from '@ant-design/plots';
import { useModel } from 'umi';
import { IClubStatistics } from '@/types/club';

const ClubChart: React.FC = () => {
  const { clubStatistics } = useModel('club');

  const config = {
    data: clubStatistics,
    xField: 'clubName',
    yField: 'value',
    seriesField: 'type',
    isGroup: true,
    columnStyle: {
      radius: [4, 4, 0, 0],
    },
    legend: {
      position: 'top',
    },
    xAxis: {
      label: {
        autoRotate: false,
      },
    },
    yAxis: {
      title: {
        text: 'Số lượng đơn đăng ký',
      },
    },
    tooltip: {
      shared: true,
      showMarkers: false,
    },
  };

  // Transform data for chart
  const chartData = clubStatistics.flatMap((stat: IClubStatistics) => [
    { clubName: stat.clubName, type: 'Chờ duyệt', value: stat.pending },
    { clubName: stat.clubName, type: 'Đã duyệt', value: stat.approved },
    { clubName: stat.clubName, type: 'Từ chối', value: stat.rejected },
  ]);

  return <Column {...config} data={chartData} />;
};

export default ClubChart; 