import { userExpired, userFound, loadingUser } from './actions';
import { USER_EXPIRED, LOADING_USER } from './constants';

// store the user here to prevent future promise calls to getUser()
export let storedUser = null;

// helper function to set the stored user manually (for testing)
export function setStoredUser(user) {
  storedUser = user;
}

// helper function to remove the stored user manually (for testing)
export function removeStoredUser() {
  storedUser = null;
}

// the middleware handler function
export async function middlewareHandler(next, action, userManager) {
  // prevent an infinite loop of dispatches of these action types (issue #30)
  if (action.type === USER_EXPIRED || action.type === LOADING_USER) {
    return next(action);
  }

  if (!storedUser || storedUser.expired) {
    next(loadingUser());
    let user = await userManager.getUser();
    if (!user || user.expired) {
      next(userExpired());
    } else {
      storedUser = user;
      next(userFound(user));
    }
  }
  return next(action);
}

// the middleware creator function
export default function createOidcMiddleware(userManager) {
  if (!userManager || !userManager.getUser) {
    throw new Error('You must provide a user manager!');
  }

  // the middleware
  return (store) => (next) => (action) => {
    return middlewareHandler(next, action, userManager);
  }
};
