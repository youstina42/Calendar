import { useState, useRef, useEffect } from "react";
import {
    format,
    subDays,
    subYears,
    startOfDay,
    endOfDay,
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    isWithinInterval,
} from "date-fns";
import {enUS,arSA } from "date-fns/locale";
import {
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

const LOCALES = { en: enUS, ar: arSA };

export default function CalendarPicker({
    width = 400,
    horizontalPlacement = "start",
    verticalPlacement = "bottom",
    label = "Select Range",
    placeholder = "Select date range",
    value = null,
    resetable = true,
    closeOnClickOutside = true,
    iconOnlyTrigger = false,
    isMobile = false,
    hasBackdrop = false,
    disabled = false,
    disabledApplyBtn = false,
    jumpToStartDate = true,
    customLocale = "en",
    preDefinedRanges = [
    {
        label: "Today",
        range: { from: startOfDay(new Date()), to: endOfDay(new Date()) },
    },
    {
        label: "Last 3 days",
        range: { from: subDays(new Date(), 2), to: new Date() },
    },
    {
        label: "Last 7 days",
        range: { from: subDays(new Date(), 6), to: new Date() },
    },
    {
        label: "Last 10 days",
        range: { from: subDays(new Date(), 9), to: new Date() },
    },
    {
        label: "Last 30 days",
        range: { from: subDays(new Date(), 29), to: new Date() },
    },
    {
        label: "Last 60 days",
        range: { from: subDays(new Date(), 59), to: new Date() },
    },
    {
        label: "Last 90 days",
        range: { from: subDays(new Date(), 89), to: new Date() },
    },
    {
        label: "Last 120 days",
        range: { from: subDays(new Date(), 119), to: new Date() },
    },
    {
        label: "Last 365 days",
        range: { from: subYears(new Date(), 1), to: new Date() },
    },
    { 
        label: "Custom", range: null
    },
    ],
    shouldSelectOneDate = false,
    onApply = (val) => console.log("Selected:", val),
}) {
    const [appliedPreset, setAppliedPreset] = useState("Today");
    const [isOpen, setIsOpen] = useState(false);
    const [selectedRange, setSelectedRange] = useState(
        value || (shouldSelectOneDate ? new Date() : {
                    from: startOfDay(new Date()),
                    to: endOfDay(new Date()),
                })
    );
    const [activePreset, setActivePreset] = useState("Today");
    const [currentMonth, setCurrentMonth] = useState(
        value?.from || value || new Date(),
    );

    const containerRef = useRef(null);
    const activeLocale = LOCALES[customLocale] || enUS;

  //close onclick outside
    useEffect(() => {
        if (!closeOnClickOutside) return;
        const handleClickOutside = (event) => {
        if (
            containerRef.current &&
            !containerRef.current.contains(event.target)
        ) {
            setIsOpen(false);
        }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [closeOnClickOutside]);

    const handleShortcutClick = (preset) => {
        setActivePreset(preset.label);
        if (preset.label === "Custom") {
            setSelectedRange(null);
            return;
        }
        if (shouldSelectOneDate) {
        const singleDate = preset.range?.from || preset.range;
        setSelectedRange(singleDate);
        if (jumpToStartDate && singleDate)
            setCurrentMonth(singleDate);
        } else {
        setSelectedRange(preset.range);
        if (jumpToStartDate && preset.range?.from) {
            setCurrentMonth(preset.range.from);
        }
        }
    };

  //date selection
    const handleDayClick = (day) => {
        setActivePreset("Custom");
        if (shouldSelectOneDate) {
        setSelectedRange(day);
        } else {
        if (!selectedRange?.from || (selectedRange.from && selectedRange.to)) {
            setSelectedRange({ from: day, to: null });
        } else if (day < selectedRange.from) {
            setSelectedRange({ from: day, to: selectedRange.from });
        } else {
            setSelectedRange({ from: selectedRange.from, to: day });
        }
        }
    };

  //reset
    const handleReset = () => {
        setSelectedRange(shouldSelectOneDate ? null : { from: null, to: null });
        setActivePreset(null);
        setAppliedPreset(null);
    };

    const renderDays = () => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(monthEnd);

    const days = eachDayOfInterval({ start: startDate, end: endDate });

    return days.map((day, idx) => {
        const isSelected = shouldSelectOneDate
            ? selectedRange && isSameDay(day, selectedRange)
            : (selectedRange?.from && isSameDay(day, selectedRange.from)) ||
            (selectedRange?.to && isSameDay(day, selectedRange.to));

        const isInRange =
            !shouldSelectOneDate &&
            selectedRange?.from &&
            selectedRange?.to &&
            isWithinInterval(day, {
            start: selectedRange.from,
            end: selectedRange.to,
            });

        const isCurrentMonth = isSameMonth(day, currentMonth);

        return (
            <button
            key={idx}
            onClick={() => handleDayClick(day)}
            className={`h-9 w-9 text-sm rounded-full flex items-center justify-center transition-all ${
                !isCurrentMonth
                ? "text-gray-300"
                : "text-gray-700 hover:bg-gray-100"
            } $${isInRange && !isSelected ? "bg-gray-100 text-gray-800 rounded-none" : ""} ${
                isSelected
                ? "bg-blue-600 text-white font-bold hover:bg-blue-700"
                : ""
            }`}
            >
            {format(day, "d")}
            </button>
        );
        });
    };

    //input text
    const getInputValue = () => {
    let dateText = "";

    if (shouldSelectOneDate) {
        dateText = selectedRange ? format(selectedRange, "PP", { locale: activeLocale }) : "";
    } else if (selectedRange?.from && selectedRange?.to) {
        dateText = `${format(selectedRange.from, "MMM d", { locale: activeLocale })} - ${format(selectedRange.to, "MMM d", { locale: activeLocale })}`;
    } else if (selectedRange?.from) {
        dateText = format(selectedRange.from, "MMM d", { locale: activeLocale });
    }

    if (!dateText) return "";

    return appliedPreset ? `${appliedPreset}: ${dateText}` : dateText;
    };

    const getPlacementClasses = () => {
        if (isMobile) return "fixed inset-x-4 top-1/2 -translate-y-1/2 z-50";
        let classes = "absolute z-40 ";
        classes +=
        verticalPlacement === "top" ? "bottom-full mb-2 " : "top-full mt-2 ";
        if (horizontalPlacement === "right") classes += "right-0";
        else if (horizontalPlacement === "center")
        classes += "left-1/2 -translate-x-1/2";
        else classes += "left-0";
        return classes;
    };

    return (
        <div
        ref={containerRef}
        className="relative inline-block text-left"
        style={{ width: iconOnlyTrigger ? "auto" : width }}
        >
        {!iconOnlyTrigger && label && (
            <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
            </label>
        )}

        <button
            type="button"
            disabled={disabled}
            onClick={() => setIsOpen(!isOpen)}
            className={`flex items-center justify-between border rounded-lg p-2.5 text-sm bg-white shadow-sm transition-all ${
            disabled
                ? "bg-gray-100 cursor-not-allowed opacity-60"
                : "hover:border-blue-500 focus:ring-2 focus:ring-blue-500"
            } ${iconOnlyTrigger ? "w-10 h-10 justify-center p-0" : "w-full"}`}
        >
            <div className="flex items-center gap-2 overflow-hidden">
            <CalendarIcon className="w-4 h-4 text-gray-500 shrink-0" />
            {!iconOnlyTrigger && (
                <span
                className={
                    getInputValue() ? "text-gray-900 font-medium" : "text-gray-400"
                }
                >
                {getInputValue() || placeholder}
                </span>
            )}
            </div>
        </button>

        {isOpen && (hasBackdrop || isMobile) && (
            <div
            className="fixed inset-0 bg-black/40 z-30 transition-opacity"
            onClick={() => setIsOpen(false)}
            />
        )}

        {isOpen && (
            <div
            className={`bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden ${getPlacementClasses()}`}
            >
            <div className="flex flex-col sm:flex-row">
                <div className="flex flex-row sm:flex-col w-full sm:w-40 p-2 border-b sm:border-b-0 sm:border-r border-gray-100 bg-gray-50/50 gap-1 overflow-x-auto">
                {preDefinedRanges.map((preset) => (
                    <button
                    key={preset.label}
                    onClick={() => handleShortcutClick(preset)}
                    className={`text-left text-xs font-medium px-3 py-2 rounded-lg whitespace-nowrap transition-colors ${
                        activePreset === preset.label
                        ? "bg-blue-50 text-blue-600 font-semibold"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                    >
                    {preset.label}
                    </button>
                ))}
                </div>

                <div className="p-4 w-72">
                <div className="flex items-center justify-between mb-4">
                    <button
                    onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                    className="p-1 rounded-full hover:bg-gray-100"
                    >
                    <ChevronLeft className="w-4 h-4 text-gray-600" />
                    </button>
                    <span className="text-sm font-semibold text-gray-800">
                    {format(currentMonth, "MMMM yyyy", { locale: activeLocale })}
                    </span>
                    <button
                    onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                    className="p-1 rounded-full hover:bg-gray-100"
                    >
                    <ChevronRight className="w-4 h-4 text-gray-600" />
                    </button>
                </div>

                <div className="grid grid-cols-7 text-center text-xs font-semibold mb-2">
                    {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                    <div key={d}>{d}</div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-y-1 justify-items-center">
                    {renderDays()}
                </div>
                </div>
            </div>

            <div className="flex items-center justify-between p-3 border-t border-gray-100 bg-white">
                <div>
                {resetable && (
                    <button
                    onClick={handleReset}
                    className="text-xs font-medium text-gray-500 hover:text-gray-700"
                    >
                    Reset
                    </button>
                )}
                </div>
                <div className="flex items-center gap-2">
                <button
                    onClick={() => setIsOpen(false)}
                    className="px-3 py-1.5 text-xs font-medium text-gray-600 border rounded-lg hover:bg-gray-50"
                >
                    Cancel
                </button>
                <button
                    disabled={disabledApplyBtn}
                    onClick={() => {
                    setAppliedPreset(activePreset);
                    onApply(selectedRange);
                    setIsOpen(false);
                    }}
                    className={`px-3 py-1.5 text-xs font-medium text-white rounded-lg transition-colors ${
                    disabledApplyBtn
                        ? "bg-blue-300 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                >
                    Apply
                </button>
                </div>
            </div>
            </div>
        )}
        </div>
    );
    }
