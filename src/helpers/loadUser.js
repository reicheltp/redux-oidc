import { userFound, userExpired } from '../actions';

export async function loadUserHandler(store, userManager) {
  if (!store || !store.dispatch) {
    throw new Error('redux-oidc: You need to pass the redux store into the loadUser helper!');
  }

  if (!userManager || !userManager.getUser) {
    throw new Error('redux-oidc: You need to pass the userManager into the loadUser helper!');
  }

  const user = await userManager.getUser();

  if (user && !user.expired) {
    store.dispatch(userFound(user));
  } else {
    store.dispatch(userExpired());
  }
}

export default function loadUser(store, userManager) {
  return loadUserHandler(store, userManager);
}
