export const randomId = () => {
	const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
	return (
		alphabet[Math.floor(Math.random() * alphabet.length)] +
		Math.floor(100000000 + Math.random() * 900000000)
	);
};

//const productToBase = {
//	id: 'K722135520',
//	title: '9 малиновых кустовых роз в упаковке ',
//	descr: 'Нежный, насыщенный и ароматный букет белых альстромерий, лавандовых роз и сантини. ',
//	options: {
//		diameter: '42',
//		height: '60',
//		width: '35',
//		colors: ['red', 'yellow', 'white'],
//		sizes: ['mini', 'standart'],
//	},
//	images: 'images/product-spring.jpg',
//	currentPrice: '4150',
//	oldPrice: '2370',
//	images: 'images/product-malina.jpg',
//	composition: ['Тюльпаны', 'Хризантемы'],
//	sendPerson: ['Жене', 'Маме', 'Коллеге'],
//};
