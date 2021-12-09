import axios from "axios";
import config from '../config';

interface FileInfo {
	name: string;
	type: string;
}

const uploadSingleFile = async (file: File) => {
	const formData = new FormData();
	const fileName = `${new Date().getTime()}_${file.name}`;

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

export { uploadSingleFile, FileInfo };