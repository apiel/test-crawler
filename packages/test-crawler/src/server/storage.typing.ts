import { isomorRemote } from "isomor";

/**
 * Separate types for storage in order to build static storage page
 * e.g. for GitHub pages
 */
export enum StorageType {
  Local = 'local',
  GitHub = 'github',
}