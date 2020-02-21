import Cookies from 'universal-cookie';

export const MAX_AGE = 10;

export function githubRefresh() {
    const cookies = new Cookies();
    const value = cookies.get('github');
    if (value) {
        console.log('refresk cookie');
        cookies.set('github', value, { path: '/', maxAge: MAX_AGE * 60 });
    }
}
