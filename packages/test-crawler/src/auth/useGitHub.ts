import Cookies from 'universal-cookie';
import { useHistory, useLocation } from 'react-router-dom';
import { getGitHubAuthRoute, getHomeRoute } from '../routes';
import { StorageType } from '../server/storage.typing';

export const useGitHub = (storageType: StorageType) => {
    const history = useHistory();
    const location = useLocation();
    if (storageType === StorageType.GitHub) {
        const cookies = new Cookies();
        if (!cookies.get('github')) {
            history.push({
                pathname: getGitHubAuthRoute(),
                state: {
                    referer: location.pathname,
                }
            });
        }
    }
}

export const useReferer = () => {
    const history = useHistory();
    const location: any = useLocation();
    return () => {
        if (location.pathname === getHomeRoute()) {
            window?.location?.reload();
        } else if (location.state?.referer) {
            history.push(location.state.referer);
        } else {
            history.push(getHomeRoute());
        }
    };
}
