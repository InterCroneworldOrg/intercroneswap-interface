import { JSBI, TokenAmount } from '@intercroneswap/v2-sdk';
import { useCallback, useContext, useState } from 'react';
import { Text } from 'rebass';
import { ThemeContext } from 'styled-components';
import { ButtonPrimary, ButtonSecondary } from '../../components/Button';
import { AutoColumn } from '../../components/Column';
import NumericalInput from '../../components/NumericalInput';
import { AutoRow, RowBetween } from '../../components/Row';
import TransactionConfirmationModal, { ConfirmationModalContent } from '../../components/TransactionConfirmationModal';
import { ApprovalState, useApproveCallback } from '../../hooks/useApproveCallback';
import { useActiveWeb3React } from '../../hooks';
import { StakingInfo, useStakeActionHandlers, useStakeState } from '../../state/stake/hooks';
import { getStakingContract } from '../../utils';
import { TransactionResponse } from '@ethersproject/providers';
import { DEFAULT_FEE_LIMIT } from '../../tron-config';
import { useTransactionAdder } from '../../state/transactions/hooks';
// import { useStakingInfo } from '../../state/stake/hooks';

interface StakeModalProps {
  isOpen: boolean;
  onDismiss: () => void;
  isStaking: boolean;
  stakingAddress: string;
  balance?: TokenAmount;
  token0?: TokenAmount;
  token1?: TokenAmount;
  stakingInfo?: StakingInfo;
}

export default function StakeModal({
  isOpen,
  onDismiss,
  isStaking,
  stakingAddress,
  token0,
  token1,
  balance,
}: StakeModalProps) {
  const { account, chainId, library } = useActiveWeb3React();
  const theme = useContext(ThemeContext);
  // console.log(stakingInfo, stakingAddress, theme, 'infos');
  const stakeState = useStakeState();

  const { onUserInput } = useStakeActionHandlers();

  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false); // clicked confirm
  const [txHash, setTxHash] = useState<string>('');
  const addTransaction = useTransactionAdder();

  const handleTypeInput = useCallback(
    (value: string) => {
      onUserInput(value);
    },
    [onUserInput],
  );

  async function doStake() {
    if (!chainId || !library || !account) {
      console.log('Stopping stake while we dont have required web3');

      return;
    }

    const stakingContract = getStakingContract(chainId, stakingAddress, library, account);
    if (!stakeState?.typedValue || !balance) {
      return;
    }
    const estimate = stakingContract.estimateGas.stake;
    const method: (...args: any) => Promise<TransactionResponse> = stakingContract.stake;
    const args: Array<string | string[] | number> = [JSBI.BigInt(stakeState.typedValue).toString()];
    setAttemptingTxn(true);
    await estimate(...args, {})
      .then(() =>
        method(...args, {
          ...{},
          gasLimit: DEFAULT_FEE_LIMIT,
        }).then((response) => {
          setAttemptingTxn(false);
          console.log('Calling stake method');
          addTransaction(response, {
            summary: `Stake ${stakeState.typedValue}`,
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
  const [approveToken0, approveToken0Callback] = useApproveCallback(token0, stakingAddress);
  const [approveToken1, approveToken1Callback] = useApproveCallback(token1, stakingAddress);

  const modalBottom = useCallback(() => {
    return (
      <AutoRow justify="center">
        {(approveState === ApprovalState.PENDING || approveState === ApprovalState.NOT_APPROVED) && (
          <ButtonPrimary width="50%" onClick={approveCallback}>
            Approve
          </ButtonPrimary>
        )}
        {(approveToken0 === ApprovalState.PENDING || approveToken0 === ApprovalState.NOT_APPROVED) && (
          <ButtonPrimary width="50%" onClick={approveToken0Callback}>
            Approve {token0?.token.symbol}
          </ButtonPrimary>
        )}
        {(approveToken1 === ApprovalState.PENDING || approveToken1 === ApprovalState.NOT_APPROVED) && (
          <ButtonPrimary width="50%" onClick={approveToken1Callback}>
            Approve {token1?.token.symbol}
          </ButtonPrimary>
        )}
        <ButtonPrimary width="50%" onClick={doStake}>
          {isStaking ? 'Deposit' : 'Withdraw'}
        </ButtonPrimary>
      </AutoRow>
    );
  }, [stakeState, balance, isStaking, approveState, approveToken0, approveToken1]);

  const modalHeader = useCallback(() => {
    return (
      <AutoColumn gap="md">
        <RowBetween>
          <Text fontWeight={500}>Balance</Text>
          <Text fontWeight={500} color={theme.primary3}>
            {balance?.toSignificant()}
          </Text>
        </RowBetween>
        <RowBetween>
          <NumericalInput
            className="lp-amount-input"
            value={stakeState.typedValue}
            onUserInput={handleTypeInput}
            max={balance?.toSignificant()}
          />
          <ButtonSecondary
            onClick={() => {
              onUserInput(balance?.toSignificant() ?? '');
            }}
          >
            MAX
          </ButtonSecondary>
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
  }, [stakeState, balance, approveState, approveToken0, approveToken1]);

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
