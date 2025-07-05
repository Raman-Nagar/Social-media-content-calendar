import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Checkbox } from "@/ui/checkbox";
import { Slider } from "@/ui/slider";
import { Badge } from "@/ui/badge";
import { Card, CardContent } from "@/ui/card";
import {
  CalendarCheck,
  Filter,
  Users,
  BarChart3,
  Shuffle,
  X,
} from "lucide-react";
import {
  formatNumber,
  generateAvatarColor,
  getAvatarInitial,
} from "@/lib/utils";
import type { SocialMediaPage } from "@/lib/data";

interface CalendarStats {
  totalPages: number;
  totalPosts: number;
  avgFollowers: number;
  coverage: number;
  totalFollowers: number;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  pages: SocialMediaPage[];
  stats: CalendarStats | null;
  selectedDates: string[];
  selectedCategories: string[];
  followerRange: [number];
  numberOfDates: number;
  onDatesChange: (dates: string[]) => void;
  onCategoriesChange: (categories: string[]) => void;
  onFollowerRangeChange: (range: [number]) => void;
  onNumberOfDatesChange: (count: number) => void;
  onGenerateRandomDates: () => void;
  onRemoveDate: (date: string) => void;
}

export function Sidebar({
  isOpen,
  onClose,
  pages,
  stats,
  selectedDates,
  selectedCategories,
  followerRange,
  numberOfDates,
  onCategoriesChange,
  onFollowerRangeChange,
  onNumberOfDatesChange,
  onGenerateRandomDates,
  onRemoveDate,
}: SidebarProps) {
  const categories = ["Meme", "Edit", "Bollywood"];

  const filteredPages = pages.filter((page) => {
    const categoryMatch =
      selectedCategories.length === 0 ||
      selectedCategories.includes(page.category);
    const followerMatch = page.followerCount >= followerRange[0] * 1000;
    return categoryMatch && followerMatch;
  });

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      onCategoriesChange([...selectedCategories, category]);
    } else {
      onCategoriesChange(selectedCategories.filter((c) => c !== category));
    }
  };

  const getCategoryCount = (category: string) => {
    return pages.filter((page) => page.category === category).length;
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`w-80 bg-white shadow-lg border-r border-gray-200 fixed lg:relative h-full lg:h-auto z-40 transition-transform duration-300 overflow-y-auto ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-6">
          {/* Date Selection */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <CalendarCheck className="text-primary mr-2 h-5 w-5" />
              Date Selection
            </h3>

            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">
                  Select Random Dates
                </Label>
                <div className="flex space-x-2">
                  <Input
                    type="number"
                    placeholder="Number of dates"
                    value={numberOfDates}
                    onChange={(e) =>
                      onNumberOfDatesChange(parseInt(e.target.value) || 1)
                    }
                    min={1}
                    max={30}
                    className="flex-1"
                  />
                  <Button
                    onClick={onGenerateRandomDates}
                    size="sm"
                    className="bg-primary text-white hover:bg-blue-700"
                  >
                    <Shuffle className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {selectedDates.length > 0 && (
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="text-sm text-gray-600 mb-2">
                    Selected Dates:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {selectedDates.map((date) => (
                      <Badge
                        key={date}
                        variant="secondary"
                        className="bg-primary text-white flex items-center space-x-1"
                      >
                        <span>
                          {new Date(date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRemoveDate(date)}
                          className="h-4 w-4 p-0 ml-1 hover:text-gray-200"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Page Filters */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Filter className="text-primary mr-2 h-5 w-5" />
              Page Filters
            </h3>

            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">
                  Categories
                </Label>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={category}
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={(checked) =>
                          handleCategoryChange(category, checked as boolean)
                        }
                      />
                      <Label htmlFor={category} className="text-sm flex-1">
                        {category} Pages
                      </Label>
                      <span className="text-xs text-gray-500">
                        ({getCategoryCount(category)})
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">
                  Follower Range
                </Label>
                <div className="space-y-2">
                  <Slider
                    value={followerRange}
                    onValueChange={onFollowerRangeChange}
                    max={1000}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>1K</span>
                    <span className="font-medium">
                      {formatNumber(followerRange[0] * 1000)}+
                    </span>
                    <span>1M+</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          {stats && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <BarChart3 className="text-primary mr-2 h-5 w-5" />
                Quick Stats
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <Card className="bg-blue-50">
                  <CardContent className="p-3 text-center">
                    <div className="text-2xl font-bold text-primary">
                      {stats.totalPosts}
                    </div>
                    <div className="text-xs text-gray-600">Total Posts</div>
                  </CardContent>
                </Card>
                <Card className="bg-green-50">
                  <CardContent className="p-3 text-center">
                    <div className="text-2xl font-bold text-success">
                      {stats.totalPages}
                    </div>
                    <div className="text-xs text-gray-600">Active Pages</div>
                  </CardContent>
                </Card>
                <Card className="bg-purple-50">
                  <CardContent className="p-3 text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {formatNumber(stats.avgFollowers)}
                    </div>
                    <div className="text-xs text-gray-600">Avg Followers</div>
                  </CardContent>
                </Card>
                <Card className="bg-orange-50">
                  <CardContent className="p-3 text-center">
                    <div className="text-2xl font-bold text-warning">
                      {stats.coverage}%
                    </div>
                    <div className="text-xs text-gray-600">Coverage</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Selected Pages */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Users className="text-primary mr-2 h-5 w-5" />
              Filtered Pages
              <span className="ml-auto text-sm font-normal text-gray-500">
                ({filteredPages.length} pages)
              </span>
            </h3>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {filteredPages.slice(0, 10).map((page) => (
                <div
                  key={page.id}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-8 h-8 bg-gradient-to-br ${generateAvatarColor(
                        page.pageName
                      )} rounded-full flex items-center justify-center text-white text-sm font-bold`}
                    >
                      {getAvatarInitial(page.pageName)}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{page.pageName}</div>
                      <div className="text-xs text-gray-500">
                        {page.category} • {formatNumber(page.followerCount)}{" "}
                        followers
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {filteredPages.length > 10 && (
                <div className="text-center text-sm text-gray-500 py-2">
                  +{filteredPages.length - 10} more pages
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
