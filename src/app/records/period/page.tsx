import type {Metadata} from "next";

import {Client} from './client';

export const metadata: Metadata = {
  title: 'Period Usage - AHU Elec',
  description: 'Period usage info - Showing usage statistics in specific time range.'
}

export default function Page() {
  return <Client/>
}
