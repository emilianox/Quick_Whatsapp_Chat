import React, {useState} from 'react';
import {browser, Tabs} from 'webextension-polyfill-ts';

import './styles.scss';

import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';

const Popup: React.FC = () => {
  const [numberToChat, setNumberToChat] = useState<string>('');
  const [prefixValue, setPrefixValue] = useState<string>('');
  chrome.storage.sync.get('prefixValue', (result) => {
    setPrefixValue(result.prefixValue);
  });

  function openWebPage(url: string): Promise<Tabs.Tab> {
    return browser.tabs.create({url});
  }

  const changePrefix = (valueFromWidget: string): void => {
    // const {value} = event.target;
    console.log('valueFromWidget', valueFromWidget);
    const value = valueFromWidget || '';
    console.log('value', value);

    chrome.storage.sync.set({prefixValue: value}, () => {
      setPrefixValue(value || '');
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
        <PhoneInput
          id="Prefix"
          name="numberToCall"
          international
          className="w-2/5"
          value={prefixValue}
          onChange={changePrefix}
        />

        <input
          type="text"
          id="numberToCall"
          className="w-3/5"
          name="numberToCall"
          placeholder="Number"
          spellCheck="false"
          autoComplete="off"
          /* eslint-disable jsx-a11y/no-autofocus */
          autoFocus
          value={numberToChat}
          onChange={(e): void => setNumberToChat(e.target.value)}
        />
      </div>
      <div className="px-3 pb-2 flex flex-row-reverse">
        <input type="submit" className="btn btn-blue" value="Start" />
      </div>
    </form>
  );
};

export default Popup;
