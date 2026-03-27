import { format, parse, addMinutes } from 'date-fns';
import { THSRDateInfo } from './types';

export function generateICS(dates: THSRDateInfo[]): string {
  const events = dates.map((dateInfo, index) => {
    // 解析 "2026/01/16 (五)" -> 2026-01-16
    const dateStr = dateInfo.bookingStartDate.match(/\d{4}\/\d{2}\/\d{2}/)?.[0];
    if (!dateStr) return '';

    // 建立本地時間：預售當天凌晨 00:00
    const bookingDate = parse(dateStr, 'yyyy/MM/dd', new Date());
    
    // 設定提醒為前一晚 23:50 (本地時間)
    // 台灣為 UTC+8，所以本地 23:50 等於 UTC 當天的 15:50
    const reminderStart = new Date(bookingDate);
    reminderStart.setDate(reminderStart.getDate() - 1);
    reminderStart.setHours(23, 50, 0, 0);
    
    const reminderEnd = addMinutes(reminderStart, 10);

    // 轉換為 ICS 要求的 UTC 格式: YYYYMMDDTHHMMSSZ
    const toUTCString = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    // 生成唯一識別碼
    const uid = `${Date.now()}-${index}@railway-calendar.github.io`;

    return `BEGIN:VEVENT
UID:${uid}
DTSTAMP:${toUTCString(new Date())}
DTSTART:${toUTCString(reminderStart)}
DTEND:${toUTCString(reminderEnd)}
SUMMARY:[高鐵訂票提醒] ${dateInfo.holidayName}
DESCRIPTION:疏運期間：${dateInfo.transportPeriod}\\n預售開始日：${dateInfo.bookingStartDate} 00:00\\n\\n本提醒設定於開賣前 10 分鐘。
BEGIN:VALARM
ACTION:DISPLAY
DESCRIPTION:高鐵訂票提醒: ${dateInfo.holidayName}
TRIGGER:-PT0M
END:VALARM
END:VEVENT`;
  });

  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Railway Calendar//THSR//TW
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:高鐵疏運訂票提醒
X-WR-TIMEZONE:Asia/Taipei
${events.filter(e => e !== '').join('\n')}
END:VCALENDAR`;
}

export function downloadICS(content: string, filename: string = 'thsr-reminders.ics') {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
