'use client';

import dayjs from "dayjs";
import {classNames} from "@/tools/css_tools";
import {useEffect, useRef, useState} from "react";
import Link from "next/link";

import {Line} from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-dayjs-4';
import toast from 'react-hot-toast';

Chart.register();

import {Button, Table, Tooltip, Popconfirm,} from 'antd';
import {DeleteTwoTone} from '@ant-design/icons';

const {Column, ColumnGroup} = Table;

import {setDefault} from "@/tools/set_default";
import {FlexDiv, Container, Center} from '@/components/container';
import {
    StatisticIn, useGetRecentRecords, BalanceRecordIn,
    PeriodUsageInfoIn, useGetPeriodUsage,
    PeriodUnit,
    deleteRecordsWithToastNotification,
} from '@/api/info';
import {errorPopper} from '@/exceptions/error';


interface RecentUsageLineChartProps {
    /**
     * The days range of the info this graph will show. At least one day.
     */
    days: number;
    /**
     * Info type of this graph.
     */
    graphType?: 'balance' | 'usage';
}

export function RecentUsageLineChart(props: RecentUsageLineChartProps) {
    const {
        data: recordData,
        isLoading,
        error,
    } = useGetRecentRecords(props.days, props.graphType ?? 'balance');

    if (error) {
        errorPopper(error);
    }

    let canvasRef = useRef();

    return (
        <RecordsLineChart
            data={recordData}
            noDataWarningElem={
                <>
                    <p>No record found for this period.</p>
                    <p>Try using a larger time range and check again.</p>
                </>
            }
        />
    );
}

export interface RecordsLineChartProps {
    /**
     * List of BalanceRecordIn info.
     */
    data?: BalanceRecordIn[];
    /**
     * An object which could be a ReactNode, usually be a text block.
     * Shown when the input list is empty or do not contain
     * any info.
     */
    noDataWarningElem?: React.ReactNode;
}

export function RecordsLineChart(props: RecordsLineChartProps) {
    let {
        data,
        noDataWarningElem,
    } = props;
    noDataWarningElem ??= (
        <>
            <p>No valid records info found.</p>
        </>
    );

    let canvasRef = useRef();

    return (
        // Root Div Part
        <FlexDiv
            className={classNames(
                'relative flex-none w-full',
            )}>

            {/*No Data Dialog Part*/}
            {(data?.length ?? 0) < 1 && <FlexDiv className={classNames(
                'absolute w-full h-full'
            )}>
                <Center><FlexDiv className={classNames(
                    'backdrop-blur-[4px] bg-grey/10',
                    'shadow-black/10 shadow-md',
                    'p-2 rounded-md',
                    'flex-col justify-start items-center',
                )}>
                    {noDataWarningElem}
                </FlexDiv></Center>
            </FlexDiv>}

            {/*Line Chart Part*/}
            <Line
                className={classNames(
                    'flex flex-none h-full w-full bg-fgcolor dark:bg-fgcolor-dark p-4',
                    'rounded-2xl',
                )}
                ref={canvasRef}
                options={{
                    responsive: true,
                    maintainAspectRatio: true,
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
                            label: 'Illumination',
                            data: data?.map((d) => (d.light_balance)) ?? [],
                            borderColor: 'rgba(10,186,0,0.54)',
                            backgroundColor: 'green',
                        },
                        {
                            label: 'Air Conditioner',
                            data: data?.map((d) => (d.ac_balance)) ?? [],
                            borderColor: 'rgba(0,123,172,0.54)',
                            backgroundColor: 'blue',
                        }
                    ],
                    labels: data?.map((d) => (d.timestamp * 1000)) ?? []
                }}/>
        </FlexDiv>);
}

/**
 * Function that passed to antd Table component as a column data renderer for start and end timestamp.
 */
function timestampColumnRenderer(timestamp: number) {
    let dayjsIns = dayjs.unix(timestamp);
    return (<p className={classNames(
        'whitespace-nowrap',
    )}>
        {dayjsIns.format('MM/DD')}
    </p>);
}

interface PeriodUsageProps {
    /**
     * The period unit of the info.
     */
    period: PeriodUnit;
    /**
     * Number of periods shows in the table.
     */
    period_count: number;
    /**
     * If `true`, the latest info will at the beginning.
     */
    recent_on_top: boolean;
}

/**
 * Table component used in homepage to show the period usage.
 * @param props
 * @constructor
 */
