import { RemoteType } from './server/typing';

export const getHomeRoute = () => '/';
export const getNewProjectRoute = () => '/new';
export const getSettingsRoute = () => '/settings';
export function getPinsRoute<T = RemoteType>(remoteType: T, projectId: string) {
    return `/pins/${remoteType}/${projectId}`;
}
export function getCodeRoute<T = RemoteType>(remoteType: T, projectId: string, id: string) {
    return `/code/${remoteType}/${projectId}/${id}`;
}
export function getResultsRoute<T = RemoteType>(remoteType: T, projectId: string, timestamp: string) {
    return `/results/${remoteType}/${projectId}/${timestamp}`;
}
export function getProjectRoute<T = RemoteType>(remoteType: T, projectId: string) {
    return `/project/${remoteType}/${projectId}`;;
}
