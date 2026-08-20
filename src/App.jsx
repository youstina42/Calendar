import { useState } from 'react';
import CalendarPicker from './CalendarPicker';

export default function App() {
  const [dateRange, setDateRange] = useState(null);

  return (
    <div className="min-h-screen p-10 flex flex-col items-center justify-center gap-6">
      <h1 className="text-2xl font-bold text-gray-800">Date Range Picker</h1>

      <CalendarPicker
        width={400}
        label="Select Date Range"
        placeholder="Choose dates"
        horizontalPlacement="left"
        verticalPlacement="bottom"
        resetable={true}
        closeOnClickOutside={true}
        jumpToStartDateOnShortcutClick={true}
        customLocale="en"
        onApply={(selected) => {
          setDateRange(selected);
        }}
      />

      {dateRange && (
        <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 text-sm text-gray-700">
          <p>From: {dateRange.from ? dateRange.from.toDateString() : 'N/A'}</p>
          <p>To: {dateRange.to ? dateRange.to.toDateString() : 'N/A'}</p>
        </div>
      )}
    </div>
  );
}