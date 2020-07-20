import { AccountFactory } from './account-factory';

describe('AccountFactory', () => {
  it('should create an instance', () => {
    expect(new AccountFactory()).toBeTruthy();
  });
});
