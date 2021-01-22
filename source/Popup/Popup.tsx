import React, {useState, useEffect} from 'react';
import {browser} from 'webextension-polyfill-ts';
import debounce from 'lodash.debounce';

import './styles.scss';

import 'react-phone-number-input/style.css';
import flags from 'react-phone-number-input/flags';
import PhoneInput from 'react-phone-number-input';
import {LockFill} from 'react-bootstrap-icons';
import {History} from './History';
import {isHistoryEnabled, openNumber, setHistoryEnabled} from './utils';

const Popup: React.FC = () => {
  const [numberToChat, setNumberToChat] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // START PREFIX
  const [prefixValue, setPrefixValue] = useState<string>('');
  browser.storage.sync.get('prefixValue').then((result) => {
    setPrefixValue(result.prefixValue);
  });

  useEffect(() => {
    debounce(() => setIsLoading(false), 700)();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);
  const changePrefix = (valueFromWidget: string): void => {
    const value = valueFromWidget || '';
    if (prefixValue !== value) {
      setIsLoading(true);
      browser.storage.sync.set({prefixValue: value}).then(() => {
        setPrefixValue(value || '');
      });
    }
  };
  // END PREFIX

  const [historyEnabledLocal, setHistoryEnabledLocal] = useState(
    isHistoryEnabled()
  );
  // const [historyEnabled, setHistoryEnabled] = useState(false);

  const toggleHistory = (): void => {
    const newHistory = !historyEnabledLocal;
    setHistoryEnabled(newHistory);
    setHistoryEnabledLocal(newHistory);
  };

  return (
    <form
      onSubmit={(e): void => openNumber(e, `${prefixValue}${numberToChat}`)}
      className="container mx-auto space-y-4 text-sm"
    >
      <div className="grey-block">
        <label htmlFor="numberToCall" className="text-base">
          Quick Whatsapp Chat:
        </label>
      </div>
      {/* PHONE BLOCK */}
      <div className="phone-block">
        <div className="flex w-2/5">
          <PhoneInput
            id="Prefix"
            name="numberToCall"
            flags={flags}
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

      {/* HISTORY BLOCK */}
      <div className="flex px-3 flex-col">
        {historyEnabledLocal && <History />}
      </div>
      <div className="px-3 pb-2 flex flex-row-reverse">
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={historyEnabledLocal}
            onChange={toggleHistory}
            className=" h-4 w-4 border border-gray-300 rounded-md checked:bg-blue-600 
            checked:border-transparent focus:outline-none"
          />
          <span>
            History Enabled<span className="font-extralight"> (Beta)</span>
          </span>
        </label>
      </div>
      {/* START CHAT */}
      <div className="px-3 pb-2 flex flex-row-reverse">
        <input type="submit" className="btn btn-submit" value="Start chat" />
      </div>
    </form>
  );
};

export default Popup;
