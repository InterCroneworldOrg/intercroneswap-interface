import { ChainId } from '@intercroneswap/v2-sdk';
import { useContext } from 'react';
import styled, { ThemeContext } from 'styled-components';
import Modal from '../Modal';
import { Divider, ExternalLink, TYPE } from '../../theme';
import {
  CloseIcon,
  // CustomLightSpinner
} from '../../theme/components';
import Row, { RowBetween } from '../Row';
import { AlertTriangle, ArrowUpCircle } from 'react-feather';
import { ButtonPrimary } from '../Button';
import { AutoColumn, ColumnCenter } from '../Column';
// import Circle from '../../assets/images/blue-loader.svg';

import { getEtherscanLink } from '../../utils';
import { useActiveWeb3React } from '../../hooks';

const Wrapper = styled.div`
  width: 100%;
`;
const Section = styled(AutoColumn)`
  padding: 24px;
`;

const BottomSection = styled(Section)`
  background-color: ${({ theme }) => theme.bg1};
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
`;

const ConfirmedIcon = styled(ColumnCenter)`
  padding: 60px 0;
`;

function ConfirmationPendingContent({ onDismiss, pendingText }: { onDismiss: () => void; pendingText: string }) {
  const theme = useContext(ThemeContext);

  return (
    <Wrapper>
      <Section>
        <RowBetween>
          {/* <div /> */}
          <TYPE.white fontWeight={500} fontSize={20}>
            Waiting For Confirmation
          </TYPE.white>
          <CloseIcon onClick={onDismiss} />
        </RowBetween>
        <ConfirmedIcon>
          {/* <CustomLightSpinner src={Circle} alt="loader" size={'90px'} /> */}
          <div className="lds-spinner">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </ConfirmedIcon>

        <AutoColumn gap="12px" justify={'center'}>
          <AutoColumn gap="12px" justify={'center'}>
            <Row>
              {pendingText.split(' ').map((text, i) => {
                return (
                  <TYPE.white
                    key={text}
                    fontWeight={600}
                    fontSize={14}
                    color={[0, 3].includes(i) ? '' : theme.primary3}
                    textAlign="center"
                  >
                    {text} &nbsp;
                  </TYPE.white>
                );
              })}
            </Row>
            {/* <Text fontWeight={600} fontSize={14} color="" textAlign="center">
              {pendingText}
            </Text> */}
          </AutoColumn>
          <TYPE.white fontSize={12} textAlign="center">
            Confirm this transaction in your wallet
          </TYPE.white>
        </AutoColumn>
      </Section>
    </Wrapper>
  );
}

function TransactionSubmittedContent({
  onDismiss,
  chainId,
  hash,
}: {
  onDismiss: () => void;
  hash: string | undefined;
  chainId: ChainId;
}) {
  const theme = useContext(ThemeContext);

  return (
    <Wrapper>
      <Section>
        <RowBetween>
          <div />
          <CloseIcon onClick={onDismiss} />
        </RowBetween>
        <ConfirmedIcon>
          <ArrowUpCircle strokeWidth={0.5} size={90} color={theme.primary3} />
        </ConfirmedIcon>
        <AutoColumn gap="12px" justify={'center'}>
          <TYPE.white fontWeight={500} fontSize={20}>
            Transaction Submitted
          </TYPE.white>
          {chainId && hash && (
            <ExternalLink href={getEtherscanLink(chainId, hash, 'transaction')}>
              <TYPE.white fontWeight={500} fontSize={14} color={theme.primary3}>
                View on Tronscan
              </TYPE.white>
            </ExternalLink>
          )}
          <ButtonPrimary onClick={onDismiss} style={{ margin: '20px 0 0 0' }}>
            <TYPE.white fontWeight={500} fontSize={20}>
              Close
            </TYPE.white>
          </ButtonPrimary>
        </AutoColumn>
      </Section>
    </Wrapper>
  );
}

export function ConfirmationModalContent({
  title,
  bottomContent,
  onDismiss,
  topContent,
}: {
  title: string;
  onDismiss: () => void;
  topContent: () => React.ReactNode;
  bottomContent: () => React.ReactNode;
}) {
  return (
    <Wrapper>
      <Section>
        <RowBetween>
          <TYPE.white fontWeight={500} fontSize={20}>
            {title}
          </TYPE.white>
          <CloseIcon onClick={onDismiss} />
        </RowBetween>
        {topContent()}
        <Divider />
      </Section>
      <BottomSection gap="12px">{bottomContent()}</BottomSection>
    </Wrapper>
  );
}

export function TransactionErrorContent({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  const theme = useContext(ThemeContext);
  return (
    <Wrapper>
      <Section>
        <RowBetween>
          <TYPE.white fontWeight={500} fontSize={20}>
            Error
          </TYPE.white>
          <CloseIcon onClick={onDismiss} />
        </RowBetween>
        <AutoColumn style={{ marginTop: 20, padding: '2rem 0' }} gap="24px" justify="center">
          <AlertTriangle color={theme.red1} style={{ strokeWidth: 1.5 }} size={64} />
          <TYPE.white fontWeight={500} fontSize={16} color={theme.red1} style={{ textAlign: 'center', width: '85%' }}>
            {message}
          </TYPE.white>
        </AutoColumn>
      </Section>
      <BottomSection gap="12px">
        <ButtonPrimary onClick={onDismiss}>Dismiss</ButtonPrimary>
      </BottomSection>
    </Wrapper>
  );
}

interface ConfirmationModalProps {
  isOpen: boolean;
  onDismiss: () => void;
  hash: string | undefined;
  content: () => React.ReactNode;
  attemptingTxn: boolean;
  pendingText: string;
}

export default function TransactionConfirmationModal({
  isOpen,
  onDismiss,
  attemptingTxn,
  hash,
  pendingText,
  content,
}: ConfirmationModalProps) {
  const { chainId } = useActiveWeb3React();

  if (!chainId) return null;

  // confirmation screen
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} maxHeight={90}>
      {attemptingTxn ? (
        <ConfirmationPendingContent onDismiss={onDismiss} pendingText={pendingText} />
      ) : hash ? (
        <TransactionSubmittedContent chainId={chainId} hash={hash} onDismiss={onDismiss} />
      ) : (
        content()
      )}
    </Modal>
  );
}
