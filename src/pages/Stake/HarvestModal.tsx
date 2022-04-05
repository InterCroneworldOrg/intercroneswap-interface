import { TokenAmount } from '@intercroneswap/v2-sdk';
import { useCallback, useContext, useState } from 'react';
import { Text } from 'rebass';
import { ThemeContext } from 'styled-components';
import { ButtonPrimary } from '../../components/Button';
import { AutoColumn } from '../../components/Column';
import { AutoRow, RowBetween } from '../../components/Row';
import TransactionConfirmationModal, { ConfirmationModalContent } from '../../components/TransactionConfirmationModal';
import { ApprovalState, useApproveCallback } from '../../hooks/useApproveCallback';
import { useActiveWeb3React } from '../../hooks';
import { StakingInfo } from '../../state/stake/hooks';
import { getStakingContract } from '../../utils';
import { TransactionResponse } from '@ethersproject/providers';
import { DEFAULT_FEE_LIMIT } from '../../tron-config';
import { useTransactionAdder } from '../../state/transactions/hooks';
// import { useStakingInfo } from '../../state/stake/hooks';

interface StakeModalProps {
  isOpen: boolean;
  onDismiss: () => void;
  stakingAddress: string;
  balance?: TokenAmount;
  stakingInfo?: StakingInfo;
}

export default function HarvestModal({ isOpen, onDismiss, stakingAddress, balance }: StakeModalProps) {
  const { account, chainId, library } = useActiveWeb3React();
  const theme = useContext(ThemeContext);

  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false); // clicked confirm
  const [txHash, setTxHash] = useState<string>('');
  const addTransaction = useTransactionAdder();

  async function doHarvest() {
    if (!chainId || !library || !account) {
      return;
    }

    const stakingContract = getStakingContract(chainId, stakingAddress, library, account);
    const estimate = stakingContract.estimateGas.getReward;
    const method: (...args: any) => Promise<TransactionResponse> = stakingContract.getReward;
    setAttemptingTxn(true);
    await estimate()
      .then(() =>
        method({
          ...{},
          gasLimit: DEFAULT_FEE_LIMIT,
        }).then((response) => {
          setAttemptingTxn(false);
          addTransaction(response, {
            summary: `Harvest`,
          });
          setTxHash(response.hash);
        }),
      )
      .catch((err) => {
        setAttemptingTxn(false);
        if (err?.code !== 4001) {
          console.error(err);
        }
      });
  }

  const [approveState, approveCallback] = useApproveCallback(balance, stakingAddress);

  const modalBottom = useCallback(() => {
    return (
      <AutoRow justify="center">
        {(approveState === ApprovalState.PENDING || approveState === ApprovalState.NOT_APPROVED) && (
          <ButtonPrimary width="50%" onClick={approveCallback}>
            Approve
          </ButtonPrimary>
        )}
        <ButtonPrimary width="50%" onClick={doHarvest}>
          Harvest
        </ButtonPrimary>
      </AutoRow>
    );
  }, [stakingAddress, approveState]);

  const modalHeader = useCallback(() => {
    return (
      <AutoColumn gap="md">
        <RowBetween>
          <Text fontWeight={500}>Balance</Text>
          <Text fontWeight={500} color={theme.primary3}>
            {balance?.toSignificant()}
          </Text>
        </RowBetween>
      </AutoColumn>
    );
  }, [stakingAddress, balance]);

  // const toggleWalletModal = useWalletModalToggle(); // toggle wallet when disconnected
  const confirmationContent = useCallback(() => {
    return (
      <ConfirmationModalContent
        title={'Harvest'}
        onDismiss={onDismiss}
        topContent={modalHeader}
        bottomContent={modalBottom}
      />
    );
  }, [stakingAddress, approveState]);

  return (
    <TransactionConfirmationModal
      isOpen={isOpen}
      onDismiss={onDismiss}
      attemptingTxn={attemptingTxn}
      hash={txHash}
      content={confirmationContent}
      pendingText={''}
    />
  );
}