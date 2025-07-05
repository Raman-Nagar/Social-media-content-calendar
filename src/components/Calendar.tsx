import { Button } from "@/ui/button";
import { RefreshCw, X, Calendar as CalendarIcon } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from "date-fns";
import { getCategoryIndicatorColor } from "@/lib/utils";

interface PostSummary {
  category: string;
  count: number;
  color: string;
}

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isSelected: boolean;
  hasPosts: boolean;
  posts: PostSummary[];
  totalPosts: number;
}

interface CalendarProps {
  currentDate: Date;
  calendarDays: CalendarDay[];
  selectedDates: string[];
  isGenerating: boolean;
  onDateSelect: (date: Date) => void;
  onGenerateCalendar: () => void;
  onClearSelection: () => void;
  onDayClick: (date: Date) => void;
}

export function Calendar({
  currentDate,
  calendarDays,
  selectedDates,
  isGenerating,
  onDateSelect,
  onGenerateCalendar,
  onClearSelection,
  onDayClick
}: CalendarProps) {
  const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Fill in the calendar grid with empty cells for previous/next month
  const firstDayOfWeek = monthStart.getDay();
  const emptyCellsBefore = Array.from({ length: firstDayOfWeek }, (_, i) => i);
  
  const remainingCells = 42 - (firstDayOfWeek + days.length); // 6 rows * 7 days = 42 cells
  const emptyCellsAfter = Array.from({ length: remainingCells }, (_, i) => i);

  const isDateSelected = (date: Date) => {
    return selectedDates.includes(format(date, 'yyyy-MM-dd'));
  };

  const getDayData = (date: Date): CalendarDay | undefined => {
    return calendarDays.find(day => isSameDay(day.date, date));
  };

  const renderPostIndicators = (posts: PostSummary[]) => {
    return posts.map((post, index) => (
      <div
        key={index}
        className={`post-indicator ${getCategoryIndicatorColor(post.category)}`}
      >
        {post.category} ({post.count})
      </div>
    ));
  };

  return (
    <main className="flex-1 overflow-hidden">
      <div className="h-full flex flex-col">
        {/* Calendar Controls */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <Button
                onClick={onGenerateCalendar}
                disabled={isGenerating || selectedDates.length === 0}
                className="bg-primary text-white hover:bg-blue-700 flex items-center space-x-2"
              >
                <RefreshCw className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
                <span>{isGenerating ? 'Generating...' : 'Generate Calendar'}</span>
              </Button>
              
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-green-200 border-l-2 border-green-500 rounded-sm"></div>
                  <span>Has Posts</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-blue-200 border-2 border-primary rounded-sm"></div>
                  <span>Selected</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="text-gray-500 hover:text-gray-700"
              >
                <CalendarIcon className="h-4 w-4 mr-2" />
                Month View
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onClearSelection}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Calendar Header */}
            <div className="calendar-grid bg-gray-100 border-b border-gray-200">
              {weekDays.map(day => (
                <div key={day} className="p-4 text-center font-semibold text-gray-700 text-sm">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Body */}
            <div className="calendar-grid">
              {/* Empty cells for previous month */}
              {emptyCellsBefore.map(index => (
                <div key={`empty-before-${index}`} className="calendar-cell p-3 opacity-30">
                  <div className="text-sm text-gray-400 font-medium">
                    {monthStart.getDate() - firstDayOfWeek + index}
                  </div>
                </div>
              ))}

              {/* Current month days */}
              {days.map(date => {
                const dayData = getDayData(date);
                const isSelected = isDateSelected(date);
                const hasPosts = dayData?.hasPosts || false;
                
                return (
                  <div
                    key={format(date, 'yyyy-MM-dd')}
                    className={`calendar-cell p-3 cursor-pointer ${
                      isSelected ? 'selected' : ''
                    } ${hasPosts ? 'has-posts' : ''}`}
                    onClick={() => {
                      onDateSelect(date);
                      if (hasPosts) {
                        onDayClick(date);
                      }
                    }}
                  >
                    <div className="text-sm font-medium text-gray-900 mb-2">
                      {date.getDate()}
                    </div>
                    
                    {dayData?.posts && dayData.posts.length > 0 && (
                      <>
                        <div className="space-y-1">
                          {renderPostIndicators(dayData.posts)}
                        </div>
                        <div className="mt-2 text-xs text-gray-500">
                          {dayData.totalPosts} posts total
                        </div>
                      </>
                    )}
                  </div>
                );
              })}

              {/* Empty cells for next month */}
              {emptyCellsAfter.map(index => (
                <div key={`empty-after-${index}`} className="calendar-cell p-3 opacity-30">
                  <div className="text-sm text-gray-400 font-medium">
                    {index + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}