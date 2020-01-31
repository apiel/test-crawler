import React from 'react';

const load = <T>(
    fn: () => Promise<any>,
    setResult: React.Dispatch<React.SetStateAction<T>>,
    setError: React.Dispatch<React.SetStateAction<string>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
) => async () => {
    try {
        setLoading(true);
        const result = await fn();
        setResult(result);
    } catch (error) {
        setError(error);
    }
    setLoading(false);
}
export const useAsync = <T>(
    fn: () => Promise<any>,
    deps: React.DependencyList = [],
    initialValue?: any,
) => {
    const [result, setResult] = React.useState<T>(initialValue);
    const [error, setError] = React.useState();
    const [loading, setLoading] = React.useState(false);
    const call = load<T>(fn, setResult, setError, setLoading);
    React.useEffect(() => { call(); }, deps);
    return { loading, result, call, error, setResult }
}