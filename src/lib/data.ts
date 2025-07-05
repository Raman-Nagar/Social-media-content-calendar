// Dummy data for social media pages and posts
export interface SocialMediaPage {
    id: number;
    pageName: string;
    category: 'Meme' | 'Edit' | 'Bollywood';
    followerCount: number;
    profileLink: string;
    isActive: boolean;
}

export interface Post {
    id: number;
    pageId: number;
    postType: string;
    postLink?: string;
    likes: number;
    views: number;
    comments: number;
    shares: number;
    reach: number;
    impressions: number;
    scheduledDate?: Date;
    createdAt: Date;
}

export interface CalendarEvent {
    id: number;
    date: Date;
    posts: number[];
    isSelected: boolean;
}

// Dummy social media pages data
export const dummyPages: SocialMediaPage[] = [
    { id: 1, pageName: "@MemeZone", category: "Meme", followerCount: 245000, profileLink: "https://instagram.com/memezone", isActive: true },
    { id: 2, pageName: "@EditMaster", category: "Edit", followerCount: 892000, profileLink: "https://instagram.com/editmaster", isActive: true },
    { id: 3, pageName: "@BollywoodHub", category: "Bollywood", followerCount: 634000, profileLink: "https://instagram.com/bollywoodhub", isActive: true },
    { id: 4, pageName: "@MemeKing", category: "Meme", followerCount: 156000, profileLink: "https://instagram.com/memeking", isActive: true },
    { id: 5, pageName: "@VideoEditor", category: "Edit", followerCount: 423000, profileLink: "https://instagram.com/videoeditor", isActive: true },
    { id: 6, pageName: "@FilmyWorld", category: "Bollywood", followerCount: 789000, profileLink: "https://instagram.com/filmyworld", isActive: true },
    { id: 7, pageName: "@MemeLord", category: "Meme", followerCount: 321000, profileLink: "https://instagram.com/memelord", isActive: true },
    { id: 8, pageName: "@EditPro", category: "Edit", followerCount: 567000, profileLink: "https://instagram.com/editpro", isActive: true },
];

// Dummy posts data (initially empty, will be populated when calendar is generated)
export let dummyPosts: Post[] = [];

// Dummy calendar events data (initially empty)
export let dummyCalendarEvents: CalendarEvent[] = [];

// Helper functions for managing data
export const getRandomPostType = (): string => {
    const types = ['Static', 'Reel', 'Video Edit', 'Story', 'IGTV'];
    return types[Math.floor(Math.random() * types.length)];
};

export const estimateLikes = (followers: number): number => {
    const engagementRate = 0.03 + Math.random() * 0.02;
    return Math.floor(followers * engagementRate);
};

export const estimateViews = (followers: number): number => {
    const viewRate = 0.10 + Math.random() * 0.05;
    return Math.floor(followers * viewRate);
};

export const estimateReach = (followers: number): number => {
    const reachRate = 0.60 + Math.random() * 0.20;
    return Math.floor(followers * reachRate);
};

export const estimateImpressions = (followers: number): number => {
    const impressionRate = 1.0 + Math.random() * 0.4;
    return Math.floor(followers * impressionRate);
};

export const estimateShares = (followers: number): number => {
    const shareRate = 0.01 + Math.random() * 0.01;
    return Math.floor(followers * shareRate);
};

export const estimateComments = (followers: number): number => {
    const commentRate = 0.005 + Math.random() * 0.005;
    return Math.floor(followers * commentRate);
};

