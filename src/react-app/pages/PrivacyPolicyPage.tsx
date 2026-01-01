import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, FileText, Lock, Eye, UserCheck, AlertCircle } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* 头部 */}
      <div className="mb-8 text-center">
        <Shield className="h-16 w-16 text-blue-600 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">隐私政策</h1>
        <p className="text-gray-600">最近更新日期：2026年1月</p>
      </div>

      {/* 内容 */}
      <div className="bg-white rounded-2xl shadow-sm border p-8">
        <div className="prose max-w-none">
          {/* 简介 */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="h-6 w-6" />
              引言
            </h2>
            <p className="text-gray-700 mb-4">
              欢迎使用职场Story！我们非常重视您的隐私保护。本隐私政策旨在帮助您了解我们如何收集、使用、存储和共享您的个人信息，以及您如何管理您的信息。
            </p>
            <p className="text-gray-700">
              请仔细阅读本隐私政策。如果您有任何疑问，请通过页面底部的联系方式与我们联系。
            </p>
          </div>

          {/* 信息收集 */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <UserCheck className="h-6 w-6" />
              我们收集的信息
            </h2>
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">1. 账户信息</h3>
              <ul className="list-disc pl-5 text-gray-700 space-y-2">
                <li>注册时提供的用户名、电子邮箱地址</li>
                <li>个人资料信息（如头像、个人简介）</li>
                <li>账户设置和安全信息</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-900">2. 内容信息</h3>
              <ul className="list-disc pl-5 text-gray-700 space-y-2">
                <li>您创建和发布的小说、提问、评论等内容</li>
                <li>与其他用户的互动记录</li>
                <li>浏览和阅读历史</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-900">3. 使用信息</h3>
              <ul className="list-disc pl-5 text-gray-700 space-y-2">
                <li>设备信息（设备类型、操作系统、浏览器类型）</li>
                <li>IP地址和地理位置信息</li>
                <li>访问时间、页面停留时间等使用数据</li>
              </ul>
            </div>
          </div>

          {/* 信息使用 */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Eye className="h-6 w-6" />
              信息使用方式
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700">我们使用收集的信息用于以下目的：</p>
              <ul className="list-disc pl-5 text-gray-700 space-y-2">
                <li>提供、维护和改进我们的服务</li>
                <li>管理您的账户和个人资料</li>
                <li>发送服务相关通知和更新</li>
                <li>保护服务的安全性和完整性</li>
                <li>提供个性化的内容和推荐</li>
                <li>分析和改进服务性能</li>
                <li>遵守法律法规要求</li>
              </ul>
            </div>
          </div>

          {/* 信息共享 */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Lock className="h-6 w-6" />
              信息共享
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700">我们不会出售您的个人信息。我们仅在以下情况下分享您的信息：</p>
              <ul className="list-disc pl-5 text-gray-700 space-y-2">
                <li>征得您的明确同意</li>
                <li>为提供您要求的服务而必要的第三方</li>
                <li>遵守法律要求或响应法律程序</li>
                <li>保护我们、其他用户或公众的权利、财产或安全</li>
                <li>在业务转让、合并或收购的情况下</li>
              </ul>
            </div>
          </div>

          {/* 数据安全 */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">数据安全</h2>
            <p className="text-gray-700 mb-4">
              我们采取适当的技术和组织措施来保护您的个人信息，防止未经授权的访问、使用、修改、披露或破坏。
            </p>
            <p className="text-gray-700">
              虽然我们努力保护您的个人信息，但请注意任何互联网传输或电子存储方法都不是100%安全的。我们无法保证信息的绝对安全。
            </p>
          </div>

          {/* 您的权利 */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">您的权利</h2>
            <div className="space-y-2 text-gray-700">
              <p>根据适用法律，您可能拥有以下权利：</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>访问您的个人信息</li>
                <li>更正不准确或不完整的个人信息</li>
                <li>删除您的个人信息</li>
                <li>限制或反对处理您的个人信息</li>
                <li>获取您的个人信息的副本</li>
                <li>撤回同意（如果处理基于同意）</li>
              </ul>
            </div>
          </div>

          {/* 儿童隐私 */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">儿童隐私</h2>
            <p className="text-gray-700">
              我们的服务不针对13岁以下的儿童。我们不会有意收集13岁以下儿童的个人信息。如果您是父母或监护人，并发现您的孩子向我们提供了个人信息，请与我们联系，我们将采取措施删除该信息。
            </p>
          </div>

          {/* 政策更新 */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">隐私政策更新</h2>
            <p className="text-gray-700 mb-4">
              我们可能会不时更新本隐私政策。如果进行重大更改，我们将在网站上发布通知，并在政策顶部更新"最后更新"日期。
            </p>
            <p className="text-gray-700">
              我们建议您定期查看本隐私政策，以了解我们如何保护您的信息。
            </p>
          </div>

          {/* 联系我们 */}
          <div className="p-6 bg-blue-50 rounded-xl">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              联系我们
            </h3>
            <p className="text-gray-700 mb-4">
              如果您对本隐私政策有任何疑问、意见或请求，请通过以下方式联系我们：
            </p>
            <div className="space-y-2">
              <p className="text-gray-700 font-medium">电子邮箱：115382613@qq.com</p>
              <p className="text-gray-700">我们将在15个工作日内回复您的咨询。</p>
            </div>
          </div>

          {/* 免责声明 */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              请注意：本中文隐私政策仅供参考。如有任何歧义，以中文版本为准。本政策不构成法律建议，如有法律问题，请咨询专业律师。
            </p>
          </div>
        </div>
      </div>

      {/* 返回链接 */}
      <div className="mt-8 text-center">
        <Link
          to="/"
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-md transition"
        >
          返回首页
        </Link>
      </div>
    </div>
  );
}