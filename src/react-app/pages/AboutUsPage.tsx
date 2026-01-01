import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Target, Heart, Zap, Globe, BookOpen, MessageSquare, Sparkles } from 'lucide-react';

export default function AboutUsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* 头部 */}
      <div className="mb-12 text-center">
        <div className="inline-flex p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl mb-6">
          <Users className="h-16 w-16 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">关于职场Story</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          连接职场人士，分享经验故事，共同成长进步
        </p>
      </div>

      {/* 使命愿景 */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white rounded-2xl shadow-sm border p-8">
          <div className="flex items-center gap-3 mb-6">
            <Target className="h-8 w-8 text-blue-600" />
            <h2 className="text-2xl font-semibold text-gray-900">我们的使命</h2>
          </div>
          <p className="text-gray-700 mb-4">
            为职场人士打造一个专业、温暖的交流平台，帮助每个人在职业生涯中找到方向、获得成长、实现价值。
          </p>
          <p className="text-gray-700">
            我们相信，每个人的职场经历都是一本值得分享的故事，每个问题都可能成为他人前进的明灯。
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-8">
          <div className="flex items-center gap-3 mb-6">
            <Globe className="h-8 w-8 text-purple-600" />
            <h2 className="text-2xl font-semibold text-gray-900">我们的愿景</h2>
          </div>
          <p className="text-gray-700 mb-4">
            成为全球最值得信赖的职场成长社区，让每个职场人都能在这里找到支持、获得启发、实现突破。
          </p>
          <p className="text-gray-700">
            我们致力于构建一个包容、互助、专业的职场生态系统，帮助人们在工作与生活中找到更好的平衡。
          </p>
        </div>
      </div>

      {/* 核心价值 */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">我们的核心价值</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-blue-50 rounded-xl p-6 text-center">
            <div className="inline-flex p-3 bg-blue-100 rounded-full mb-4">
              <Heart className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">真诚互助</h3>
            <p className="text-gray-600 text-sm">真诚交流，互相帮助，共同成长</p>
          </div>

          <div className="bg-purple-50 rounded-xl p-6 text-center">
            <div className="inline-flex p-3 bg-purple-100 rounded-full mb-4">
              <Zap className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">专业实用</h3>
            <p className="text-gray-600 text-sm">提供专业、实用的职场内容与建议</p>
          </div>

          <div className="bg-green-50 rounded-xl p-6 text-center">
            <div className="inline-flex p-3 bg-green-100 rounded-full mb-4">
              <Sparkles className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">创新突破</h3>
            <p className="text-gray-600 text-sm">鼓励创新思维，突破职业瓶颈</p>
          </div>

          <div className="bg-amber-50 rounded-xl p-6 text-center">
            <div className="inline-flex p-3 bg-amber-100 rounded-full mb-4">
              <Users className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">社区共享</h3>
            <p className="text-gray-600 text-sm">共建共享，让知识在社区中流动</p>
          </div>
        </div>
      </div>

      {/* 主要功能 */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">我们的主要功能</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-sm border p-8">
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <h3 className="text-2xl font-semibold text-gray-900">职场story</h3>
            </div>
            <p className="text-gray-700 mb-4">
              创作和阅读真实的职场故事，从他人的经历中获得启示，在虚拟的故事中体验真实的职场人生。
            </p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                真实职场案例改编
              </li>
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                专业职场经验分享
              </li>
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                互动式阅读体验
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border p-8">
            <div className="flex items-center gap-3 mb-6">
              <MessageSquare className="h-8 w-8 text-purple-600" />
              <h3 className="text-2xl font-semibold text-gray-900">职场问答</h3>
            </div>
            <p className="text-gray-700 mb-4">
              提出您的职场困惑，获取专业解答；分享您的经验智慧，帮助他人成长。专业、及时、实用的职场问题交流社区。
            </p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 bg-purple-500 rounded-full"></div>
                专业职场导师解答
              </li>
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 bg-purple-500 rounded-full"></div>
                实时问题讨论交流
              </li>
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 bg-purple-500 rounded-full"></div>
                结构化知识沉淀
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 创始故事 */}
      <div className="mb-12">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">创始故事</h2>
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-gray-700 mb-4">
              职场Story诞生于2026年，源于创始团队在自身职场经历中的深切体会。我们经历了职场新人期的迷茫，面对过职业转型的挑战，也品尝过突破瓶颈的喜悦。
            </p>
            <p className="text-gray-700 mb-4">
              我们发现，职场中最大的财富不是薪资，而是经验；最大的障碍不是能力，而是信息不对称。然而，宝贵的职场经验往往散落在各个角落，难以被系统性地分享和传承。
            </p>
            <p className="text-gray-700 mb-4">
              于是，我们决定创建一个平台，让职场经验以故事的形式被记录，以问答的方式被传播，让每个职场人都不再孤独前行。
            </p>
            <p className="text-gray-700 font-medium">
              从一个人的思考，到一群人的实践，再到一个社区的共同成长——这就是职场Story的故事。
            </p>
          </div>
        </div>
      </div>

      {/* 联系我们 */}
      <div className="bg-white rounded-2xl shadow-sm border p-8 mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">加入我们</h2>
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-gray-700 mb-6">
            无论您是职场新人、资深专家，还是对职场话题充满热情的人，职场Story都欢迎您的加入。
          </p>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 p-6 rounded-xl">
              <h4 className="font-semibold text-gray-900 mb-2">分享您的故事</h4>
              <p className="text-sm text-gray-600">用文字记录您的职场经历，启发他人</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl">
              <h4 className="font-semibold text-gray-900 mb-2">解答他人困惑</h4>
              <p className="text-sm text-gray-600">用您的经验帮助他人少走弯路</p>
            </div>
          </div>
          <div className="p-6 bg-blue-50 rounded-xl">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">联系我们</h3>
            <p className="text-gray-700 mb-2">如有合作、建议或疑问，请随时联系我们：</p>
            <p className="text-lg font-medium text-blue-600 mb-4">115382613@qq.com</p>
            <p className="text-gray-600 text-sm">我们会在24小时内回复您的邮件</p>
          </div>
        </div>
      </div>

      {/* 返回链接 */}
      <div className="text-center">
        <Link
          to="/"
          className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-md transition"
        >
          开始探索职场Story
        </Link>
      </div>
    </div>
  );
}