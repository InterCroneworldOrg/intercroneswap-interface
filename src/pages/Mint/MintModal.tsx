import { useTransactionAdder } from '../../state/transactions/hooks';
import { DEFAULT_FEE_LIMIT } from '../../tron-config';
import ReactGA from 'react-ga';
import { getArbiMintContract } from '../../utils';
import { TransactionResponse } from '@ethersproject/abstract-provider';
import { useActiveWeb3React } from '../../hooks';
import { ArbiNFTInfo, useAbiBotActionHandlers, useAbiBotState } from '../../state/abibot/hooks';
import { ApprovalState, useApproveCallback } from '../../hooks/useApproveCallback';
import { useCallback, useContext, useEffect, useState } from 'react';
import { AutoColumn } from '../../components/Column';
import { ButtonConfirmed, ButtonPrimary } from '../../components/Button';
import { AutoRow, RowBetween, RowFixed } from '../../components/Row';
import { Loader } from 'react-feather';
import { ThemeContext } from 'styled-components';
import TransactionConfirmationModal, { ConfirmationModalContent } from '../../components/TransactionConfirmationModal';
import { GreyCard } from '../../components/Card';
import { TruncatedText } from '../../components/swap/styleds';
import { ETHER, JSBI } from '@intercroneswap/v2-sdk';
import CurrencyLogo from '../../components/CurrencyLogo';
import { ethAddress } from '@intercroneswap/java-tron-provider';
import { TYPE } from '../../theme';

export interface MintModalProps {
  isOpen: boolean;
  onDismiss: () => void;
  mintInfo: ArbiNFTInfo | undefined;
}

export default function MintModal({ isOpen, onDismiss, mintInfo }: MintModalProps) {
  const { account, chainId, library } = useActiveWeb3React();
  const { onTxHashChange, onAttemptingTxn } = useAbiBotActionHandlers();
  const theme = useContext(ThemeContext);

  console.log(mintInfo, 'mintInfo');

  const mintState = useAbiBotState();

  const addTransaction = useTransactionAdder();
  async function doMint() {
    if (!chainId || !library || !account) {
      return;
    }

    const address = ethAddress.toTron(mintInfo?.mintAddress);
    console.log(address, 'ethaddress');

    const arbiNFTContract = getArbiMintContract(chainId, address, library, account);

    const estimate = arbiNFTContract.estimateGas.mint;
    const method: (...args: any) => Promise<TransactionResponse> = arbiNFTContract.mint;
    const args: Array<string | string[] | number> = [mintState.typedValue];

    onAttemptingTxn(true);

    await estimate(...args, {}).then(() => {
      method(...args, {
        ...{},
        gasLimit: DEFAULT_FEE_LIMIT,
      })
        .then((response) => {
          onAttemptingTxn(false);
          addTransaction(response, {
            summary: `Minted ${mintState.typedValue}`,
          });

          ReactGA.event({
            category: 'Abitrage Mint',
            action: 'mint',
            label: mintInfo?.mintAddress,
          });

          onTxHashChange(response.hash);
        })
        .catch((err) => {
          onAttemptingTxn(false);
          if (err?.code !== 4001) console.error(err);
        });
    });
  }

  const [approval, approveCallback] = useApproveCallback(mintInfo?.cost, mintInfo?.mintAddress);

  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false);

  useEffect(() => {
    if (approval === ApprovalState.PENDING) {
      setApprovalSubmitted(true);
    }
  }, [approval, approvalSubmitted]);

  const modalBottom = useCallback(() => {
    return (
      <AutoColumn justify="center">
        {approval === ApprovalState.PENDING || approval === ApprovalState.NOT_APPROVED ? (
          <ButtonConfirmed
            onClick={approveCallback}
            disabled={approval !== ApprovalState.NOT_APPROVED || approvalSubmitted}
            width="48%"
            altDisabledStyle={approval === ApprovalState.PENDING} // show solid button while waiting
            confirmed={approval !== ApprovalState.PENDING && approval !== ApprovalState.NOT_APPROVED}
          >
            {approval === ApprovalState.PENDING ? (
              <AutoRow gap="6px" justify="center">
                Approving <Loader stroke="white" />
              </AutoRow>
            ) : (
              'Approve'
            )}
          </ButtonConfirmed>
        ) : (
          <ButtonPrimary width="50%" onClick={doMint}>
            Mint
          </ButtonPrimary>
        )}
      </AutoColumn>
    );
  }, [mintInfo]);

  const modalHeader = useCallback(() => {
    return (
      <AutoColumn gap="md">
        <GreyCard style={{ padding: '15px' }}>
          <RowFixed>
            <TruncatedText>{mintInfo?.cost.multiply(JSBI.BigInt(mintState.typedValue)).toSignificant(4)}</TruncatedText>
          </RowFixed>
          <RowFixed>
            <CurrencyLogo currency={ETHER} />
            <TYPE.white>{ETHER.symbol}</TYPE.white>
          </RowFixed>
        </GreyCard>
        <RowBetween style={{ background: theme.bg3, borderRadius: '6px' }}></RowBetween>
      </AutoColumn>
    );
  }, [mintInfo]);

  const confirmationContent = useCallback(() => {
    return (
      <ConfirmationModalContent
        title="Abiswap Mint"
        onDismiss={onDismiss}
        topContent={modalHeader}
        bottomContent={modalBottom}
      />
    );
  }, []);

  const pendingText = `Minting ${mintState.typedValue} arbiBot NFTs`;

  return (
    <TransactionConfirmationModal
      isOpen={isOpen}
      onDismiss={onDismiss}
      attemptingTxn={mintState.attemptingTxn}
      hash={mintState.txHash}
      content={confirmationContent}
      pendingText={pendingText}
    />
  );
}
