import {classNames} from "@/tools/css_tools";

import {FlexDiv, Container, Center} from '@/components/container';
import {setDefault} from "@/tools/set_default";

import {StatisticIn, useGetStatistics} from '@/api/info';

interface BalanceInfoBlockProps {
  /**
   * What type of balance this block shows
   */
  balanceType: 'light' | 'ac';
  /**
   * Is the data still loading. If `true` then `value` could be undefined.
   */
  isLoading?: boolean;
  /**
   * The value of the balance.
   */
  value?: number;
}

/**
 * A little info card block showing balance of the account.
 */
export function BalanceInfoBlock(props: BalanceInfoBlockProps) {
  let {
    balanceType,
    isLoading,
    value,
  } = props;

  isLoading ??= false;

  balanceType = setDefault(balanceType, 'light');
  let smBalanceTitle = balanceType == 'light' ? 'ILLUMI' : 'AIR COND';
  let lgBalanceTitle = balanceType == 'light' ? 'ILLUMINATION' : 'AIR CONDITIONER';


  return (
    // Root Container
    <FlexDiv
      expand
      className={classNames(
        'flex-col flex-auto justify-between',
        'p-2 rounded-2xl',
        (balanceType == 'light') ? 'bg-green' : 'bg-blue',
        'text-white',
        isLoading ? 'opacity-50' : '',
      )}>

      {/*Title Part*/}
      <p className={classNames(
        'text-white/50 sm:hidden'
      )}>
        {smBalanceTitle}
      </p>

      {/*Title Part*/}
      <FlexDiv className='hidden sm:flex'>
        <p className={classNames(
          'text-white/50 '
        )}>
          {lgBalanceTitle}
          <br/>
          BALANCE
        </p>
      </FlexDiv>

      {/*Value Part*/}
      <FlexDiv
        className={classNames(
          'flex-none',
          'flex-row sm:flex-col',
          'justify-start items-start'
        )}>
        <p className={classNames(
          'text-2xl sm:text-3xl',
          'font-bold text-white',
        )}>
          {isLoading ? '- -' : value}
        </p>
        <p className={classNames(
          'mx-1 text-white/70 font-bold',
          'text-lg sm:text-xl',
        )}>kW</p>
      </FlexDiv>
    </FlexDiv>
  );
}


// interface StatisticBlockProps {
//   info: StatisticIn;
// }

export function StatisticBlock() {
  let {
    data,
    isLoading,
    error,
  } = useGetStatistics();

  return (
    <FlexDiv
      className={classNames(
        'bg-fgcolor dark:bg-fgcolor-dark rounded-2xl px-4 py-4',
        'flex-col gap-y-2 justify-start w-full',
        isLoading ? 'opacity-50' : '')}>
      <StatisticBlockItem type='light' title='Last Day' value={data?.light_total_last_day}/>
      <StatisticBlockItem type='light' title='Last Week' value={data?.light_total_last_week}/>
      <StatisticBlockItem type='ac' title='Last Day' value={data?.ac_total_last_day}/>
      <StatisticBlockItem type='ac' title='Last Week' value={data?.ac_total_last_week}/>
    </FlexDiv>
  );
}

interface StatisticBlockItemProps {
  type: 'light' | 'ac',
  title: string;
  value?: number;
}

function StatisticBlockItem(props: StatisticBlockItemProps) {
  return (
    <FlexDiv className={classNames(
      'flex-row justify-between items-center bg-primary/10',
      'rounded-md border-b-1 border-black/10 dark:border-white/10',
      'px-2',
      props.type == 'light' ? 'bg-green/10' : 'bg-blue/10',
      props.type == 'light' ? 'text-green dark:text-green-light' : 'text-blue dark:text-blue-light',
    )}>
      <p>{props.title}</p>
      <FlexDiv>

        <p className={classNames(
          'font-mono font-bold',
        )}>{props.value ?? '--'}</p>

        <p className={classNames(
          'font-mono ml-1',
        )}>kW</p>
      </FlexDiv>
    </FlexDiv>
  );
}