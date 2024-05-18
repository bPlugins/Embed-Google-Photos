import { useState } from 'react';

const useWPOptionMutation = (key, { dataType = 'string' }) => {
	const [data, setData] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	const saveData = (data) => {
		if (!isLoading) {
			setError(null);
			setIsLoading(true);

			try {
				const model = new wp.api.models.Settings({
					[key]: prepareData(data, 'saving'),
				});
				model.save().then((response) => {
					setData(prepareData(response[key], 'response'));
					setIsLoading(false);
				});
			} catch (error) {
				setError(error?.message);
				setIsLoading(false);
			}
		}
	};

	const prepareData = (data, type) => {
		let newData = data;

		if (dataType === 'object') {
			try {
				newData = type === 'saving' ? JSON.stringify(data) : JSON.parse(data);
			} catch (error) {
				setError(error?.message);
			}
		}

		return newData;
	};

	return { data, saveData, isLoading, error };
};
export default useWPOptionMutation;