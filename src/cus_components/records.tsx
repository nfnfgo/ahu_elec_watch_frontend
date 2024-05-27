'use client';

import {classNames} from "@/tools/css_tools";

import {FlexDiv, Container, Center} from '@/components/container';
import {setDefault} from "@/tools/set_default";

import {Line} from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-dayjs-4';

Chart.register();

import {StatisticIn, useGetRecentRecords} from '@/api/info';
import {useEffect, useRef} from "react";
import dayjs from "dayjs";


interface RecordsLineChartProps {
  days: number;
  chartId: string;
}

export function RecordsLineChart(props: RecordsLineChartProps) {
  let {
    data: recordData,
    isLoading,
    error,
  } = useGetRecentRecords(1);

  const finalChartId = `record_chart_${props.chartId ?? 'default'}`;
  let canvasRef = useRef();

  return (
    <Line
      className={classNames(
        'flex-auto h-full bg-fgcolor dark:bg-fgcolor-dark p-4',
        'rounded-2xl',
      )}
      ref={canvasRef}
      options={{
        backgroundColor:'transparent',
        scales: {
          x: {
            ticks: {},
            type: 'time',
            time: {
              minUnit: 'hour',
              displayFormats: {},
            }
          }
        },
        plugins: {
          tooltip: {
            intersect: false,
          }
        },
      }}
      data={{
        datasets: [
          {
            label: 'Illumination Usage',
            data: recordData?.map((d) => (d.light_balance)) ?? [],
            borderColor: 'rgba(10,186,0,0.54)',
            backgroundColor: 'green',
          },
          {
            label: 'Air Conditioner Usage',
            data: recordData?.map((d) => (d.ac_balance)) ?? [],
            borderColor: 'rgba(0,123,172,0.54)',
            backgroundColor: 'blue',
          }
        ],
        labels: recordData?.map((d) => (d.timestamp * 1000)) ?? []
      }}/>
  );
}