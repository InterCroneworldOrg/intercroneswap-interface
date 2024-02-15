import { TokenAmount } from '@intercroneswap/v2-sdk';
import { useWeb3React } from '@web3-react/core';
import { useCallback, useContext, useState } from 'react';
import { Text, Button } from '@pancakeswap/uikit';
import { ThemeContext } from 'styled-components';
import { AutoColumn } from 'components/Layout/Column';
import { AutoRow, RowBetween } from 'components/Layout/Row';
import TransactionConfirmationModal, { ConfirmationModalContent } from '../../components/TransactionConfirmationModal';
import { ApprovalState, useApproveCallback } from '../../hooks/useApproveCallback';
import { StakingInfo } from '../../state/stake/hooks';
import { getStakingContract } from '../../utils';
// import { TransactionResponse } from '@ethersproject/providers';
import { useGasPrice } from '../../state/user/hooks';
import { calculateGasMargin } from '../../utils';
import { useTransactionAdder } from '../../state/transactions/hooks';
// import { useStakingInfo } from '../../state/stake/hooks';

interface StakeModalProps {
  onDismiss: () => void;
  stakingAddress: string;
  balance?: TokenAmount;
  stakingInfo?: StakingInfo;
}

export default function HarvestModal({ onDismiss, stakingAddress, balance }: StakeModalProps) {
  const { account, chainId, library } = useWeb3React();
  const gasPrice = useGasPrice();
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
    const method = stakingContract.getReward;
    setAttemptingTxn(true);
    await estimate()
      .then((estimatedGasLimit) =>
        method({
          ...{},
          gasLimit: calculateGasMargin(estimatedGasLimit),
          gasPrice,
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
          <Button width="50%" onClick={approveCallback}>
            Approve
          </Button>
        )}
        <Button width="50%" onClick={doHarvest}>
          Harvest
        </Button>
      </AutoRow>
    );
  }, [stakingAddress, approveState]);

  const modalHeader = useCallback(() => {
    return (
      <AutoColumn gap="md">
        <RowBetween>
          <Text fontWeight={500}>Balance</Text>
          <Text fontWeight={500} color={theme.colors.primary}>
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
        // title={'Harvest'}
        // onDismiss={onDismiss}
        topContent={modalHeader}
        bottomContent={modalBottom}
      />
    );
  }, [stakingAddress, approveState]);

  return (
    <TransactionConfirmationModal
      title="Harvest"
      onDismiss={onDismiss}
      attemptingTxn={attemptingTxn}
      hash={txHash}
      content={confirmationContent}
      pendingText={''}
    />
  );
}
