import { ERR } from '../server/error';
import { GitHubAuth } from '../auth/GitHubAuth';
import { notification } from 'antd';

export const useError = (error: any) => {
    if (error) {
        if (error === ERR.missingGitHubConfig || error?.message === ERR.missingGitHubConfig) {
            return GitHubAuth;
        } else {
            notification['warning']({
                message: `Something went wrong.`,
                description: error.toString(),
            });
        }
    }
}
