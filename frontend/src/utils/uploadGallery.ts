import axios from 'axios';

export const uploadGallery = async (files: FileList | null): Promise<number[]> => {
	if (!files || files.length === 0) return [];

	const formData = new FormData();
	Array.from(files).forEach((file) => {
		formData.append('files', file);
	});

	const res = await axios.post('http://localhost:1337/api/upload', formData, {
		headers: { 'Content-Type': 'multipart/form-data' }
	});

	// Strapi returns array of uploaded files with IDs
	return res.data.map((file: { id: number }) => file.id);
};
