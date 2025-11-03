import axios from 'axios'

export async function responseFromCommunity(payload) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,HEAD,POST,OPTIONS',
    'Access-Control-Max-Age': '86400',
    'content-type': 'text/html;charset=UTF-8'
  }
  const respHeaders = {
    ...corsHeaders,
    dataemail: payload.email,
    datalastname: payload.last_name,
    datafirstname: payload.name,
    dataid: payload.id
  }
  const dataRes = axios({
    method: 'post',
    url: 'https://community-service.abhaybhargav.workers.dev/',
    headers: respHeaders,
    data: {}
  })
  dataRes.then((res) => window.open(res.data))
}

export default responseFromCommunity
