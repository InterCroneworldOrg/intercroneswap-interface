# InterCrone Frontend

> Install dependencies using **yarn**

## `apps/web`

<details>
<summary>
How to start
</summary>

```sh
nvm use 16.02.2
npm install
```

start the development server

```sh
yarn dev
```

build with production mode

```sh
yarn build

# start the application after build
yarn start
```

</details>

## Packages

| Package                                  | Description                                                                                                 |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| [sdk](/packages/swap-sdk)                | An SDK for building applications on top of Pancakeswap                                                      |
| [swap-sdk-core](/packages/swap-sdk-core) | Swap SDK Shared code                                                                                        |
| [wagmi](/packages/wagmi)                 | Extension for [wagmi](https://github.com/wagmi-dev/wagmi), including bsc chain and binance wallet connector |
| [awgmi](/packages/awgmi)                 | connect to Aptos with similar wagmi React hooks.                                                            |
