import axios from "axios";

const SMS_API = process.env.NEXT_PUBLIC_SMS_API;

export default async function sendMessage(id, phoneNo, jobNo) {
  const messages = [``];

  const res = axios.post(`${SMS_API}${phoneNo}$msg=${msg}`);
  console.log(`res:`, res);
}
