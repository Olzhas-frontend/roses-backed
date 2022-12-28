export function calcRating(arr) {
	const stars = arr.reduce((acc, el) => {
		acc.push(el.reviewRating);
		return acc;
	}, []);
	const count = stars.reduce((a, b) => a + b, 0) / arr.length;
	return stars.length === 1 ? count : Math.round(count);
}
