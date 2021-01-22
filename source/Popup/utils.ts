import {browser, Tabs} from 'webextension-polyfill-ts';
import {local} from 'brownies';
// eslint-disable-next-line import/no-cycle
import {HistoryItemData} from './HistoryItem';

export const openWebPage = (url: string): Promise<Tabs.Tab> =>
  browser.tabs.create({url});

export const setHistoryTableOpen = (enable: boolean): void => {
  local.isHistoryTableOpen = enable;
};

export const isHistoryTableOpen = (): boolean =>
  local.isHistoryTableOpen ? local.isHistoryTableOpen : false;

export const getHistory = (): HistoryItemData[] =>
  local.history ? local.history : [];

export const addToHistory = (item: HistoryItemData): void => {
  local.history = [...getHistory(), item].slice(-10);
};

export const removeAllHistory = (): void => {
  delete local.history;
};

export const setHistoryEnabled = (enable: boolean): void => {
  local.isHistoryEnabled = enable;
  if (!enable) {
    removeAllHistory();
  }
};
export const isHistoryEnabled = (): boolean =>
  local.isHistoryEnabled ? local.isHistoryEnabled : false;

export const openNumber: (
  event: React.SyntheticEvent,
  phoneNumber: string
) => void = (event, phoneNumber) => {
  event.preventDefault();
  if (isHistoryEnabled()) {
    addToHistory({
      telNumber: phoneNumber,
      time: new Date(),
    });
  }
  return openWebPage(`https://web.whatsapp.com/send?phone=${phoneNumber}`).then(
    () => {
      window.close();
    }
  );
};
