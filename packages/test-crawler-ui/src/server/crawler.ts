import { remote } from "isomor";
export function getCrawlers(...args: any) {
  return remote("server-crawler", "getCrawlers", args);
}
export function startCrawler(...args: any) {
  return remote("server-crawler", "startCrawler", args);
}
export function getCrawler(...args: any) {
  return remote("server-crawler", "getCrawler", args);
}
export function getPages(...args: any) {
  return remote("server-crawler", "getPages", args);
}
export function getPins(...args: any) {
  return remote("server-crawler", "getPins", args);
}
export function thumbnail(...args: any) {
  return remote("server-crawler", "thumbnail", args);
}
export function pin(...args: any) {
  return remote("server-crawler", "pin", args);
}
export function setZoneStatus(...args: any) {
  return remote("server-crawler", "setZoneStatus", args);
}
export function setStatus(...args: any) {
  return remote("server-crawler", "setStatus", args);
}