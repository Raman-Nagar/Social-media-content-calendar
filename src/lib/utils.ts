import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });
}

export function formatFullDate(date: Date): string {
  return date.toLocaleDateString('en-US', { 
    weekday: 'long',
    year: 'numeric',
    month: 'long', 
    day: 'numeric' 
  });
}

export function getCategoryColor(category: string): string {
  const colors = {
    'Meme': 'bg-yellow-100 text-yellow-800',
    'Edit': 'bg-purple-100 text-purple-800',
    'Bollywood': 'bg-pink-100 text-pink-800'
  };
  return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
}

export function getCategoryIndicatorColor(category: string): string {
  const colors = {
    'Meme': 'category-meme',
    'Edit': 'category-edit',
    'Bollywood': 'category-bollywood'
  };
  return colors[category as keyof typeof colors] || 'bg-gray-200 text-gray-700';
}

export function generateAvatarColor(name: string): string {
  const colors = [
    'from-purple-400 to-pink-400',
    'from-blue-400 to-cyan-400',
    'from-red-400 to-orange-400',
    'from-green-400 to-blue-400',
    'from-yellow-400 to-red-400',
    'from-indigo-400 to-purple-400'
  ];
  
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}

export function getAvatarInitial(name: string): string {
  return name.charAt(1).toUpperCase(); // Skip @ symbol
}