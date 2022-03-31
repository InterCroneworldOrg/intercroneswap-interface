import { Redirect, RouteComponentProps } from 'react-router-dom';
import tronweb from 'tronweb';
import Stake from '.';

export function RedirectToStake() {
  return <Redirect to="/stake/" />;
}

export function RedirectToReferal(props: RouteComponentProps<{ referal?: string }>) {
  const {
    match: {
      params: { referal },
    },
  } = props;
  if (!tronweb?.isAddress(referal)) {
    return RedirectToStake();
  }
  return <Stake {...props} />;
}
