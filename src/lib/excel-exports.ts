import * as XLSX from 'xlsx';
import type { SocialMediaPage, Post } from "./data";

export interface ExcelExportData {
  pages: SocialMediaPage[];
  posts: Post[];
  calendarData: Array<{
    date: string;
    posts: Post[];
    pages: SocialMediaPage[];
  }>;
}

export class ExcelExporter {
  private data: ExcelExportData;

  constructor(data: ExcelExportData) {
    this.data = data;
  }

  export(): void {
    const workbook = XLSX.utils.book_new();

    // Create Overview Sheet
    this.createOverviewSheet(workbook);

    // Create Date-wise Sheets
    this.data.calendarData.forEach(dayData => {
      if (dayData.posts.length > 0) {
        this.createDateSheet(workbook, dayData);
      }
    });

    // Download the file
    XLSX.writeFile(workbook, `Social_Media_Calendar_${new Date().toISOString().split('T')[0]}.xlsx`);
  }

  private createOverviewSheet(workbook: XLSX.WorkBook): void {
    const worksheetData = [];

    // Title row
    worksheetData.push(['Social Media Content Calendar - Overview']);
    worksheetData.push([]);

    // Category-wise Summary
    worksheetData.push(['Category-wise Post Distribution']);
    worksheetData.push(['Category', 'Total Posts', 'Avg Likes', 'Avg Views', 'Avg Reach', 'Avg Impressions', 'Avg Shares']);

    const categories = ['Meme', 'Edit', 'Bollywood'];
    categories.forEach(category => {
      const categoryPosts = this.data.posts.filter(post => {
        const page = this.data.pages.find(p => p.id === post.pageId);
        return page?.category === category;
      });

      if (categoryPosts.length > 0) {
        const avgLikes = Math.floor(categoryPosts.reduce((sum, p) => sum + (p.likes || 0), 0) / categoryPosts.length);
        const avgViews = Math.floor(categoryPosts.reduce((sum, p) => sum + (p.views || 0), 0) / categoryPosts.length);
        const avgReach = Math.floor(categoryPosts.reduce((sum, p) => sum + (p.reach || 0), 0) / categoryPosts.length);
        const avgImpressions = Math.floor(categoryPosts.reduce((sum, p) => sum + (p.impressions || 0), 0) / categoryPosts.length);
        const avgShares = Math.floor(categoryPosts.reduce((sum, p) => sum + (p.shares || 0), 0) / categoryPosts.length);

        worksheetData.push([
          category,
          categoryPosts.length,
          avgLikes,
          avgViews,
          avgReach,
          avgImpressions,
          avgShares
        ]);
      }
    });

    // Total row
    const totalPosts = this.data.posts.length;
    const totalLikes = this.data.posts.reduce((sum, p) => sum + (p.likes || 0), 0);
    const totalViews = this.data.posts.reduce((sum, p) => sum + (p.views || 0), 0);
    const totalReach = this.data.posts.reduce((sum, p) => sum + (p.reach || 0), 0);
    const totalImpressions = this.data.posts.reduce((sum, p) => sum + (p.impressions || 0), 0);
    const totalShares = this.data.posts.reduce((sum, p) => sum + (p.shares || 0), 0);

    worksheetData.push([
      'TOTAL',
      totalPosts,
      totalLikes,
      totalViews,
      totalReach,
      totalImpressions,
      totalShares
    ]);

    worksheetData.push([]);

    // Date-wise Summary
    worksheetData.push(['Date-wise Performance Summary']);
    worksheetData.push(['Date', 'Total Posts', 'Total Likes', 'Total Views', 'Total Reach', 'Total Impressions', 'Total Shares']);

    this.data.calendarData.forEach(dayData => {
      if (dayData.posts.length > 0) {
        const dayLikes = dayData.posts.reduce((sum, p) => sum + (p.likes || 0), 0);
        const dayViews = dayData.posts.reduce((sum, p) => sum + (p.views || 0), 0);
        const dayReach = dayData.posts.reduce((sum, p) => sum + (p.reach || 0), 0);
        const dayImpressions = dayData.posts.reduce((sum, p) => sum + (p.impressions || 0), 0);
        const dayShares = dayData.posts.reduce((sum, p) => sum + (p.shares || 0), 0);

        worksheetData.push([
          dayData.date,
          dayData.posts.length,
          dayLikes,
          dayViews,
          dayReach,
          dayImpressions,
          dayShares
        ]);
      }
    });

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Overview');
  }

  private createDateSheet(workbook: XLSX.WorkBook, dayData: { date: string; posts: Post[]; pages: SocialMediaPage[] }): void {
    const worksheetData = [];

    // Header
    worksheetData.push([`Posts for ${dayData.date}`]);
    worksheetData.push([]);
    worksheetData.push([
      'Username',
      'Profile Link',
      'Followers',
      'Category',
      'Date of Post',
      'Post Type',
      'Likes',
      'Views',
      'Comments',
      'Shares',
      'Reach',
      'Impressions'
    ]);

    // Posts data
    dayData.posts.forEach(post => {
      const page = dayData.pages.find(p => p.id === post.pageId);
      if (page) {
        worksheetData.push([
          page.pageName,
          page.profileLink,
          page.followerCount,
          page.category,
          dayData.date,
          post.postType,
          post.likes || 0,
          post.views || 0,
          post.comments || 0,
          post.shares || 0,
          post.reach || 0,
          post.impressions || 0
        ]);
      }
    });

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const sheetName = `${dayData.date.replace(/-/g, '_')}`;
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  }
}

export function exportCalendarToExcel(data: ExcelExportData): void {
  const exporter = new ExcelExporter(data);
  exporter.export();
}