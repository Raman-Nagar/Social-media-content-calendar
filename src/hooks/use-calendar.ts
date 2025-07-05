"use client";
import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import { exportCalendarToExcel } from "@/lib/excel-exports";
import {
  dummyPages,
  dummyPosts,
  dummyCalendarEvents,
  generateCalendar,
  generateRandomDates,
  getStats,
  type SocialMediaPage,
  type Post,
} from "@/lib/data";
import { toast } from "@/hooks/use-toast";
import { CalendarDay, DayDetail } from "@/types/calendar";

export function useCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    "Meme",
    "Edit",
    "Bollywood",
  ]);
  const [followerRange, setFollowerRange] = useState<[number]>([500]);
  const [numberOfDates, setNumberOfDates] = useState(5);
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
  const [selectedDayDetail, setSelectedDayDetail] = useState<DayDetail | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [pages] = useState<SocialMediaPage[]>(dummyPages);
  const [posts, setPosts] = useState<Post[]>(dummyPosts);
  const [stats, setStats] = useState(getStats());

  // Build calendar days from events and posts
  useEffect(() => {
    const buildCalendarDays = () => {
      const days: CalendarDay[] = [];

      dummyCalendarEvents.forEach((event) => {
        const eventPosts = posts.filter((post) =>
          event.posts.includes(post.id)
        );

        if (eventPosts.length > 0) {
          // Group posts by category
          const postsByCategory = eventPosts.reduce((acc, post) => {
            const page = pages.find((p) => p.id === post.pageId);
            if (page) {
              const category = page.category;
              if (!acc[category]) {
                acc[category] = 0;
              }
              acc[category]++;
            }
            return acc;
          }, {} as Record<string, number>);

          const postSummaries = Object.entries(postsByCategory).map(
            ([category, count]) => ({
              category,
              count: count as number,
              color: getCategoryColor(category),
            })
          );

          days.push({
            date: new Date(event.date),
            isCurrentMonth: true,
            isSelected: selectedDates.includes(
              format(new Date(event.date), "yyyy-MM-dd")
            ),
            hasPosts: true,
            posts: postSummaries,
            totalPosts: eventPosts.length,
          });
        }
      });

      setCalendarDays(days);
    };

    buildCalendarDays();
  }, [posts, pages, selectedDates]);

  const getCategoryColor = (category: string): string => {
    const colors = {
      Meme: "bg-yellow-100 text-yellow-800",
      Edit: "bg-purple-100 text-purple-800",
      Bollywood: "bg-pink-100 text-pink-800",
    };
    return (
      colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800"
    );
  };

  // Handle random date generation
  const handleGenerateRandomDates = useCallback(() => {
    try {
      const dates = generateRandomDates(
        numberOfDates,
        currentDate.getMonth(),
        currentDate.getFullYear()
      );
      setSelectedDates(dates);
      toast({
        title: "Random dates generated",
        description: `Generated ${dates.length} random dates`,
      });
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: "Failed to generate random dates",
        variant: "destructive",
      });
      console.log("Error: ", error);
    }
  }, [currentDate, numberOfDates]);

  // Handle calendar generation
  const handleGenerateCalendar = useCallback(() => {
    if (selectedDates.length === 0) {
      toast({
        title: "No dates selected",
        description: "Please select dates first",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      const result = generateCalendar(
        selectedDates,
        selectedCategories,
        followerRange[0] * 1000,
        Number.MAX_SAFE_INTEGER,
        5
      );

      setPosts([...dummyPosts]);
      setStats(getStats());

      toast({
        title: "Calendar generated successfully",
        description: `Generated ${result.totalPosts} posts across ${result.events.length} dates`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate calendar",
        variant: "destructive",
      });
      console.log("Error: ", error);
    } finally {
      setIsGenerating(false);
    }
  }, [followerRange, selectedCategories, selectedDates]);

  // Handle date selection
  const handleDateSelect = useCallback((date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    setSelectedDates((prev) =>
      prev.includes(dateStr)
        ? prev.filter((d) => d !== dateStr)
        : [...prev, dateStr]
    );
  }, []);

  // Handle day click for detail modal
  const handleDayClick = useCallback(async (date: Date) => {
    try {
      const dateStr = format(date, "yyyy-MM-dd");
      const dayPosts = posts.filter((post) => {
        if (!post.scheduledDate) return false;
        return format(new Date(post.scheduledDate), "yyyy-MM-dd") === dateStr;
      });

      if (dayPosts.length === 0) return;

      const postsWithDetails = dayPosts.map((post) => {
        const page = pages.find((p) => p.id === post.pageId);
        return {
          id: post.id,
          pageName: page?.pageName || "",
          category: page?.category || "",
          postType: post.postType || "",
          followerCount: page?.followerCount || 0,
          profileLink: page?.profileLink || "",
          metrics: {
            likes: post.likes || 0,
            views: post.views || 0,
            comments: post.comments || 0,
            shares: post.shares || 0,
            reach: post.reach || 0,
            impressions: post.impressions || 0,
          },
        };
      });

      const totalMetrics = postsWithDetails.reduce(
        (acc, post) => ({
          likes: acc.likes + post.metrics.likes,
          views: acc.views + post.metrics.views,
          comments: acc.comments + post.metrics.comments,
          shares: acc.shares + post.metrics.shares,
          reach: acc.reach + post.metrics.reach,
          impressions: acc.impressions + post.metrics.impressions,
        }),
        { likes: 0, views: 0, comments: 0, shares: 0, reach: 0, impressions: 0 }
      );

      setSelectedDayDetail({
        date: dateStr,
        posts: postsWithDetails,
        totalMetrics,
      });
      setIsModalOpen(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load day details",
        variant: "destructive",
      });
      console.log("Error: ", error);
    }
  }, [pages, posts]);

  // Handle Excel export
  const handleExportExcel = useCallback(() => {
    const calendarData = dummyCalendarEvents
      .map((event) => {
        const eventPosts = posts.filter((post) =>
          event.posts.includes(post.id)
        );
        const eventPages = pages.filter((page) =>
          eventPosts.some((post) => post.pageId === page.id)
        );

        return {
          date: format(new Date(event.date), "yyyy-MM-dd"),
          posts: eventPosts,
          pages: eventPages,
        };
      })
      .filter((data) => data.posts.length > 0);

    exportCalendarToExcel({
      pages,
      posts,
      calendarData,
    });

    toast({
      title: "Excel exported",
      description: "Calendar data has been exported to Excel",
    });
  }, [pages, posts]);

  const handleExportDay = useCallback((date: string) => {
    const dayData = {
      date,
      posts: posts.filter((post) => {
        if (!post.scheduledDate) return false;
        return format(new Date(post.scheduledDate), "yyyy-MM-dd") === date;
      }),
      pages,
    };

    exportCalendarToExcel({
      pages,
      posts: dayData.posts,
      calendarData: [dayData],
    });

    toast({
      title: "Day data exported",
      description: `Data for ${date} has been exported to Excel`,
    });
  }, [pages, posts]);

  return {
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
  }
}
