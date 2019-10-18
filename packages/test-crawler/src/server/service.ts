import { isomorRemote } from "isomor";
export function getSettings(...args: any) {
  return isomorRemote("server-service", "test-crawler", "getSettings", args);
}
export function getCrawlers(...args: any) {
  return isomorRemote("server-service", "test-crawler", "getCrawlers", args);
}
export function loadPresets(...args: any) {
  return isomorRemote("server-service", "test-crawler", "loadPresets", args);
}
export function saveAndStart(...args: any) {
  return isomorRemote("server-service", "test-crawler", "saveAndStart", args);
}
export function getCrawler(...args: any) {
  return isomorRemote("server-service", "test-crawler", "getCrawler", args);
}
export function getPages(...args: any) {
  return isomorRemote("server-service", "test-crawler", "getPages", args);
}
export function getPins(...args: any) {
  return isomorRemote("server-service", "test-crawler", "getPins", args);
}
export function getPin(...args: any) {
  return isomorRemote("server-service", "test-crawler", "getPin", args);
}
export function setCode(...args: any) {
  return isomorRemote("server-service", "test-crawler", "setCode", args);
}
export function getCode(...args: any) {
  return isomorRemote("server-service", "test-crawler", "getCode", args);
}
export function getCodes(...args: any) {
  return isomorRemote("server-service", "test-crawler", "getCodes", args);
}
export function getThumbnail(...args: any) {
  return isomorRemote("server-service", "test-crawler", "getThumbnail", args);
}
export function pin(...args: any) {
  return isomorRemote("server-service", "test-crawler", "pin", args);
}
export function setZoneStatus(...args: any) {
  return isomorRemote("server-service", "test-crawler", "setZoneStatus", args);
}
export function setZonesStatus(...args: any) {
  return isomorRemote("server-service", "test-crawler", "setZonesStatus", args);
}
export function setStatus(...args: any) {
  return isomorRemote("server-service", "test-crawler", "setStatus", args);
}