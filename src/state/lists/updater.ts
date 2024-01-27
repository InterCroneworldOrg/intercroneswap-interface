import { getVersionUpgrade, minVersionBump, VersionUpgrade } from '@intercroneswap/token-lists';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useActiveWeb3React } from '../../hooks';
import { useFetchListCallback } from '../../hooks/useFetchListCallback';
import useInterval from '../../hooks/useInterval';
import useIsWindowVisible from '../../hooks/useIsWindowVisible';
import { addPopup } from '../application/actions';
import { AppDispatch, AppState } from '../index';
import { acceptListUpdate } from './actions';

export default function Updater(): null {
  const { library } = useActiveWeb3React();
  const dispatch = useDispatch<AppDispatch>();
  const lists = useSelector<AppState, AppState['lists']['byUrl']>((state) => state.lists.byUrl);
  const selectedListUrl = useSelector<AppState, AppState['lists']['selectedListUrl']>(
    (state) => state.lists.selectedListUrl,
  );

  const isWindowVisible = useIsWindowVisible();

  const fetchList = useFetchListCallback();

  const fetchAllListsCallback = useCallback(() => {
    if (!isWindowVisible) return;

    const urls = Object.keys(lists);
    const maxRequestsPerSecond = 3;
    const delayBetweenRequests = 1000 / maxRequestsPerSecond; // Verzögerung in Millisekunden

    const fetchDataWithDelay = async (url: string, index: number) => {
      await new Promise((resolve) => setTimeout(resolve, index * delayBetweenRequests));
      fetchList(url).catch((error) => console.debug('interval list fetching error', error));
    };

    urls.forEach((url, index) => fetchDataWithDelay(url, index));
  }, [fetchList, isWindowVisible, lists]);

  useInterval(fetchAllListsCallback, library ? 1000 : null);

  // whenever a list is not loaded and not loading, try again to load it
  useEffect(() => {
    Object.keys(lists).forEach((listUrl) => {
      const list = lists[listUrl];

      if (!list.current && !list.loadingRequestId && !list.error) {
        fetchList(listUrl).catch((error) => console.debug('list added fetching error', error));
      }
    });
  }, [dispatch, fetchList, library, lists]);

  // automatically update lists if versions are minor/patch
  useEffect(() => {
    Object.keys(lists).forEach((listUrl) => {
      const list = lists[listUrl];
      if (list.current && list.pendingUpdate) {
        const bump = getVersionUpgrade(list.current.version, list.pendingUpdate.version);
        switch (bump) {
          case VersionUpgrade.NONE:
            throw new Error('unexpected no version bump');
          case VersionUpgrade.PATCH:
          case VersionUpgrade.MINOR:
            const min = minVersionBump(list.current.tokens, list.pendingUpdate.tokens);
            // automatically update minor/patch as long as bump matches the min update
            if (bump >= min) {
              dispatch(acceptListUpdate(listUrl));
              if (listUrl === selectedListUrl) {
                dispatch(
                  addPopup({
                    key: listUrl,
                    content: {
                      listUpdate: {
                        listUrl,
                        oldList: list.current,
                        newList: list.pendingUpdate,
                        auto: true,
                      },
                    },
                  }),
                );
              }
            } else {
              console.error(
                `List at url ${listUrl} could not automatically update because the version bump was only PATCH/MINOR while the update had breaking changes and should have been MAJOR`,
              );
            }
            break;

          case VersionUpgrade.MAJOR:
            if (listUrl === selectedListUrl) {
              dispatch(
                addPopup({
                  key: listUrl,
                  content: {
                    listUpdate: {
                      listUrl,
                      auto: false,
                      oldList: list.current,
                      newList: list.pendingUpdate,
                    },
                  },
                  removeAfterMs: null,
                }),
              );
            }
        }
      }
    });
  }, [dispatch, lists, selectedListUrl]);

  return null;
}
