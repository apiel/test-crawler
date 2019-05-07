import { remote } from "isomor";
import { CrawlerProvider, Crawler, CrawlerInput, StartCrawler, PageData, Preset, Code } from "test-crawler-lib";
import * as sharp from "sharp";
export function getSettings(...args: any) {
  return remote("server-service", "getSettings", args);
}
export function getLogs(...args: any) {
  return remote("server-service", "getLogs", args);
}
export function getCrawlers(...args: any) {
  return remote("server-service", "getCrawlers", args);
}
export function loadPresets(...args: any) {
  return remote("server-service", "loadPresets", args);
}
export function saveAndStart(...args: any) {
  return remote("server-service", "saveAndStart", args);
}
export function getCrawler(...args: any) {
  return remote("server-service", "getCrawler", args);
}
export function getPages(...args: any) {
  return remote("server-service", "getPages", args);
}
export function getPins(...args: any) {
  return remote("server-service", "getPins", args);
}
export function getPin(...args: any) {
  return remote("server-service", "getPin", args);
}
export function setCode(...args: any) {
  return remote("server-service", "setCode", args);
}
export function getCode(...args: any) {
  return remote("server-service", "getCode", args);
}
export function getThumbnail(...args: any) {
  return remote("server-service", "getThumbnail", args);
}
export function pin(...args: any) {
  return remote("server-service", "pin", args);
}
export function setZoneStatus(...args: any) {
  return remote("server-service", "setZoneStatus", args);
}
export function setZonesStatus(...args: any) {
  return remote("server-service", "setZonesStatus", args);
}
export function setStatus(...args: any) {
  return remote("server-service", "setStatus", args);
}