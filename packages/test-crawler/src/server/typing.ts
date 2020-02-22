import { isomorRemote } from "isomor";
import { CodeInfo } from 'test-crawler-core';
export interface StartCrawler {
  timestamp: string;
  redirect?: string;
}
export interface Code extends CodeInfo {
  source: string;
}
export enum BeforeAfterType {
  Before = 'before',
  After = 'after',
}
export interface Job {
  id: string;
  url: string;
  status: string;
  startAt: number;
  lastUpdate: number;
  stepsCount?: number;
  stepsDone?: number;
  currentStep?: string;
}