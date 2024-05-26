import {useEffect} from "react";
import toast from 'react-hot-toast';

import {classNames} from "@/tools/css_tools";

import {FlexDiv, Container, Center} from '@/components/container';
import {Header, HeaderTitle} from '@/components/header';
import {setDefault} from "@/tools/set_default";

interface BalanceInfoBlockProps {
  /**
   * What type of balance this block shows
   */
  balanceType: 'light' | 'ac';
}

/**
 * A little info card block showing balance of the account.
 */
export function BalanceInfoBlock(props: BalanceInfoBlockProps) {
  let {
    balanceType,
  } = props;

  balanceType = setDefault(balanceType, 'light');


  return (
    <FlexDiv
      expand
      className={classNames(
        'flex-col',
        'p-2',
        balanceType == 'light' ? 'bg-green' : 'bg-blue',
        'text-white',
      )}>
    </FlexDiv>
  );
}