import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import auth from '../apisServices/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { upload } from '../components/upload';
const storage = getStorage();

//const currentUser = await new Promise((resolve, reject) =>
//	onAuthStateChanged(
//		auth.auth,
//		(user) => resolve(user),
//		(e) => reject(e)
//	)
//);

//export const reviewUpload = upload('#file', {
//	multi: false,
//	accept: ['.png', '.jpg', '.jpeg', '.gif'],
//	onUpload(files, blocks) {
//		const productId = document.getElementById('autocomplete-0-input').dataset.productId;

//		files.forEach((file, index) => {
//			const storageRef = ref(storage, `images/reviews/${productId}`);
//			const task = uploadBytesResumable(storageRef, file, file.type);

//			task.on(
//				'state-changed',
//				(snapshot) => {
//					const percentage = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0) + '%';

//					const block = blocks[index].querySelector('.preview-info-progress');
//					block.textContent = percentage;
//					block.style.width = percentage;
//				},
//				(error) => {
//					console.log(error);
//				},
//				() => {
//					getDownloadURL(task.snapshot.ref).then((url) => {
//						console.log('Download URL', url);
//					});
//				}
//			);
//		});
//	},
//});
