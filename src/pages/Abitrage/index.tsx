import { GreyCard, LightCard } from '../../components/Card';
import { AutoColumn } from '../../components/Column';
import { AutoRow } from '../../components/Row';
import { useActiveWeb3React } from '../../hooks';
import { useEffect, useState } from 'react';
import { StyledHeading } from '../App';
import { PageWrapper } from '../Stake/styleds';
import { TYPE } from '../../theme';
import { ETHER, Token, WETH } from '@intercroneswap/v2-sdk';
import { ethAddress } from '@intercroneswap/java-tron-provider';
import CurrencyInputPanel from '../../components/CurrencyInputPanel';
import Input from '../../components/NumericalInput';
import { ButtonPrimary } from '../../components/Button';
import { unwrappedToken, wrappedCurrency } from '../../utils/wrappedCurrency';
import { AbitrageDetail } from '../../components/Abitrage/BotDetail';

export interface EarningData {
  token_address: string;
  freq_seconds: number;
  active: boolean;
}

export interface EarningConfig {
  token: Token;
  freq_seconds: number;
  active: boolean;
}

const configToRequest = (config: EarningConfig): EarningData => {
  return {
    token_address: ethAddress.toTron(config.token.address),
    freq_seconds: config.freq_seconds,
    active: config.active,
  };
};

export const AbitrageBots: React.FC = () => {
  const { chainId } = useActiveWeb3React();

  const [bots, setBots] = useState<EarningData[]>([]);
  const [selectedConfig, setSelectedConfig] = useState<EarningConfig>({
    token: wrappedCurrency(ETHER, chainId) ?? WETH[chainId ?? 11111],
    freq_seconds: 0,
    active: true,
  });

  useEffect(() => {
    getAllBots();
  }, []);

  const createBot = async (config: EarningConfig) => {
    const response = await fetch(`http://localhost:8080/abitrage/earning/create?chainId=${chainId}`, {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify(configToRequest(config)),
    });
    if (response.status == 200) {
      const newBots = bots.map((value) => {
        if (value.token_address === config.token.address) {
          value = configToRequest(config);
        }
        return value;
      });
      setBots(newBots);
    }
  };
  const deleteBot = async (config: EarningData) => {
    const response = await fetch(`http://localhost:8080/abitrage/earning/delete?chainId=${chainId}`, {
      method: 'DELETE',
      mode: 'cors',
      body: JSON.stringify(config),
    });
    if (response.status == 200) {
      const newBots = bots.filter((value, index, bots) => value.token_address === config.token_address);
      setBots(newBots);
    }
  };
  const updateBot = async (config: EarningData) => {
    const response = await fetch(`http://localhost:8080/abitrage/earning/update?chainId=${chainId}`, {
      method: 'PUT',
      mode: 'cors',
      body: JSON.stringify(config),
    });
    if (response.status == 200) {
      const newBots = bots.map((value) => {
        if (value.token_address === config.token_address) {
          value = config;
        }
        return value;
      });
      setBots(newBots);
    }
  };

  const getAllBots = async () => {
    const response = await fetch(`http://localhost:8080/abitrage/earning/getall?chainId=${chainId}`, {
      mode: 'cors',
    });
    const data = await response.json();

    const fetchedBots: EarningData[] = data.data.map((earning: any) => {
      const token_address = ethAddress.fromTron(earning.token_address);
      return {
        token_address,
        freq_seconds: earning.freq_seconds,
        active: earning.active,
      };
    });

    setBots(fetchedBots);
  };

  return (
    <>
      <StyledHeading>Abitrage Bots</StyledHeading>
      <PageWrapper gap="24px">
        <LightCard>
          <AutoColumn gap="24px">
            <GreyCard>
              <StyledHeading>Create bot</StyledHeading>
              <AutoColumn justify="center">
                <CurrencyInputPanel
                  hideInput={true}
                  hideBalance={true}
                  value=""
                  onUserInput={() => {
                    console.log('disabled');
                  }}
                  onCurrencySelect={(c) => {
                    setSelectedConfig({
                      ...selectedConfig,
                      token: wrappedCurrency(c, chainId ?? 11111) ?? WETH[11111],
                    });
                  }}
                  showMaxButton={false}
                  currency={unwrappedToken(selectedConfig.token)}
                  id="nft-payout-token"
                  showCommonBases
                />
                <AutoRow justify="space-around">
                  <TYPE.white>Frequency Seconds</TYPE.white>
                  <Input
                    style={{ width: '25%' }}
                    className="recipient-address-input"
                    type="number"
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    placeholder="Frequency Seconds"
                    error={false}
                    onUserInput={(value) =>
                      setSelectedConfig({
                        ...selectedConfig,
                        freq_seconds: Number(value),
                      })
                    }
                    value={selectedConfig?.freq_seconds}
                  />
                </AutoRow>
                <ButtonPrimary onClick={() => createBot(selectedConfig)}>Create Bot</ButtonPrimary>
              </AutoColumn>
            </GreyCard>
            <AutoRow justify="space-around">
              <TYPE.white>Token</TYPE.white>
              <TYPE.white>Frequency</TYPE.white>
              <TYPE.white>Active</TYPE.white>
              <TYPE.white>Activate</TYPE.white>
            </AutoRow>
            {bots.map((bot, index) => (
              <AbitrageDetail key={index} bot={bot} updateBot={updateBot} deleteBot={deleteBot} />
            ))}
          </AutoColumn>
        </LightCard>
      </PageWrapper>
    </>
  );
};
