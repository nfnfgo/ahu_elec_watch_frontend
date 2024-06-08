'use client';

import {useEffect, useState} from "react";

import {ConfigProvider, theme} from 'antd';

import {FlexDiv} from '@/components/container';
import {classNames} from "@/tools/css_tools";
import {setDefault} from "@/tools/set_default";


interface AdaptiveBackgroundProps {
  /**
   * If this background is used as the root div and will be fullScreen?
   */
  fullScreen?: boolean;
  children?: React.ReactNode;
}

/**
 * An adaptive background component could change based on current dark mode.
 *
 * Also, this component will deal with the AntDesign package theme settings to make it concur
 * with user settings.
 */
export function AdaptiveBackground(props: AdaptiveBackgroundProps) {

  const [curDarkMode, setCurDarkMode] = useState(false);

  function colorSchemaChangeHandler(e: Event) {
    setCurDarkMode((e as any).matches);
  }

  /**
   * Serverside-safe get dark mode.
   */
  function getDarkMode() {
    if (typeof window !== 'undefined') {
      return window.matchMedia("(prefers-color-scheme:dark)").matches;
    }
    return false;
  }

  useEffect(() => {
    setCurDarkMode(getDarkMode());
    if (typeof window !== 'undefined') {
      window.matchMedia("(prefers-color-scheme:dark)").addEventListener('change', colorSchemaChangeHandler);
      return window.matchMedia("(prefers-color-scheme:dark)").removeEventListener('change', colorSchemaChangeHandler);
    }
  }, []);

  let {
    fullScreen,
  } = props;
  fullScreen = setDefault(fullScreen, true)

  return (
    <FlexDiv className={classNames(
      'flex-none',
      fullScreen ? 'h-screen w-screen' : 'h-full w-full',
      'bg-bgcolor dark:bg-bgcolor-dark',
      'flex-col justify-start items-center',
      'dark:[color-scheme:dark]',
      'text-sm',
    )}>
      <ConfigProvider
        theme={(curDarkMode) ? {
          "token": {
            "colorPrimary": "#0a79aa",
            "colorInfo": "#0a79aa",
            "colorBgBase": "#0c0f18",
          },
          algorithm: theme.darkAlgorithm
        } : {
          algorithm: theme.defaultAlgorithm,
        }}>
        {props.children}
      </ConfigProvider>
    </FlexDiv>
  );
}
