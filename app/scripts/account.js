import { User } from './classes/user';
import { signOut } from './functions/signInAndUp';

const logOutBtn = document.querySelector('.log-out');

const currentUser = new User();

currentUser.setUserName();
currentUser.setUserDiscount();

logOutBtn.addEventListener('click', (e) => {
	e.preventDefault();
	signOut();
});
