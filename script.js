import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  stages: [
    { duration: '4m', target: 100 },
    { duration: '6m', target: 200},
    { duration: '4m', target: 0}
  ]
};


export default function() {
  http.get('https://test.k6.io');
}
