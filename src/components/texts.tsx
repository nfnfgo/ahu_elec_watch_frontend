import {FlexDiv, Container} from "@/components/container";
import Link from "next/link";
import {classNames} from "@/tools/css_tools";
import React, {ReactNode} from "react";
import {setDefault} from "@/tools/set_default";

interface NoticeTextProps {
  hasColor?: boolean;
  children: ReactNode;
}

export function NoticeText(props: NoticeTextProps) {
  let hasColor = props.hasColor;
  hasColor = setDefault(hasColor, true);

  return (
    <p className={classNames(
      'text-black/50 dark:text-white/50',
      hasColor ? 'bg-bgcolor/50 dark:bg-bgcolor-dark/50' : '',
      'p-2 rounded-xl',
    )}>
      {props.children}
    </p>
  );
}