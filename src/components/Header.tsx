import { Button } from "@/ui/button";
import { Calendar, ChevronLeft, ChevronRight, Download, Menu } from "lucide-react";
import { format } from "date-fns";

interface HeaderProps {
  currentDate: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onExportExcel: () => void;
  onToggleSidebar: () => void;
  isExporting: boolean;
}

export function Header({
  currentDate,
  onPreviousMonth,
  onNextMonth,
  onExportExcel,
  onToggleSidebar,
  isExporting
}: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleSidebar}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Calendar className="h-4 w-4 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Content Calendar</h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onPreviousMonth}
                className="text-gray-600 hover:text-gray-900 h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="font-medium text-gray-900 min-w-[120px] text-center">
                {format(currentDate, 'MMMM yyyy')}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={onNextMonth}
                className="text-gray-600 hover:text-gray-900 h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            
            <Button
              onClick={onExportExcel}
              disabled={isExporting}
              className="bg-success text-white hover:bg-green-600 flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">
                {isExporting ? 'Exporting...' : 'Export Excel'}
              </span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}