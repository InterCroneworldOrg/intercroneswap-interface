import { useCallback, useContext } from 'react';
import { Text } from 'rebass';
import { ThemeContext } from 'styled-components';
import { ButtonPrimary, ButtonSecondary } from '../../components/Button';
import { AutoColumn } from '../../components/Column';
import NumericalInput from '../../components/NumericalInput';
import { AutoRow, RowBetween } from '../../components/Row';
import TransactionConfirmationModal, { ConfirmationModalContent } from '../../components/TransactionConfirmationModal';
// import { useActiveWeb3React } from "../../hooks";
import { StakingInfo, useStakeActionHandlers, useStakeState } from '../../state/stake/hooks';
// import { useStakingInfo } from '../../state/stake/hooks';

interface StakeModalProps {
  isOpen: boolean;
  onDismiss: () => void;
  isStaking: boolean;
  stakingAddress: string;
  balance?: string;
  stakingInfo?: StakingInfo;
}

export default function StakeModal({
  isOpen,
  onDismiss,
  isStaking,
  stakingInfo,
  stakingAddress,
  balance,
}: StakeModalProps) {
  // const { account } = useActiveWeb3React();
  const theme = useContext(ThemeContext);
  // console.log(stakingInfo, stakingAddress, theme, 'infos');
  const stakeState = useStakeState();

  const { onUserInput } = useStakeActionHandlers();

  const handleTypeInput = useCallback(
    (value: string) => {
      onUserInput(value);
    },
    [onUserInput],
  );

  const modalBottom = useCallback(() => {
    return isStaking ? (
      <AutoRow justify="center">
        <ButtonPrimary width="50%">Deposit</ButtonPrimary>
      </AutoRow>
    ) : (
      <AutoRow justify="center">
        <ButtonPrimary width="50%">Withdraw</ButtonPrimary>
      </AutoRow>
    );
  }, [balance, isStaking]);

  const modalHeader = useCallback(() => {
    return (
      <AutoColumn gap="md">
        <RowBetween>
          <Text fontWeight={500}>Balance</Text>
          <Text fontWeight={500} color={theme.primary3}>
            {balance}
          </Text>
        </RowBetween>
        <RowBetween>
          <NumericalInput
            className="lp-amount-input"
            value={stakeState.typedValue}
            onUserInput={handleTypeInput}
            max={balance}
          />
          <ButtonSecondary onClick={() => {
            onUserInput(balance ?? '');
          }}>MAX</ButtonSecondary>
        </RowBetween>
      </AutoColumn>
    );
  }, [stakeState, balance]);

  // const toggleWalletModal = useWalletModalToggle(); // toggle wallet when disconnected
  const confirmationContent = useCallback(() => {
    return (
      <ConfirmationModalContent
        title="Deposit"
        onDismiss={onDismiss}
        topContent={modalHeader}
        bottomContent={modalBottom}
      />
    );
  }, [stakeState, balance]);

  return (
    <TransactionConfirmationModal
      isOpen={isOpen}
      onDismiss={onDismiss}
      attemptingTxn={false}
      hash={''}
      content={confirmationContent}
      pendingText={''}
    />
  );
}
