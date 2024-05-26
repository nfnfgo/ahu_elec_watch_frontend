import type {Metadata} from "next";

import {Client} from './client';

export const metadata: Metadata = {
  title: 'AHU Electric Monitor',
  description: 'Monitor the electrical balance usage of AHU dormitory.'
}

export default function Page() {
  return <Client/>
}
