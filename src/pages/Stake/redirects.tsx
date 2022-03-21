import { RouteComponentProps } from 'react-router-dom';
import Stake from './Stake';
import UnStake from './UnStake';

export function RedirectToStake(props: RouteComponentProps<{ stakingAddress: string }>) {
  return <Stake {...props} />;
}

export function RedirectToUnStake(props: RouteComponentProps<{ stakingAddress: string }>) {
  return <UnStake {...props} />;
}
