import { setWsDefaultConfig } from 'isomor-server';

export default function(app: any) {
    setWsDefaultConfig({ withCookie: true });
}
