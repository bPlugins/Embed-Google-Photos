import { useState, useEffect } from 'react';

const useWPOptionQuery = (key) => {
	const [data, setData] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

	const settingsAction = () => {
		setIsLoading(true);

		wp.api.loadPromise.then(() => {
			const settings = new wp.api.models.Settings();
			settings.fetch()
				.then((response) => {
					setData(prepareData(response[key]) || {});
					setIsLoading(false);
				})
				.catch((error) => {
					setError(error.message);
					setIsLoading(false);
				})
		});
	}

	useEffect(() => {
		setError(null);

		settingsAction()
	}, []);

	const prepareData = (data) => {
		let newData = data;
		try {
			newData = JSON.parse(data);
		} catch (error) {
			setError(error.message);
		}
		return newData;
	};

	const fetchData = () => {
		settingsAction();
	}

	return { data, fetchData, isLoading, error };
};

export default useWPOptionQuery;