export const getHomeRoute = () => '/';
export const getNewProjectRoute = () => '/new';
export const getSettingsRoute = () => '/settings';
export const getPinsRoute = (projectId: string) => `/pins/${projectId}`;
export const getCodeRoute = (projectId: string, id: string) => `/code/${projectId}/${id}`;
export const getResultsRoute = (projectId: string, timestamp: string) => `/results/${projectId}/${timestamp}`;
export const getProjectRoute = (projectId: string) => `/project/${projectId}`;
