export const getHomeRoute = () => '/';
export const getNewProjectRoute = () => '/new';
export const getSettingsRoute = () => '/settings';
export const getPinsRoute = (remoteType: string, projectId: string) => `/pins/${remoteType}/${projectId}`;
export const getCodeRoute = (remoteType: string, projectId: string, id: string) => `/code/${remoteType}/${projectId}/${id}`;
export const getResultsRoute = (remoteType: string, projectId: string, timestamp: string) => `/results/${remoteType}/${projectId}/${timestamp}`;
export const getProjectRoute = (remoteType: string, projectId: string) => `/project/${remoteType}/${projectId}`;
