'use client';

import {useEffect, useState} from "react";
import toast from 'react-hot-toast';
import {Segmented, SegmentedProps, Tooltip} from 'antd';
import Link from 'next/link';

import {classNames} from "@/tools/css_tools";
import {backendBaseUrl} from '@/config/general';

import {FlexDiv, Container, Center} from '@/components/container';
import {Header, HeaderTitle} from '@/components/header';
import {BalanceInfoBlock, StatisticBlock,} from '@/cus_components/balance';
import {RecentUsageLineChart, PeriodUsageList} from '@/cus_components/records';

import {useGetBalance, PeriodUnit} from '@/api/info';

import {Title} from '@/components/title';
import Chart from "chart.js/auto";


interface DiagramDaysRangeSegmentedProps {
    value: number;
    size?: SegmentedProps['size'];
    onChange: ((value: number) => void) | undefined;
}

export function DiagramDaysRangeSegmented(props: DiagramDaysRangeSegmentedProps) {
    return (

        <Segmented
            value={props.value}
            size={props.size}
            options={[
                {
                    label: '24 Hours',
                    value: 1,
                },
                {
                    label: '3 Days',
                    value: 3
                },
                {
                    label: 'Weekly',
                    value: 7,
                },
                {
                    label: 'Monthly',
                    value: 30,
                },
            ]}
            onChange={props.onChange}/>


    );
}

interface DataTypeSegmentedProps {
    value: 'balance' | 'usage';
    /**
     * Visual size of the component.
     */
    size?: SegmentedProps['size'];
    onChange: ((value: 'balance' | 'usage') => void) | undefined;
}

export function DataTypeSegmented(props: DataTypeSegmentedProps) {
    return (
        <Segmented
            value={props.value}
            size={props.size}
            options={[{
                label: 'Balance',
                value: 'balance',
            },
                {
                    label: 'Usage',
                    value: 'usage',
                },]}
            onChange={props.onChange}/>
    );
}

interface ChartTimeRangeSegmentedProps {
    value: 'day' | 'week' | 'month';
    size?: SegmentedProps['size'];
    onChange: ((value: 'day' | 'week' | 'month') => void) | undefined;
}


export function ChartTimeRangeSegmented(props: ChartTimeRangeSegmentedProps) {
    return (
        <Segmented
            value={props.value}
            size={props.size}
            options={[
                {
                    label: 'Daily',
                    value: 'day',
                },
                {
                    label: 'Weekly',
                    value: 'week'
                },
                {
                    label: 'Monthly',
                    value: 'month',
                },
            ]}
            onChange={props.onChange}/>
    );
}

interface ChartItemCountSegmentedProps {
    value: number;
    size?: SegmentedProps['size'];
    onChange: ((value: number) => void) | undefined;
}


export function ChartItemCountSegmented(props: ChartItemCountSegmentedProps) {
    return (
        <Segmented
            value={props.value}
            size={props.size}
            options={[7, 14, 30]}
            onChange={props.onChange}/>
    );
}
