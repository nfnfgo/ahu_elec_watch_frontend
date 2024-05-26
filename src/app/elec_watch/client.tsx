'use client';

import {useEffect} from "react";
import toast from 'react-hot-toast';

import {classNames} from "@/tools/css_tools";

import {FlexDiv, Container, Center} from '@/components/container';
import {Header, HeaderTitle} from '@/components/header';


export function Client() {

  // Debug, test if toaster works well
  useEffect(
    function () {
      toast.success('Toaster Loaded Successfully');
    },
    []
  );

  return (
    <FlexDiv
      expand
      className={classNames(
        'flex-col flex-none'
      )}>
      {/*Header Part*/}
      <Header link='/elec_watch_test'>
        <HeaderTitle>AHU Electrical Usage Monitor</HeaderTitle>
      </Header>

      <Center>
        Electrical Watch Page
      </Center>
    </FlexDiv>
  );
}