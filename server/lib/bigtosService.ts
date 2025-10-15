import axios from 'axios';

const BIGTOS_API_URL = 'https://www.cp.bigtos.com/api/v1/sendmessage';
const BIGTOS_KEY = process.env.BIGTOS_API_KEY || 'Enterkey';

export async function sendBigtosMessage(mobileNo: string, msg: string) {
  try {
    const payload = new URLSearchParams();
    payload.append('key', BIGTOS_KEY);
    payload.append('mobileno', mobileNo);
    payload.append('msg', msg);
    payload.append('type', 'Text');

    const response = await axios.post(BIGTOS_API_URL, payload.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    return response.data;
  } catch (error: any) {
    console.error('Bigtos API Error:', error.response?.data || error.message);
    throw new Error('Failed to send message via Bigtos');
  }
}
