import { type CachedFetchValue, CachedRouteKind } from "next/dist/server/response-cache/types";

export const fetchBodyExample: CachedFetchValue = {
  kind: CachedRouteKind.FETCH,
  data: {
    headers: {
      'accept-ranges': 'bytes',
      'access-control-allow-origin': '*',
      age: '79330',
      'alt-svc': 'h3=":443"; ma=86400',
      'cache-control': 'public, max-age=86400, s-maxage=86400',
      'cf-cache-status': 'HIT',
      'cf-ray': '8eb02a9cbc1f6242-GRU',
      connection: 'keep-alive',
      'content-encoding': 'gzip',
      'content-length': '306',
      'content-type': 'application/json; charset=utf-8',
      date: 'Sun, 01 Dec 2024 03:59:46 GMT',
      etag: 'W/"588-/X6dSpO6F3LPFuUhaJHfN5AqUco"',
      'function-execution-id': 'o5jd5f8af1ff',
      nel: '{"success_fraction":0,"report_to":"cf-nel","max_age":604800}',
      'report-to':
        '{"endpoints":[{"url":"https:\\/\\/a.nel.cloudflare.com\\/report\\/v4?s=fqJ4%2Bc5AyTK3AYB%2FhRnUstrv5xhC2G13u%2FUff5%2Fz%2FuC5RRHp%2FNkl2BXa9fmwRrgbh2v9Bo3RBzUUK2Z8YRkcYzlEUb9ecrVLFlXikMD472sNvXxZ364gKDDQjWNj"}],"group":"cf-nel","max_age":604800}',
      server: 'cloudflare',
      'server-timing':
        'cfL4;desc="?proto=TCP&rtt=126266&min_rtt=18973&rtt_var=72416&sent=3&recv=5&lost=0&retrans=0&sent_bytes=2836&recv_bytes=668&delivery_rate=151794&cwnd=209&unsent_bytes=0&cid=97aaad770acf4aab&ts=47&x=0"',
      'strict-transport-security': 'max-age=31556926',
      vary: 'Accept-Encoding,cookie,need-authorization, x-fh-requested-host, accept-encoding',
      'x-cache': 'HIT',
      'x-cache-hits': '0',
      'x-cloud-trace-context': 'c0ff73d104c5e9c91637dfcacaaf47a3',
      'x-country-code': 'US',
      'x-powered-by': 'Express',
      'x-served-by': 'cache-mia-kmia1760057-MIA',
      'x-timer': 'S1731117329.363887,VS0,VE1',
    },
    body: '9',
    status: 200,
    url: 'https://pokeapi.co/api/v2/pokemon',
  },
  revalidate: 31536000,
  tags: ['pokemon'],
};
