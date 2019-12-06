import fetch from '@/apis/fetch'
import {Config} from './env.js'

export function listVisitorsRecordForState(data) {
  return fetch({
    baseURL:Config.baseUrlWps,
    url: '/wps/visitors/listVisitorsRecordForState',
    method: 'post',
    data,
  })
}
export function deleteVisitorsRecord(data) {
  return fetch({
    baseURL:Config.baseUrlWps,
    url: '/wps/visitors/deleteVisitorsRecord',
    method: 'post',
    data,
  })
}
export function selectRecordById(data) {
  return fetch({
    baseURL:Config.baseUrlWps,
    url: '/wps/visitors/getVisitorsRecordDetail',
    method: 'post',
    data,
  })
}
export function getContactsRelation(data) {
  return fetch({
    baseURL:Config.baseUrlWps,
    url: '/wps/integration/listContactsRelation',
    method: 'post',
    data,
  })
}
export function visitorsUpload(data) {
  return fetch({
    baseURL:Config.baseUrlWps,
    url: '/wps/visitors/upload',
    method: 'post',
    data,
  })
}

export function saveOrUpdateVisitorsRecord(data) {
  return fetch({
    baseURL:Config.baseUrlWps,
    url: '/wps/visitors/saveOrUpdateVisitorsRecord',
    method: 'post',
    data,
  })
}

export function searchVisitName(data) {
  return fetch({
    baseURL:Config.baseUrlWps,
    url: '/wps/integration/searchVisitName',
    method: 'post',
    data,
  })
}

export function getPersonMsgByAdName(data) {
  return fetch({
    baseURL:Config.baseUrlWps,
    url: '/wps/integration/getPersonMsgByAdName',
    method: 'post',
    data,
  })
}

