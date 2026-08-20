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
        value={dateRange}
        onApply={(selected) => {
          setDateRange(selected);
        }}
      />

    </div>
  );
}