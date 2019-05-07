import { remote } from "isomor";
import { CrawlerProvider, Crawler, CrawlerInput, StartCrawler, PageData, Preset } from "test-crawler-lib";
import * as sharp from "sharp";
export function getSettings(...args: any) {
  return remote("server-crawler", "getSettings", args);
}
export function getLogs(...args: any) {
  return remote("server-crawler", "getLogs", args);
}
export function getCrawlers(...args: any) {
  return remote("server-crawler", "getCrawlers", args);
}
export function loadPresets(...args: any) {
  return remote("server-crawler", "loadPresets", args);
}
export function saveAndStart(...args: any) {
  return remote("server-crawler", "saveAndStart", args);
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
export function getPin(...args: any) {
  return remote("server-crawler", "getPin", args);
}
export function setCode(...args: any) {
  return remote("server-crawler", "setCode", args);
}
export function getCode(...args: any) {
  return remote("server-crawler", "getCode", args);
}
export function getThumbnail(...args: any) {
  return remote("server-crawler", "getThumbnail", args);
}
export function pin(...args: any) {
  return remote("server-crawler", "pin", args);
}
export function setZoneStatus(...args: any) {
  return remote("server-crawler", "setZoneStatus", args);
}
export function setZonesStatus(...args: any) {
  return remote("server-crawler", "setZonesStatus", args);
}
export function setStatus(...args: any) {
  return remote("server-crawler", "setStatus", args);
}