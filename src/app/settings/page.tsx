import type {Metadata} from "next";

import {Client} from './client';

export const metadata: Metadata = {
  title: 'Settings - AHU Electric Monitor',
  description: 'Application Settings - AHU Electric Monitor',
}

export default function Page() {

  return <Client/>
}
