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
  /**
   * The days range of the info this graph will show. At least one day.
   */
  days: number;
  /**
   * Info type of this graph.
   */
  graphType?: 'balance' | 'usage';
}

export function RecordsLineChart(props: RecordsLineChartProps) {
  const {
    data: recordData,
    isLoading,
    error,
  } = useGetRecentRecords(props.days, props.graphType ?? 'balance');

  let canvasRef = useRef();

  return (
    <FlexDiv
      className={classNames(
        'flex-none w-full h-[35rem]',
      )}>
      <Line
        className={classNames(
          'flex flex-auto h-full w-full bg-fgcolor dark:bg-fgcolor-dark p-4',
          'rounded-2xl',
        )}
        ref={canvasRef}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          backgroundColor: 'transparent',
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
    </FlexDiv>
  );
}