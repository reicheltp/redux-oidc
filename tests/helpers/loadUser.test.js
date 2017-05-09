import '../setup';
import sinon from 'sinon';
import expect from 'expect';
import { loadUserHandler } from '../../src/helpers/loadUser';
import { userExpired, userFound } from '../../src/actions';

const mocha = require('mocha');

describe('helper - loadUser()', async () => {
  let userManagerMock;
  let storeMock;
  let getUserStub;
  let dispatchStub;

  beforeEach(() => {
    dispatchStub = sinon.stub();
    getUserStub = sinon.stub();

    userManagerMock = {
      getUser: getUserStub
    };

    storeMock = {
      dispatch: dispatchStub
    };
  });

  it('should dispatch a valid user to the store', async function () {
    const validUser = { some: 'user' };
    getUserStub.returns(validUser);

    await loadUserHandler(storeMock, userManagerMock);

    expect(dispatchStub.calledWith(userFound(validUser))).toEqual(true);
  });

  it('should dispatch USER_EXPIRED when no valid user is present', async function () {
    const invalidUser = { expired: true };
    getUserStub.returns(invalidUser);

    await loadUserHandler(storeMock, userManagerMock);

    expect(dispatchStub.calledWith(userExpired())).toEqual(true);
  });
});
