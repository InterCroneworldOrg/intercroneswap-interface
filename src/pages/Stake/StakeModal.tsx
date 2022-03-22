import { Text } from 'rebass';
import { ButtonPrimary } from '../../components/Button';
import Modal from '../../components/Modal';
import { RowBetween } from '../../components/Row';
// import { useActiveWeb3React } from "../../hooks";
import { StakingInfo } from '../../state/stake/hooks';
// import { useStakingInfo } from '../../state/stake/hooks';

interface StakeModalProps {
  isOpen: boolean;
  onDismiss: () => void;
  isStaking: boolean;
  stakingAddress: string;
  stakingInfo?: StakingInfo;
}

export default function StakeModal({ isOpen, onDismiss, isStaking, stakingInfo, stakingAddress }: StakeModalProps) {
  // const { account } = useActiveWeb3React();
  // const theme = useContext(ThemeContext);
  console.log(stakingInfo, stakingAddress, 'infos');

  // const toggleWalletModal = useWalletModalToggle(); // toggle wallet when disconnected

  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} maxHeight={80} minHeight={40}>
      <RowBetween>
        <Text>Deposit</Text>
        <ButtonPrimary onClick={onDismiss}>
          <Text fontWeight={500} fontSize={20}>
            {isStaking ? 'Staking' : 'Withdraw'}
          </Text>
        </ButtonPrimary>
      </RowBetween>
    </Modal>
  );
}
