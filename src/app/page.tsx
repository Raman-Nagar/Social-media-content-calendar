"use client";

import React from "react";
import { addMonths, subMonths } from "date-fns";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { Calendar } from "@/components/Calendar";
import { DetailModal } from "@/components/DetailModal";
import { useCalendar } from "@/hooks/use-calendar";

export default function CalendarPage() {
  const {
    currentDate,
    setCurrentDate,
    handleExportExcel,
    isSidebarOpen,
    setIsSidebarOpen,
    pages,
    stats,
    selectedDates,
    selectedCategories,
    followerRange,
    numberOfDates,
    setSelectedDates,
    setSelectedCategories,
    setFollowerRange,
    setNumberOfDates,
    handleGenerateRandomDates,
    calendarDays,
    isGenerating,
    handleDateSelect,
    handleGenerateCalendar,
    handleDayClick,
    isModalOpen,
    selectedDayDetail,
    setIsModalOpen,
    handleExportDay,
  } = useCalendar();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        currentDate={currentDate}
        onPreviousMonth={() => setCurrentDate((prev) => subMonths(prev, 1))}
        onNextMonth={() => setCurrentDate((prev) => addMonths(prev, 1))}
        onExportExcel={handleExportExcel}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isExporting={false}
      />

      <div className="flex min-h-screen">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          pages={pages}
          stats={stats}
          selectedDates={selectedDates}
          selectedCategories={selectedCategories}
          followerRange={followerRange}
          numberOfDates={numberOfDates}
          onDatesChange={setSelectedDates}
          onCategoriesChange={setSelectedCategories}
          onFollowerRangeChange={setFollowerRange}
          onNumberOfDatesChange={setNumberOfDates}
          onGenerateRandomDates={handleGenerateRandomDates}
          onRemoveDate={(date) =>
            setSelectedDates((prev) => prev.filter((d) => d !== date))
          }
        />

        <Calendar
          currentDate={currentDate}
          calendarDays={calendarDays}
          selectedDates={selectedDates}
          isGenerating={isGenerating}
          onDateSelect={handleDateSelect}
          onGenerateCalendar={handleGenerateCalendar}
          onClearSelection={() => setSelectedDates([])}
          onDayClick={handleDayClick}
        />
      </div>

      <DetailModal
        isOpen={isModalOpen}
        dayDetail={selectedDayDetail}
        onClose={() => setIsModalOpen(false)}
        onExportDay={handleExportDay}
      />
    </div>
  );
}
