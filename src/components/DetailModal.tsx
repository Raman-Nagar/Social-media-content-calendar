import { Button } from "@/ui/button";
import { Badge } from "@/ui/badge";
import { Card, CardContent } from "@/ui/card";
import { X, Download, ExternalLink } from "lucide-react";
import {
  formatFullDate,
  formatNumber,
  getCategoryColor,
  generateAvatarColor,
  getAvatarInitial,
} from "@/lib/utils";
import Link from "next/link";

interface PostMetrics {
  likes: number;
  views: number;
  comments: number;
  shares: number;
  reach: number;
  impressions: number;
}

interface DayDetail {
  date: string;
  posts: Array<{
    id: number;
    pageName: string;
    category: string;
    postType: string;
    followerCount: number;
    profileLink: string;
    metrics: PostMetrics;
  }>;
  totalMetrics: PostMetrics;
}

interface DetailModalProps {
  isOpen: boolean;
  dayDetail: DayDetail | null;
  onClose: () => void;
  onExportDay: (date: string) => void;
}

export function DetailModal({
  isOpen,
  dayDetail,
  onClose,
  onExportDay,
}: DetailModalProps) {
  if (!isOpen || !dayDetail) return null;

  const date = new Date(dayDetail.date);
  const { totalMetrics } = dayDetail;
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 z-50">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {formatFullDate(date)} - Post Details
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
            {/* Performance Metrics Summary */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              <Card className="bg-blue-50">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary">
                    {formatNumber(totalMetrics.likes)}
                  </div>
                  <div className="text-sm text-gray-600">Total Likes</div>
                </CardContent>
              </Card>
              <Card className="bg-green-50">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-success">
                    {formatNumber(totalMetrics.views)}
                  </div>
                  <div className="text-sm text-gray-600">Total Views</div>
                </CardContent>
              </Card>
              <Card className="bg-purple-50">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {formatNumber(totalMetrics.reach)}
                  </div>
                  <div className="text-sm text-gray-600">Total Reach</div>
                </CardContent>
              </Card>
              <Card className="bg-orange-50">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-warning">
                    {formatNumber(totalMetrics.impressions)}
                  </div>
                  <div className="text-sm text-gray-600">Impressions</div>
                </CardContent>
              </Card>
              <Card className="bg-pink-50">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-accent">
                    {formatNumber(totalMetrics.shares)}
                  </div>
                  <div className="text-sm text-gray-600">Total Shares</div>
                </CardContent>
              </Card>
            </div>

            {/* Posts Table */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Scheduled Posts ({dayDetail.posts.length} total)
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Page
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Post Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Followers
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Expected Likes
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {dayDetail.posts.map((post) => (
                      <tr key={post.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div
                              className={`w-8 h-8 bg-gradient-to-br ${generateAvatarColor(
                                post.pageName
                              )} rounded-full flex items-center justify-center text-white text-sm font-bold mr-3`}
                            >
                              {getAvatarInitial(post.pageName)}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {post.pageName}
                              </div>
                              <div className="text-sm text-gray-500">
                                {post.profileLink.split("/").pop()}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge className={getCategoryColor(post.category)}>
                            {post.category}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {post.postType}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatNumber(post.followerCount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatNumber(post.metrics.likes)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                          <Link
                            href={post.profileLink}
                            target="_blank"
                            className="text-primary hover:text-blue-700"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 px-6 py-4 bg-gray-50 border-t border-gray-200">
            <Button
              onClick={() => onExportDay(dayDetail.date)}
              className="bg-success text-white hover:bg-green-600"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Day Data
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="bg-gray-300 text-gray-700 hover:bg-gray-400"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
