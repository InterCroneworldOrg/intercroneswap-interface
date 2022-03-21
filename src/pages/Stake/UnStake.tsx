import { RouteComponentProps } from 'react-router-dom';
// import { useActiveWeb3React } from "../../hooks";
import { useStakingContract } from '../../hooks/useContract';
import AppBody, { Container } from '../AppBody';

export default function UnStake({
  match: {
    params: { stakingAddress },
  },
}: RouteComponentProps<{ stakingAddress: string }>) {
  // const { account, chainId, library } = useActiveWeb3React();
  // const theme = useContext(ThemeContext);

  const contract = useStakingContract(stakingAddress);
  console.log(contract);

  // const toggleWalletModal = useWalletModalToggle(); // toggle wallet when disconnected

  return (
    <>
      <Container>
        <AppBody>

        </AppBody>
      </Container>
    </>
  );
}