// Function to generate calendar with posts
export const generateCalendar = (
    selectedDates: string[],
    selectedCategories: string[],
    minFollowers: number = 0,
    maxFollowers: number = Number.MAX_SAFE_INTEGER,
    postsPerDate: number = 5
) => {
    // Filter pages based on criteria
    const filteredPages = dummyPages.filter(page => {
        const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(page.category);
        const followerMatch = page.followerCount >= minFollowers && page.followerCount <= maxFollowers;
        return categoryMatch && followerMatch && page.isActive;
    });

    // Sort by follower count for prioritization
    filteredPages.sort((a, b) => b.followerCount - a.followerCount);

    // Clear existing events for selected dates
    dummyCalendarEvents = dummyCalendarEvents.filter(event =>
        !selectedDates.includes(event.date.toISOString().split('T')[0])
    );

    // Clear existing posts for selected dates
    dummyPosts = dummyPosts.filter(post => {
        if (!post.scheduledDate) return true;
        return !selectedDates.includes(post.scheduledDate.toISOString().split('T')[0]);
    });

    const newEvents: CalendarEvent[] = [];
    let currentPostId = Math.max(...dummyPosts.map(p => p.id), 0) + 1;
    let currentEventId = Math.max(...dummyCalendarEvents.map(e => e.id), 0) + 1;

    selectedDates.forEach(dateStr => {
        const date = new Date(dateStr);
        const postsForDate: number[] = [];

        // Get available categories
        const availableCategories = [...new Set(filteredPages.map(p => p.category))];

        // Generate posts for this date
        for (let i = 0; i < postsPerDate; i++) {
            const categoryIndex = i % availableCategories.length;
            const category = availableCategories[categoryIndex];
            const categoryPages = filteredPages.filter(p => p.category === category);

            if (categoryPages.length > 0) {
                const pageIndex = Math.floor(i / availableCategories.length) % categoryPages.length;
                const selectedPage = categoryPages[pageIndex];

                // Create post
                const newPost: Post = {
                    id: currentPostId++,
                    pageId: selectedPage.id,
                    postType: getRandomPostType(),
                    scheduledDate: date,
                    likes: estimateLikes(selectedPage.followerCount),
                    views: estimateViews(selectedPage.followerCount),
                    comments: estimateComments(selectedPage.followerCount),
                    shares: estimateShares(selectedPage.followerCount),
                    reach: estimateReach(selectedPage.followerCount),
                    impressions: estimateImpressions(selectedPage.followerCount),
                    createdAt: new Date()
                };

                dummyPosts.push(newPost);
                postsForDate.push(newPost.id);
            }
        }

        // Create calendar event
        const newEvent: CalendarEvent = {
            id: currentEventId++,
            date,
            posts: postsForDate,
            isSelected: true
        };

        dummyCalendarEvents.push(newEvent);
        newEvents.push(newEvent);
    });

    return {
        message: "Calendar generated successfully",
        events: newEvents,
        totalPosts: newEvents.reduce((sum, event) => sum + event.posts.length, 0)
    };
};

// Function to generate random dates
export const generateRandomDates = (
    count: number,
    month?: number,
    year?: number
): string[] => {
    const currentDate = new Date();
    const targetMonth = month !== undefined ? month : currentDate.getMonth();
    const targetYear = year || currentDate.getFullYear();

    const daysInMonth = new Date(targetYear, targetMonth + 1, 0).getDate();

    const randomDates: string[] = [];
    const usedDates = new Set<number>();

    while (randomDates.length < count && usedDates.size < daysInMonth) {
        const randomDay = Math.floor(Math.random() * daysInMonth) + 1;

        if (!usedDates.has(randomDay)) {
            usedDates.add(randomDay);
            const randomDate = new Date(targetYear, targetMonth, randomDay);
            randomDates.push(randomDate.toISOString().split('T')[0]);
        }
    }

    return randomDates.sort();
};

// Function to get statistics
export const getStats = () => {
    const totalFollowers = dummyPages.reduce((sum, page) => sum + page.followerCount, 0);
    const avgFollowers = Math.floor(totalFollowers / dummyPages.length);

    const totalPosts = dummyPosts.length;
    const activeDates = dummyCalendarEvents.filter(e => e.posts.length > 0).length;
    const totalDaysInMonth = 31; // Approximate
    const coverage = Math.floor((activeDates / totalDaysInMonth) * 100);

    return {
        totalPages: dummyPages.length,
        totalPosts,
        avgFollowers,
        coverage,
        totalFollowers
    };
};