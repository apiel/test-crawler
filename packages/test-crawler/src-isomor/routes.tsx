export const getHomeRoute = () => '/';
export const getNewProjectRoute = () => '/new';
export const getSettingsRoute = () => '/settings';
export const getPinsRoute = (projectId: string) => `/pins/${projectId}`;
export const getCodeRoute = (id: string) => `/code/${id}`;
export const getCodesRoute = () => `/code`;
export const getResultsRoute = (projectId: string, timestamp: string) => `/results/${projectId}/${timestamp}`;
export const getProjectRoute = (projectId: string) => `/project/${projectId}`;
