import { RouteComponentProps } from 'react-router-dom';
// import { useActiveWeb3React } from "../../hooks";
import { useStakingContract } from '../../hooks/useContract';
import { useStakingInfo } from '../../state/stake/hooks';
import AppBody, { Container } from '../AppBody';

export default function Stake({
  match: {
    params: { stakingAddress },
  },
}: RouteComponentProps<{ stakingAddress: string }>) {
  // const { account, chainId, library } = useActiveWeb3React();
  // const theme = useContext(ThemeContext);

  const contract = useStakingContract(stakingAddress);
  console.log(contract, stakingAddress, 'stakingContract');
  const stakingInfo = useStakingInfo(stakingAddress);
  console.log(stakingInfo, 'staking');

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
