import React, {useState} from 'react';
import {browser, Tabs} from 'webextension-polyfill-ts';

import './styles.scss';

const Popup: React.FC = () => {
  const [numberToChat, setNumberToChat] = useState<string>('');
  const [prefixValue, setPrefixValue] = useState<string>('');
  chrome.storage.sync.get('prefixValue', (result) => {
    setPrefixValue(result.prefixValue);
  });

  function openWebPage(url: string): Promise<Tabs.Tab> {
    return browser.tabs.create({url});
  }

  const changePrefix = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const {value} = event.target;
    chrome.storage.sync.set({prefixValue: value}, () => {
      setPrefixValue(value);
    });
  };

  const handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void = (
    event
  ) => {
    event.preventDefault();
    return openWebPage(
      `https://web.whatsapp.com/send?phone=${prefixValue}${numberToChat}`
    );
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="container mx-auto space-y-4 text-sm"
    >
      <div className="grey-block">
        <label htmlFor="numberToCall" className="text-base">
          Quick Whatsapp Chat:
        </label>
      </div>
      <div className="px-3 flex space-x-1">
        <input
          type="text"
          id="Prefix"
          placeholder="Optional Prefix"
          name="numberToCall"
          className="w-2/5 focus:outline-none"
          spellCheck="false"
          autoComplete="off"
          value={prefixValue}
          onChange={changePrefix}
          required
        />
        <input
          type="text"
          id="numberToCall"
          className="w-3/5 focus:outline-none"
          name="numberToCall"
          placeholder="Number"
          spellCheck="false"
          autoComplete="off"
          /* eslint-disable jsx-a11y/no-autofocus */
          autoFocus
          value={numberToChat}
          onChange={(e): void => setNumberToChat(e.target.value)}
          required
        />
      </div>
      <div className="px-3 pb-2 flex flex-row-reverse">
        <input type="submit" className="btn btn-blue" value="Start" />
      </div>
    </form>
  );
};

export default Popup;
