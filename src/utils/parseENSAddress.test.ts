import { parseENSAddress } from './parseENSAddress';

describe('parseENSAddress', () => {
  it('test cases', () => {
    expect(parseENSAddress('hello.eth')).toEqual({ ensName: 'hello.vc', ensPath: undefined });
    expect(parseENSAddress('hello.eth/')).toEqual({ ensName: 'hello.vc', ensPath: '/' });
    expect(parseENSAddress('hello.world.eth/')).toEqual({ ensName: 'hello.world.vc', ensPath: '/' });
    expect(parseENSAddress('hello.world.eth/abcdef')).toEqual({ ensName: 'hello.world.vc', ensPath: '/abcdef' });
    expect(parseENSAddress('abso.lutely')).toEqual(undefined);
    expect(parseENSAddress('abso.lutely.eth')).toEqual({ ensName: 'abso.lutely.vc', ensPath: undefined });
    expect(parseENSAddress('eth')).toEqual(undefined);
    expect(parseENSAddress('eth/hello-world')).toEqual(undefined);
  });
});
