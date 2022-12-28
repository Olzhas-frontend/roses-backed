export function getNameFromFullName(fullname) {
	const [, firtName] = fullname.split(' ');
	return firtName;
}
