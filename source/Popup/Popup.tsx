import React, {useState, useEffect} from 'react';
import {browser, Tabs} from 'webextension-polyfill-ts';
import debounce from 'lodash.debounce';

import './styles.scss';

import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
import {LockFill} from 'react-bootstrap-icons';

const Popup: React.FC = () => {
  const [numberToChat, setNumberToChat] = useState<string>('');
  const [prefixValue, setPrefixValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  browser.storage.sync.get('prefixValue').then((result) => {
    setPrefixValue(result.prefixValue);
  });

  function openWebPage(url: string): Promise<Tabs.Tab> {
    return browser.tabs.create({url});
  }

  const changePrefix = (valueFromWidget: string): void => {
    const value = valueFromWidget || '';
    if (prefixValue !== value) {
      setIsLoading(true);
      browser.storage.sync.set({prefixValue: value}).then(() => {
        setPrefixValue(value || '');
      });
    }
  };

  useEffect(() => {
    debounce(() => setIsLoading(false), 700)();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void = (
    event
  ) => {
    event.preventDefault();
    return openWebPage(
      `https://web.whatsapp.com/send?phone=${prefixValue}${numberToChat}`
    ).then(() => {
      window.close();
    });
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
      <div className="flex px-3 space-x-1">
        <div className="flex w-2/5">
          <PhoneInput
            id="Prefix"
            name="numberToCall"
            international
            value={prefixValue}
            className="w-10/12"
            // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
            onChange={changePrefix}
          />
          <div className="btn-lock-div w-2/12">
            {!isLoading && <LockFill className="wa-color" size={12} />}
          </div>
        </div>
        <div className="w-3/5 ">
          <input
            type="text"
            id="numberToCall"
            className="w-full"
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
      </div>
      <div className="px-3 pb-2 flex flex-row-reverse">
        <input type="submit" className="btn btn-blue" value="Start chat" />
      </div>
    </form>
  );
};

export default Popup;
