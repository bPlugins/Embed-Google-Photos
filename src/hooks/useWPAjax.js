import { useState, useEffect } from "react";

const useWPAjax = (action, params = {}, set = false) => {
    const [isLoading, setIsLoading] = useState(!set);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    if (!wp.ajax) {
        // eslint-disable-next-line no-console
        console.error("Please use wp-util as a dependency");
        return;
    }

    const sendRequest = (payload = {}) => {
        setIsLoading(true);
        setIsError(false);
        setError(null);
        wp.ajax
            .post(action, { ...params, ...payload })
            .done((res) => {
                setData(res);
                setIsLoading(false);
            })
            .fail((error) => {
                setIsError(true);
                setError(error);
                setIsLoading(false);
            });
    };

    const request = async (payload = {}) => {
        sendRequest(payload);
    };

    useEffect(() => {
        if (!set) {
            sendRequest(params);
        }
    }, []);

    return {
        data,
        saveData: request,
        refetch: request,
        isLoading,
        isError,
        error,
    };
};
export default useWPAjax;
