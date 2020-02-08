import { StorageType } from './server/typing';

export const getHomeRoute = () => '/';
export const getNewProjectRoute = () => '/new';
export const getSettingsRoute = () => '/settings';
export function getPinsRoute<T = StorageType>(storageType: T, projectId: string) {
    return `/pins/${storageType}/${projectId}`;
}
export function getCodeRoute<T = StorageType>(storageType: T, projectId: string, id: string) {
    return `/code/${storageType}/${projectId}/${id}`;
}
export function getResultsRoute<T = StorageType>(storageType: T, projectId: string, timestamp: string) {
    return `/results/${storageType}/${projectId}/${timestamp}`;
}
export function getProjectRoute<T = StorageType>(storageType: T, projectId: string) {
    return `/project/${storageType}/${projectId}`;;
}
