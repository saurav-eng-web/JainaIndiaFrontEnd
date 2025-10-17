import { redirect } from 'next/navigation';


const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

console.log("🟡base url: ",BASE_URL)

export default function Home() {
  redirect('/login');
}