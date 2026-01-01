import { useState } from "react";
import { Link } from "react-router-dom";
import { Send, Tag, AlertCircle, X, Hash, Eye, Type, FileText } from "lucide-react";

function AskPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const suggestedTags = ["编程", "React", "前端", "学习", "职业发展", "写作", "小说", "技术"];

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim()) && tags.length < 5) {
        setTags([...tags, tagInput.trim()]);
        setTagInput("");
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert("请填写标题和问题详情");
      return;
    }
    alert("问题提交成功！");
    setTitle("");
    setContent("");
    setTags([]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">提问</h1>
          <p className="text-gray-600">写下你的问题，获得专业回答</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 问题标题 */}
          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <label className="block text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Type className="h-5 w-5 mr-2 text-blue-600" />
              问题标题
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="用一句话描述你的问题（例如：如何从零开始学习编程？）"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              maxLength={100}
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-sm text-gray-500">清晰的问题标题更容易获得回答</p>
              <span className="text-sm text-gray-500">{title.length}/100</span>
            </div>
          </div>

          {/* 问题详情 */}
          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <label className="block text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-green-600" />
              问题详情
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="详细描述你的问题，包括：背景情况、具体需求、遇到的困难、已尝试的解决方案等..."
              rows={8}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-sm text-gray-500">详细的描述有助于获得更准确的回答</p>
              <span className="text-sm text-gray-500">{content.length}/5000</span>
            </div>
          </div>

          {/* 标签 */}
          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <label className="block text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Tag className="h-5 w-5 mr-2 text-purple-600" />
              添加标签
              <span className="text-sm text-gray-500 font-normal ml-2">（最多5个，按回车添加）</span>
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
              <Hash className="h-5 w-5 text-gray-400 mr-2" />
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="输入标签，如：编程、学习、React..."
                className="flex-1 outline-none"
              />
            </div>

            {/* 已选标签 */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 hover:text-blue-900"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* 推荐标签 */}
            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-2">推荐标签：</p>
              <div className="flex flex-wrap gap-2">
                {suggestedTags.map((tag) => (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => {
                      if (!tags.includes(tag) && tags.length < 5) {
                        setTags([...tags, tag]);
                      }
                    }}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 提示卡片 */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
            <div className="flex items-start">
              <AlertCircle className="h-6 w-6 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-lg font-semibold text-blue-800 mb-2">提问指南</h4>
                <ul className="text-blue-700 space-y-1">
                  <li>• 问题要具体明确，避免模糊不清</li>
                  <li>• 描述清楚你的背景和遇到的问题</li>
                  <li>• 添加相关标签，便于更多人看到</li>
                  <li>• 格式清晰，适当使用分段和列表</li>
                  <li>• 问题解决后，记得采纳最佳答案</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex items-center justify-between pt-6 border-t">
            <div className="flex items-center text-gray-600">
              <Eye className="h-4 w-4 mr-2" />
              发布后所有人可见
            </div>
            <div className="flex gap-4">
              <Link
                to="/questions"
                type="button"
                className="px-8 py-3 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50"
              >
                取消
              </Link>
              <button
                type="submit"
                className="flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold hover:shadow-lg transition"
              >
                <Send className="h-5 w-5 mr-2" />
                发布问题
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AskPage;