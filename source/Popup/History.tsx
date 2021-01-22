import React, {useState} from 'react';
import {CaretDown, CaretLeftFill} from 'react-bootstrap-icons';
import {HistoryItem} from './HistoryItem';
import {getHistory, isHistoryTableOpen, setHistoryTableOpen} from './utils';

export const History: React.FunctionComponent = () => {
  const [isHistoryOpen, setIsHistoryOpen] = useState(isHistoryTableOpen());
  const showHistory = (): void => {
    setIsHistoryOpen(!isHistoryOpen);
    return setHistoryTableOpen(!isHistoryOpen);
  };
  return (
    <>
      <div
        className=" flex flex-row justify-between bg-white text-sm text-gray-500
                     font-bold px-5 py-2 shadow border-b border-gray-300"
      >
        <span>
          History<span className="font-light"> [{getHistory().length}/10]</span>
        </span>
        <a aria-hidden="true" onClick={showHistory}>
          {isHistoryOpen ? <CaretDown /> : <CaretLeftFill />}
        </a>
      </div>

      <div
        className="w-full h-full overflow-auto shadow bg-white"
        id="journal-scroll"
      >
        <table className="w-full">
          {isHistoryOpen && (
            <tbody className="">
              {getHistory().map((data) => (
                <HistoryItem
                  key={`${data.telNumber}-${data.time}`}
                  telNumber={data.telNumber}
                  time={data.time}
                />
              ))}
            </tbody>
          )}
        </table>
      </div>
    </>
  );
};
