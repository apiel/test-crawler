import { useHistory } from 'react-router-dom';
import { ERR } from '../server/error';
import { getAuthGitHubRoute } from '../routes';

export const useError = (error: any) => {
    const history = useHistory();
    if (error?.message) {
        if (error.message === ERR.missingGitHubConfig) {
            history.push(getAuthGitHubRoute());
        }
    }
}
