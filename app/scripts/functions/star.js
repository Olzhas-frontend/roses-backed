//const starRatingsItem = document.querySelectorAll('.form-rating__icon');
//const starRatingsCount = document.querySelector('.form-rating__count');
//const starsArray = Array.from(starRatingsItem);
//let currentRating = 0;

//export function countStart() {
//	starsArray.forEach((star, index) => {
//		star.addEventListener('click', (e) => {
//			for (let i = 0; i < starsArray.length; i++) {
//				starsArray[i].style.fill = '#d0d2d7';
//			}
//			colorStar(index);
//			currentRating = index + 1;
//			starRatingsCount.textContent = currentRating;
//		});
//	});
//}

//export function resetCountStar() {
//	starsArray.forEach((star) => {
//		star.style.fill = '';
//	});
//	starRatingsCount.textContent = '0';
//}

//function colorStar(n) {
//	if (n < 0) return;
//	starsArray[n].style.fill = '#ffa500';
//	colorStar(n - 1);
//}
