import {classNames} from '@/tools/css_tools';

interface TitleProps {
  children: React.ReactNode;
}

/**
 * Components used to show a info title on page.
 */
export function Title(
  {
    children
  }: TitleProps) {
  return (
    <>
      <p className={classNames(
        'font-bold text-lg mt-2',
        'md:text-xl md:mt-4',
      )}>{children}</p>
    </>
  );
}