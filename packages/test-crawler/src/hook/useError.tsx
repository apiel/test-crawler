import { useHistory } from 'react-router-dom';
import { ERR } from '../server/error';
import { getAuthGitHubRoute } from '../routes';
import { GitHubAuth } from '../auth/GitHubAuth';
import { notification } from 'antd';

export const useError = (error: any) => {
    if (error === ERR.missingGitHubConfig || error?.message === ERR.missingGitHubConfig) {
        return GitHubAuth;
    } else {
        notification['warning']({
            message: `Something went wrong.`,
            description: error.toString(),
        });
    }
}

// not used yet
export const useErrorRedirect = (error: any) => {
    const history = useHistory();
    if (error === ERR.missingGitHubConfig || error?.message === ERR.missingGitHubConfig) {
        history.push(getAuthGitHubRoute());
    }
}
