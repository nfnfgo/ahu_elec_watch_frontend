import {redirect} from "next/navigation";

import type {Metadata} from "next";

export const metadata: Metadata = {
  title: 'AHU Electric Monitor',
  description: 'Monitor the electrical balance usage of AHU dormitory.'
}

export default function Home() {
  redirect('/elec_watch');
}