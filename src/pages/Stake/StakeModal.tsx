import { JSBI, TokenAmount } from '@intercroneswap/v2-sdk';
import { useCallback, useContext, useState } from 'react';
import { Text } from 'rebass';
import { ThemeContext } from 'styled-components';
import { ButtonGray, ButtonPrimary } from '../../components/Button';
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
import { REFERRAL_ADDRESSES } from '../../constants';
import { Tabs } from '../../components/NavigationTabs';
import { MaxButton } from './styleds';

interface StakeModalProps {
  isOpen: boolean;
  onDismiss: () => void;
  stakingAddress: string;
  balance?: TokenAmount;
  stakingInfo?: StakingInfo;
}

export default function StakeModal({ isOpen, onDismiss, stakingAddress, balance, stakingInfo }: StakeModalProps) {
  const { account, chainId, library } = useActiveWeb3React();
  const theme = useContext(ThemeContext);
  const stakeState = useStakeState();

  const [isStaking, setIsStaking] = useState<boolean>(true);
  const { onUserInput } = useStakeActionHandlers();

  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false); // clicked confirm
  const [txHash, setTxHash] = useState<string>('');
  const addTransaction = useTransactionAdder();

  const swapStaking = () => {
    setIsStaking(!isStaking);
    onUserInput('');
  };

  const handleTypeInput = useCallback(
    (value: string) => {
      onUserInput(value);
    },
    [onUserInput],
  );

  async function doWithdraw() {
    if (!chainId || !library || !account) {
      return;
    }

    const stakingContract = getStakingContract(chainId, stakingAddress, library, account);
    if (!stakeState?.typedValue || !balance) {
      return;
    }
    const estimate = stakingContract.estimateGas.withdraw;
    const method: (...args: any) => Promise<TransactionResponse> = stakingContract.withdraw;
    const args: Array<string | string[] | number> = [JSBI.BigInt(stakeState.typedValue).toString()];
    setAttemptingTxn(true);
    await estimate(...args, {})
      .then(() =>
        method(...args, {
          ...{},
          gasLimit: DEFAULT_FEE_LIMIT,
        }).then((response) => {
          setAttemptingTxn(false);
          addTransaction(response, {
            summary: `Withdraw ${stakeState.typedValue}`,
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

  async function doStake() {
    if (!chainId || !library || !account) {
      return;
    }

    const stakingContract = getStakingContract(chainId, stakingAddress, library, account);
    if (!stakeState?.typedValue || !balance) {
      return;
    }
    const estimate = stakingContract.estimateGas.stake;
    const method: (...args: any) => Promise<TransactionResponse> = stakingContract.stake;
    const args: Array<string | string[] | number> = [
      JSBI.BigInt(stakeState.typedValue).toString(),
      REFERRAL_ADDRESSES[chainId],
    ];
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

  const modalBottom = useCallback(() => {
    return (
      <AutoRow justify="center">
        {(approveState === ApprovalState.PENDING || approveState === ApprovalState.NOT_APPROVED) && (
          <ButtonPrimary width="50%" onClick={approveCallback}>
            Approve
          </ButtonPrimary>
        )}
        <ButtonPrimary
          width="50%"
          onClick={isStaking ? doStake : doWithdraw}
          disabled={
            isStaking
              ? Number(stakeState.typedValue) > Number(balance?.toSignificant(4))
              : Number(stakeState.typedValue) > Number(stakingInfo?.balance.toString())
          }
        >
          {isStaking ? 'Deposit' : 'Remove'}
        </ButtonPrimary>
      </AutoRow>
    );
  }, [stakeState, balance, isStaking, approveState]);

  const modalHeader = useCallback(() => {
    return (
      <AutoColumn gap="md">
        <RowBetween>
          <Text fontWeight={500}>Balance</Text>
          <Text fontWeight={500} color={theme.primary3}>
            {isStaking ? balance?.toSignificant() : stakingInfo?.balance}
          </Text>
        </RowBetween>
        <RowBetween style={{ background: theme.bg3, borderRadius: '6px' }}>
          <NumericalInput
            className="lp-amount-input"
            value={stakeState.typedValue}
            onUserInput={handleTypeInput}
            max={balance?.toSignificant()}
          />
          <MaxButton
            style={{
              border: theme.primary3,
              borderWidth: '1px',
              borderColor: theme.primary3,
              borderStyle: 'solid',
              borderRadius: '8px',
              color: theme.primary3,
              textAlign: 'center',
              alignItems: 'center',
              overflow: 'visible',
            }}
            width="fit-content"
            onClick={() => {
              onUserInput((isStaking ? balance?.toSignificant() : stakingInfo?.balance.toString()) ?? '');
            }}
          >
            <Text>MAX</Text>
          </MaxButton>
        </RowBetween>
      </AutoColumn>
    );
  }, [stakeState, balance, isStaking]);

  // const toggleWalletModal = useWalletModalToggle(); // toggle wallet when disconnected
  const confirmationContent = useCallback(() => {
    return (
      <AutoRow>
        <Tabs style={{ width: '100%', margin: '8px 14px' }}>
          <ButtonGray width="48%" onClick={() => swapStaking()}>
            Stake
          </ButtonGray>
          <ButtonGray width="48%" onClick={() => swapStaking()}>
            Unstake
          </ButtonGray>
        </Tabs>
        <ConfirmationModalContent
          title={isStaking ? 'Deposit' : 'Remove deposit'}
          onDismiss={onDismiss}
          topContent={modalHeader}
          bottomContent={modalBottom}
        />
      </AutoRow>
    );
  }, [stakeState, balance, approveState, isStaking]);

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
