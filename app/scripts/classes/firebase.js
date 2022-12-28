import app from '../vendor/firebase';
import { getDoc, getFirestore, orderBy } from 'firebase/firestore';
import { addDoc, collection, doc, updateDoc, getDocs, query, where } from 'firebase/firestore';

class Firebase {
	constructor() {
		this.db = getFirestore();
	}

	async getContentById(ids, path) {
		if (!ids || !ids.length || !path) return [];

		const batches = [];

		while (ids.length) {
			const batch = ids.splice(0, 10);

			batches.push(
				getDocs(query(collection(this.db, 'products'), where('id', 'in', [...batch]))).then((results) =>
					results.docs.map((result) => ({ /* id: result.id, */ ...result.data() }))
				)
			);
		}
		return Promise.all(batches).then((content) => content.flat());
	}

	async setData(data, collectionName) {
		try {
			const obj = await addDoc(collection(this.db, collectionName), data);
			return obj;
		} catch (e) {
			console.error('Error adding document: ', e);
		}
	}

	async update(id, data) {
		updateDoc(doc(this.db, 'products', id), data);
	}

	async get() {
		const querySnapshot = await getDocs(collection(this.db, 'products'));
		return querySnapshot.docs.map((doc) => doc.data());
	}

	async getStockIn(field, type = 'asc') {
		const q = query(collection(this.db, 'products'), where('preOrder', '==', false), orderBy(field, type));
		const querySnapshot = await getDocs(q);
		return querySnapshot.docs.map((doc) => doc.data());
	}

	async getOne(id) {
		const q = query(collection(this.db, 'products'), where('id', '==', id));
		const querySnapshot = await getDocs(q);

		return querySnapshot.docs.map((doc) => doc.data());
	}

	async getWithQuery2(collectionName, field, operator, value) {
		const q = query(collection(this.db, collectionName), where(field, operator, value));
		const querySnapshot = await getDocs(q);

		return querySnapshot.docs.map((doc) => doc.data());
	}

	async getWithQuery(data) {
		const q = query(collection(this.db, 'products'), where('id', 'in', data));
		const querySnapshot = await getDocs(q);

		return querySnapshot.docs.map((doc) => doc.data());
	}

	async getrev() {
		const q = collection(this.db, 'products');
		const rev = collection(this.db, 'testimonials');
		const querySnapshot = await getDocs(q);
		const winnerList = [];
		//return querySnapshot.docs.map((doc) => doc.data().id);

		const uids = [];
		querySnapshot.forEach((doc) => {
			uids.push(doc.data().id);
		});

		for (const uid of uids) {
			const userRef = query(collection(this.db, 'testimonials'), where('productId', '==', uid));
			const userSnapshot = await getDocs(userRef);
			winnerList.push({ [uid]: userSnapshot.docs.map((doc) => doc.data()) });
		}
		console.log(winnerList);
	}
}

const firebase = new Firebase();
export default firebase;
