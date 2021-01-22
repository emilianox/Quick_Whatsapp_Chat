import React from 'react';

import TimeAgo from 'javascript-time-ago';

// English.
import en from 'javascript-time-ago/locale/en';

import ReactTimeAgo from 'react-time-ago';

import {formatPhoneNumberIntl} from 'react-phone-number-input';
// eslint-disable-next-line import/no-cycle
import {openNumber} from './utils';

// @ts-expect-error
TimeAgo.addDefaultLocale(en);

export interface HistoryItemData {
  time: Date;
  telNumber: string;
}

export const HistoryItem: React.FC<HistoryItemData> = ({time, telNumber}) => {
  return (
    <tr className="history-item">
      <td className="pl-3 pr-3 whitespace-no-wrap" data-tip="hello world">
        <div className="text-gray-500 text-center">
          <ReactTimeAgo date={time} locale="en-US" timeStyle="round-minute" />
        </div>
      </td>
      <td className="px-2 py-2 whitespace-no-wrap">
        <div className="leading-5 pl-8 text-gray-900">
          <a
            className="text-blue-500 hover:underline"
            aria-hidden="true"
            onClick={(e): void => openNumber(e, `${telNumber}`)}
          >
            {formatPhoneNumberIntl(telNumber)}
          </a>
        </div>
      </td>
    </tr>
  );
};
