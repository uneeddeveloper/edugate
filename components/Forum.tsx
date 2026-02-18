import React, { useState, useEffect } from "react";
import { ForumPost, User } from "../types";
import {
  MessageSquare,
  Send,
  Sparkles,
  User as UserIcon,
  MoreHorizontal,
} from "lucide-react";
import { MOCK_FORUM_POSTS } from "../constants";

interface ForumProps {
  courseId: string;
  currentUser: User;
}

export const Forum: React.FC<ForumProps> = ({ courseId, currentUser }) => {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [newPostContent, setNewPostContent] = useState("");
  const [summary, setSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);

  useEffect(() => {
    const filtered = MOCK_FORUM_POSTS.filter((p) => p.courseId === courseId);
    setPosts(filtered);
    setSummary(null);
  }, [courseId]);

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    const newPost: ForumPost = {
      id: Date.now().toString(),
      courseId,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorRole: currentUser.role,
      content: newPostContent,
      createdAt: new Date().toISOString(),
      replies: [],
    };

    setPosts([newPost, ...posts]);
    setNewPostContent("");
  };

  const handleSummarize = async () => {
    if (posts.length === 0) return;
    setIsSummarizing(true);

    // Placeholder - AI summarization disabled
    setTimeout(() => {
      setSummary("Fitur ringkasan AI sedang tidak tersedia.");
      setIsSummarizing(false);
    }, 500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Forum Diskusi</h2>
          <p className="text-sm text-gray-500">
            Ruang tanya jawab dan diskusi kelas
          </p>
        </div>
        <button
          onClick={handleSummarize}
          disabled={isSummarizing || posts.length === 0}
          className="flex items-center gap-2 text-xs font-bold bg-white text-purple-600 border border-purple-200 px-4 py-2 rounded-full hover:bg-purple-50 transition-colors disabled:opacity-50 shadow-sm"
        >
          <Sparkles size={14} />
          {isSummarizing ? "Sedang Meringkas..." : "Ringkas AI"}
        </button>
      </div>

      {summary && (
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 p-6 rounded-2xl animate-in fade-in slide-in-from-top-4 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-2 -mr-2 bg-purple-200 w-20 h-20 rounded-full blur-3xl opacity-50"></div>
          <h3 className="font-bold text-purple-900 text-sm mb-3 flex items-center gap-2 relative z-10">
            <Sparkles size={16} className="text-purple-600" /> Ringkasan Diskusi
            (AI Generated)
          </h3>
          <div className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed relative z-10">
            {summary}
          </div>
        </div>
      )}

      {/* Input New Post */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex gap-4">
          <img
            src={currentUser.avatarUrl}
            alt="Avatar"
            className="w-10 h-10 rounded-full border border-gray-200"
          />
          <div className="flex-1">
            <form onSubmit={handlePostSubmit}>
              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder={`Apa yang ingin Anda diskusikan, ${currentUser.name.split(" ")[0]}?`}
                className="w-full bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-primary-100 p-3 text-sm resize-none mb-2"
                rows={3}
              />
              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-400">
                  Tekan enter untuk baris baru
                </p>
                <button
                  type="submit"
                  disabled={!newPostContent.trim()}
                  className="bg-primary-600 text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-primary-700 transition-colors flex items-center gap-2 shadow-lg shadow-primary-500/30 disabled:opacity-50 disabled:shadow-none"
                >
                  <Send size={14} /> Posting
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Posts Feed */}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <MessageSquare className="text-gray-300" size={24} />
            </div>
            <p className="text-gray-500 font-medium">Belum ada diskusi.</p>
            <p className="text-gray-400 text-sm">
              Jadilah yang pertama memulai percakapan!
            </p>
          </div>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <img
                    src={`https://ui-avatars.com/api/?name=${post.authorName}&background=random`}
                    alt={post.authorName}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-gray-900 text-sm">
                        {post.authorName}
                      </h4>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                          post.authorRole === "lecturer"
                            ? "bg-primary-100 text-primary-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {post.authorRole === "lecturer" ? "Dosen" : "Mahasiswa"}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(post.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
                <button className="text-gray-300 hover:text-gray-500">
                  <MoreHorizontal size={18} />
                </button>
              </div>

              <p className="text-gray-700 text-sm leading-relaxed mb-4 pl-[52px]">
                {post.content}
              </p>

              {/* Replies Section */}
              {post.replies.length > 0 && (
                <div className="ml-[52px] bg-gray-50 rounded-xl p-4 space-y-3">
                  {post.replies.map((reply) => (
                    <div key={reply.id} className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-500 shrink-0">
                        {reply.authorName.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-gray-800">
                            {reply.authorName}
                          </span>
                          <span className="text-[10px] text-gray-400">
                            {new Date(reply.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-0.5">
                          {reply.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="ml-[52px] mt-3">
                <button className="text-xs font-semibold text-primary-600 hover:underline">
                  Balas
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
