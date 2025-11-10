import axios from 'axios';

export const uploadSingleImage = async (file: File | null): Promise<number | null> => {
	if (!file) {
		return null;
	}

	const formData = new FormData();
	formData.append('files', file);

	const res = await axios.post('https://ovdjejekosarkasve.com/api/upload', formData);

	if (res.status === 201) {
		return res.data[0].id;
	}

	return null;
};
