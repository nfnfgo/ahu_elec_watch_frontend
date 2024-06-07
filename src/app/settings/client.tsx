'use client';

import React, {ReactNode, useEffect, useState} from "react";
import toast from 'react-hot-toast';
import {Segmented, Tooltip, Input, Button, SegmentedProps, Switch} from 'antd';
import Link from 'next/link';

import {classNames} from "@/tools/css_tools";
import {backendBaseUrl} from '@/config/general';

import {FlexDiv, Container, Center} from '@/components/container';
import {Header, HeaderTitle} from '@/components/header';
import {BalanceInfoBlock, StatisticBlock,} from '@/cus_components/balance';
import {RecordsLineChart, PeriodUsageList} from '@/cus_components/records';

import {useGetBalance, PeriodUnit} from '@/api/info';

import {Title} from '@/components/title';

import {
  useSettingsStore,
  Settings,
} from '@/states/settings';
import {
  ChartItemCountSegmented,
  ChartTimeRangeSegmented,
  DataTypeSegmented,
  DiagramDaysRangeSegmented
} from "@/cus_components/selections";


export function Client() {
  const settings = useSettingsStore((state) => (state.settings));

  const
    updateKey = useSettingsStore((state) => (state.updateKey));

  const
    resetSettings = useSettingsStore((state) => (state.reset));

  const exportToClipboard = useSettingsStore(state => state.exportToClipboard);
  const importFromClipboard = useSettingsStore(state => state.importFromClipboard);

  const [curNewSettingsStr, setCurNewSettingsStr] = useState<string>('');
  return (
    // Root Div
    <FlexDiv expand className={classNames(
      'flex-none flex-col justify-start items-center',
    )}>

      {/*Header Part*/}
      <Header link='/elec_watch'><HeaderTitle>Settings - AHU Elec Watch</HeaderTitle></Header>

      {/*Content Root Div*/}
      <FlexDiv
        expand
        className={classNames(
          'flex-col justify-start items-center',
          'overflow-y-auto',
        )}>
        {/*Data Showing Part*/}
        <FlexDiv className={classNames(
          'flex-col flex-none gap-y-2 max-w-[50rem] w-full p-2 items-center'
        )}>
          <Title>Date Showing</Title>

          {/*Diagram Days Default*/}
          <SettingsTile title={'Default Line Chart Days Range'}>
            <DiagramDaysRangeSegmented
              value={settings.diagramDays}
              onChange={function (newValue) {
                updateKey('diagramDays', newValue);
              }}/>
          </SettingsTile>

          {/*Diagram Days Default*/}
          <SettingsTile title={'Default Diagrams Data Type'}>
            <DataTypeSegmented
              value={settings.diagramType}
              onChange={updateKey.bind(undefined, 'diagramType')}/>
          </SettingsTile>

          {/*Chart Time Range*/}
          <SettingsTile title={'Default Chart Period'}>
            <ChartTimeRangeSegmented
              value={settings.chartTimeRange}
              onChange={updateKey.bind(undefined, 'chartTimeRange')}/>
          </SettingsTile>

          {/*Chart Time Range*/}
          <SettingsTile title={'Default Chart Items'}>
            <ChartItemCountSegmented
              value={settings.chartItemsCount}
              onChange={updateKey.bind(undefined, 'chartItemsCount')}/>
          </SettingsTile>
        </FlexDiv>

        {/*Usage List Converting Part*/}
        <FlexDiv className={classNames(
          'flex-col flex-none gap-y-2 max-w-[50rem] w-full p-2 items-center',
        )}>
          <Title>Usage List Converting</Title>

          <SettingsTile title='Points Spreading' colWhenSmall={false}>
            <Switch checked={settings.usageSpreading} onChange={updateKey.bind(undefined, 'usageSpreading')}></Switch>
          </SettingsTile>

          <SettingsTile title='Points Smoothing' colWhenSmall={false}>
            <Switch checked={settings.usageSmoothing} onChange={updateKey.bind(undefined, 'usageSmoothing')}></Switch>
          </SettingsTile>

          <SettingsTile title='Points Smart Merge' colWhenSmall={false}>
            <Switch checked={settings.usageSmartMerge} onChange={updateKey.bind(undefined, 'usageSmartMerge')}></Switch>
          </SettingsTile>

          <SettingsTile title='Usage/Hour as Unit' colWhenSmall={false}>
            <Switch checked={settings.usagePreHourUnit} disabled
                    onChange={updateKey.bind(undefined, 'usagePreHourUnit')}></Switch>
          </SettingsTile>
        </FlexDiv>

        {/*Backup Import/Export Reset All Settings Part*/}
        <FlexDiv className={classNames(
          'flex-col flex-none gap-y-2 max-w-[50rem] w-full p-2 items-center'
        )}>
          <Title>Import/Export & Reset All</Title>
          <Button className='w-full' type='primary' onClick={exportToClipboard}>Copy Settings JSON to Clipboard</Button>
          <Button className='w-full' onClick={importFromClipboard}>Import Settings From Clipboard</Button>
          <Button className='w-full' danger onClick={resetSettings}>Reset All Settings</Button>
        </FlexDiv>

        {/*Settings Json Data Part*/}
        <Title>Settings JSON</Title>
        <pre className='whitespace-pre-wrap'>{JSON.stringify(settings, undefined, '  ')}</pre>
        <Button>Copy Settings in JSON</Button>
      </FlexDiv>
    </FlexDiv>
  );
}

interface SegmentedSettingsTileProps<T extends keyof Settings> {
  settingsName: T;
  title: string;
  children: ReactNode;
}

interface SettingsTileProps {
  title: string;
  colWhenSmall?: boolean;
  children: ReactNode;
}

function SettingsTile(props: SettingsTileProps) {
  let colWhenSmall = props.colWhenSmall;
  colWhenSmall ??= true;
  return (
    <FlexDiv className={classNames(
      'flex-none w-full gap-2 p-2',
      colWhenSmall ? 'flex-col sm:flex-row' : 'flex-row',
      'justify-between items-center',
      'bg-fgcolor dark:bg-fgcolor-dark rounded-xl',
    )}>
      {props.title}
      {props.children}
    </FlexDiv>
  );
}


// function SegmentedSettingsTile<T extends keyof Settings>(props: SegmentedSettingsTileProps<T>) {
//   const value =
//     useSettingsStore((state) => (state.settings[props.settingsName]));
//
//   const _updateKey = useSettingsStore((state) => (state.updateKey));
//
//   function updateKeyValue(value: Settings[T]) {
//     _updateKey(props.settingsName, value);
//   }
//
//   return (
//     <FlexDiv className={classNames(
//       'p-2 justify-between gap-2',
//     )}>
//       {props.title}
//       {props.children}
//     </FlexDiv>
//   );
// }