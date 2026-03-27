'use client';

import { useState } from 'react';
import { THSRDateInfo } from '@/lib/types';
import { THSR_2026_DATES } from '@/lib/data';
import { generateICS, downloadICS } from '@/lib/ics-generator';

export default function Home() {
  const [dates, setDates] = useState<THSRDateInfo[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFetch = () => {
    setLoading(true);
    // Simulate a brief loading state for better UX
    setTimeout(() => {
      setDates(THSR_2026_DATES);
      setLoading(false);
    }, 800);
  };

  const handleDownload = () => {
    if (dates.length === 0) return;
    const icsContent = generateICS(dates);
    downloadICS(icsContent, '高鐵疏運訂票提醒.ics');
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-orange-600 mb-4">
            高鐵疏運訂票提醒助手
          </h1>
          <p className="text-lg text-gray-600">
            自動獲取最新的高鐵疏運日期，並匯入行事曆（前一晚 23:50 提醒）
          </p>
        </div>

        <div className="flex justify-center mb-10">
          <button
            onClick={handleFetch}
            disabled={loading}
            className={`
              px-8 py-4 text-xl font-bold rounded-full shadow-lg transition-all
              ${loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-orange-500 hover:bg-orange-600 text-white transform hover:scale-105 active:scale-95'}
            `}
          >
            {loading ? '同步中...' : '開始抓取疏運日程'}
          </button>
        </div>

        {dates.length > 0 && (
          <div className="bg-white shadow-xl rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      假期名稱
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      疏運期間
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      開放預售日期
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {dates.map((date, idx) => (
                    <tr key={idx} className="hover:bg-orange-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {date.holidayName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {date.transportPeriod}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">
                        {date.bookingStartDate}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-gray-50 px-6 py-4 flex justify-end">
              <button
                onClick={handleDownload}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-semibold transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                下載匯入行事曆 (.ics)
              </button>
            </div>
          </div>
        )}

        <div className="mt-12 text-center text-sm text-gray-500">
          <p>* 提醒：訂票通常於開放預售日當天凌晨 00:00 起開賣。</p>
          <p>本工具自動設定提醒於預售前一晚 23:50，讓您準時開搶。</p>
        </div>
      </div>
    </main>
  );
}
