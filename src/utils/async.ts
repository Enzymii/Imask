import axios from 'axios';
import { nanoid } from 'nanoid';
import config from '../config';

interface FileInfo {
	name: string;
	type: string;
}

const uploadSingleFile = async (file: File) => {
	const formData = new FormData();
	const fileName = `${nanoid()}`;

	const { OSSAccessKeyId, policy, Signature } = (
		await axios.get(config.apiBaseUrl + '/upload_url', {
			params: { name: fileName },
			withCredentials: true
		})
	).data;
	formData.append('key', `media/${fileName}`);
	formData.append('success_action_status', '200');
	formData.append('OSSAccessKeyId', OSSAccessKeyId);
	formData.append('policy', policy);
	formData.append('Signature', Signature);
	formData.append('file', file, fileName);
	await axios.post(config.ossBaseUrl, formData);

	return { name: fileName, type: file.type };
};

const getDownloadUrl = async ({ name }: FileInfo) =>
	(
		await axios.get<{ url: string }>(config.apiBaseUrl + '/download_url', {
			params: { filename: name },
			withCredentials: true
		})
	).data;

export { uploadSingleFile, getDownloadUrl };
export type { FileInfo };