export function PeriodUsageList(props: PeriodUsageProps) {

    const {
        data,
        isLoading,
        error,
    } = useGetPeriodUsage(props.period, props.period_count, props.recent_on_top);

    if (error) {
        errorPopper(error);
    }

    /**
     * Function that passed to antd Table component as a column data renderer for usage info.
     */
    function usageColumnRendererInner(usage: number, infoType: 'light' | 'ac' = 'light') {
        let days = 1;
        if (props.period == 'week') {
            days = 7;
        }
        if (props.period == 'month') {
            days = 30;
        }

        return (<Tooltip
            title={`${(usage / days).toFixed(2)} kW/day`}
            placement='leftBottom'>
            <p className={classNames(
                'font-mono',
                infoType == 'ac' ? 'text-blue dark:text-blue-light' : '',
                infoType == 'light' ? 'text-green dark:text-green-light' : '',
            )}>{usage.toFixed(2)}</p>
        </Tooltip>);
    }

    // A function generator that could generate the render() method of balance field for antd table.
    function usageColumnRendererGen(infoType: 'light' | 'ac' = 'light') {
        return function (value: number) {
            return usageColumnRendererInner(value, infoType);
        }
    }

    function periodDetailRenderer(value: any, record: PeriodUsageInfoIn) {
        return (
            <Button href={`/records/period?start=${record.start_time}&end=${record.end_time}`}>Detail</Button>
        );
    }

    return (
        <FlexDiv
            className={classNames(
                'flex-none flex-col w-full',
            )}
        >
            <Table
                // style={{
                //   width: '100%'
                // }}
                sticky={true}
                loading={isLoading}
                pagination={false}
                dataSource={data}
                className={classNames(
                    'rounded-xl'
                )}>

                {/*Time Info Columns*/}
                <Column title='From' dataIndex='start_time' key='start_time' render={timestampColumnRenderer}
                        width={80}/>
                <Column title='To' dataIndex='end_time' key='end_time' render={timestampColumnRenderer} width={80}/>

                {/*Usage Columns*/}
                <ColumnGroup title='Usage'>
                    <Column title='Illumination' dataIndex='light_usage' key='light_usage'
                            render={usageColumnRendererGen('light')}/>
                    <Column title='Air Conditioner' dataIndex='ac_usage' key='ac_usage'
                            render={usageColumnRendererGen('ac')}/>
                </ColumnGroup>

                {/*Detailed Info Link Column*/}
                <Column title='Details' align='center' width={100} render={periodDetailRenderer}/>
            </Table>
        </FlexDiv>
    );
}

export interface RecordsListProps {
    data: BalanceRecordIn[];
    isLoading?: boolean;
    showDeleteButton?: boolean;
}

/**
 * Table component used to show a list of balance or usage info.
 */
export function RecordsList(props: RecordsListProps) {

    const [pageSize, setPageSize] = useState(10);

    /**
     * Inner function used by balanceRenderGen()
     */
    function usageColumnRendererInner(usage: number, infoType: 'light' | 'ac' = 'light') {
        return (<p className={classNames(
            'font-mono',
            infoType == 'ac' ? 'text-blue dark:text-blue-light' : '',
            infoType == 'light' ? 'text-green dark:text-green-light' : '',
        )}>{usage.toFixed(2)}</p>);
    }

    function balanceRenderGen(dataType: 'light' | 'ac') {
        return function (value: any) {
            return usageColumnRendererInner(value, dataType);
        }
    }

    /**
     * Function that passed to antd Table component as a column data renderer for start and end timestamp.
     */
    function timeStampRenderer(timestamp: number) {
        let dayjsIns = dayjs.unix(timestamp);
        return (<p className={classNames(
            'whitespace-nowrap',
        )}>
            {dayjsIns.format('MM/DD HH:mm:ss')}
        </p>);
    }

    async function deleteRecordsHandler(timestamp: number) {
        await deleteRecordsWithToastNotification(timestamp, timestamp, false);
    }

    // Renderer for delete button
    function deleteButtonRenderer(timestamp: number) {
        return (
            <>
                <Popconfirm
                    title='Confirm Deletion'
                    description='Do you really want to delete this records?
                    This operation could not be reversed.'
                    okText='Confirm'
                    okButtonProps={{type: 'primary', danger: true}}
                    icon={<DeleteTwoTone twoToneColor='red'/>}
                    cancelText='Cancel'
                    placement='leftBottom'
                    overlayStyle={{
                        paddingLeft: '8rem',
                        maxWidth: '25rem'
                    }}
                    onConfirm={function () {
                        deleteRecordsHandler(timestamp)
                    }}>
                    <Button danger>Delete</Button>
                </Popconfirm>
            </>
        );
    }

    return (
        <Table
            sticky={true}
            loading={props.isLoading}
            pagination={{
                showQuickJumper: true,
                showSizeChanger: true,
                defaultPageSize: 10,
                position: ['bottomCenter'],
            }}
            dataSource={props.data}
            className={classNames(
                'rounded-xl')}>
            <Column title='Time' dataIndex='timestamp' key='timestamp' render={timeStampRenderer}
                    width={120}/>
            <ColumnGroup title='Data'>
                <Column title='Illumination' dataIndex='light_balance' key='light_balance'
                        render={balanceRenderGen('light')}/>
                <Column title='Air Conditioner' dataIndex='ac_balance' key='ac_balance'
                        render={balanceRenderGen('ac')}/>
            </ColumnGroup>

            {/*Delete Record Button Column*/}
            {props.showDeleteButton &&
                <Column
                    title='Delete'
                    align='center'
                    width={100}
                    dataIndex='timestamp'
                    render={deleteButtonRenderer}/>
            }
        </Table>
    );
}