'use client';

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

  const isDarkMode: boolean = window.matchMedia("(prefers-color-scheme:dark)").matches;

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
    )}>
      <ConfigProvider
        theme={isDarkMode ? {
          "token": {
            "colorPrimary": "#0ea5e9",
            "colorInfo": "#0ea5e9",
            "colorBgBase": "#1e293b"
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
