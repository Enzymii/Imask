const mockAsyncFunction = async <T>(
	params: Record<string, string>,
	time: number,
	expected: T
): Promise<T> => {
	const res = await new Promise<T>((resolve) => {
		setTimeout(() => resolve(expected), time);
	});
	return res;
};

export default mockAsyncFunction;
