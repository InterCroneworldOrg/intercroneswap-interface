import { GreyCard, LightCard } from '../../components/Card';
import React, { useState } from 'react';
import { StyledHeading } from '../App';
import { PageWrapper } from '../Stake/styleds';
import CurrencyInputPanel from '../../components/CurrencyInputPanel';
import { ETHER, Currency, TokenAmount, JSBI } from '@intercroneswap/v2-sdk';
import { Input } from '../../components/AddressInputPanel';
import { TYPE } from '../../theme';
import { ButtonPrimary } from '../../components/Button';
import { AutoColumn } from '../../components/Column';
import { useActiveWeb3React } from '../../hooks';
import { unwrappedToken, wrappedCurrency } from '../../utils/wrappedCurrency';
import { ICR } from '../../constants/tokens';
import { AutoRow } from '../../components/Row';
import CurrencyLogo from '../../components/CurrencyLogo';
import { BACKEND_URL } from '../../constants';

interface PayoutReport {
  holder_address: string;
  balance: number;
  payment: TokenAmount;
  payment_raw: string;
}

export const Management: React.FC = () => {
  const { chainId } = useActiveWeb3React();
  const [nftAddress, setNFTAddress] = useState('');
  const [paymentAmount, setPaymentAmount] = useState(1);
  const [currency, setCurrency] = useState<Currency>(ETHER);
  const [payoutReport, setPayoutReport] = useState<PayoutReport[]>([]);

  const fetchData = async () => {
    const jsonData = {
      nft_address: nftAddress,
      token: currency.symbol,
      amount: paymentAmount,
    };
    const response = await fetch(`${BACKEND_URL}/abitrage/payoutreport?chainId=${chainId}`, {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify(jsonData),
    });
    const data = await response.json();
    console.log(data.data);
    const reports: PayoutReport[] = data.data.map((payoutreport: any) => {
      return {
        holder_address: payoutreport.holder_address,
        balance: payoutreport.balance,
        payment: new TokenAmount(
          wrappedCurrency(currency, chainId) ?? ICR,
          JSBI.BigInt(payoutreport.payment.numerator),
        ),
        payment_raw: payoutreport.payment_raw,
      };
    });
    setPayoutReport(reports);
  };

  return (
    <>
      <StyledHeading>Abitron payouts</StyledHeading>
      <PageWrapper gap="24">
        <LightCard>
          <AutoColumn gap="24px">
            <CurrencyInputPanel
              value={paymentAmount.toString()}
              onUserInput={(value) => {
                setPaymentAmount(Number(value));
              }}
              onCurrencySelect={(c) => {
                setCurrency(c);
              }}
              showMaxButton={false}
              currency={currency}
              id="nft-payout-token"
              showCommonBases
            />
            <TYPE.white>NFT Address</TYPE.white>
            <Input
              className="recipient-address-input"
              type="text"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              placeholder="NFT Address"
              error={false}
              onChange={(e) => setNFTAddress(e.target.value)}
              value={nftAddress}
            />
            <AutoColumn gap="20px">
              <ButtonPrimary onClick={fetchData}>Payment report</ButtonPrimary>
              <ButtonPrimary>Payment</ButtonPrimary>
            </AutoColumn>
            {payoutReport && payoutReport.length > 0 && (
              <GreyCard style={{ marginTop: 20 }}>
                <StyledHeading>Payout report</StyledHeading>
                <AutoRow justify="space-between" padding="20px">
                  <TYPE.white style={{ width: '15rem' }}>Holder address</TYPE.white>
                  <TYPE.yellow>NFT tokens</TYPE.yellow>
                  <TYPE.white>Payout</TYPE.white>
                </AutoRow>
                {payoutReport.map((v) => {
                  return (
                    <GreyCard key={v.holder_address} padding="20px" style={{ margin: 14 }}>
                      <AutoRow justify="space-between">
                        <TYPE.white style={{ width: '15rem' }}>{v.holder_address}</TYPE.white>
                        <TYPE.yellow>{v.balance}</TYPE.yellow>
                        <AutoColumn justify="center">
                          <CurrencyLogo currency={unwrappedToken(v.payment.token)} />
                          <TYPE.white>{v.payment.toSignificant()}</TYPE.white>
                        </AutoColumn>
                      </AutoRow>
                    </GreyCard>
                  );
                })}
              </GreyCard>
            )}
          </AutoColumn>
        </LightCard>
      </PageWrapper>
    </>
  );
};
