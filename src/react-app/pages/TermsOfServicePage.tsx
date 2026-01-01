import React from 'react';
import { Link } from 'react-router-dom';
import { Scale, BookOpen, Shield, AlertCircle, CheckCircle, FileText } from 'lucide-react';

export default function TermsOfServicePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* 头部 */}
      <div className="mb-8 text-center">
        <Scale className="h-16 w-16 text-purple-600 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">服务条款</h1>
        <p className="text-gray-600">最后更新日期：2026年1月</p>
      </div>

      {/* 内容 */}
      <div className="bg-white rounded-2xl shadow-sm border p-8">
        <div className="prose max-w-none">
          {/* 接受条款 */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle className="h-6 w-6" />
              接受条款
            </h2>
            <p className="text-gray-700 mb-4">
              欢迎使用职场Story！通过访问或使用我们的服务，您同意受本服务条款的约束。如果您不同意这些条款，请不要使用我们的服务。
            </p>
            <p className="text-gray-700">
              我们保留随时修改这些条款的权利。您有责任定期查看这些条款。继续使用服务即表示您接受任何修改。
            </p>
          </div>

          {/* 账户注册 */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">账户注册</h2>
            <div className="space-y-4 text-gray-700">
              <p>要使用某些服务功能，您需要注册一个账户。您同意：</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>提供准确、最新和完整的信息</li>
                <li>维护并及时更新您的账户信息</li>
                <li>对您账户下的所有活动负责</li>
                <li>立即通知我们任何未经授权的账户使用</li>
                <li>不为16岁以下儿童创建账户</li>
              </ul>
            </div>
          </div>

          {/* 可接受使用 */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <BookOpen className="h-6 w-6" />
              可接受使用
            </h2>
            <p className="text-gray-700 mb-4">您同意不会：</p>
            <ul className="list-disc pl-5 text-gray-700 space-y-2">
              <li>使用服务进行任何非法活动</li>
              <li>侵犯他人的知识产权或其他权利</li>
              <li>发布淫秽、诽谤、仇恨、暴力或威胁性内容</li>
              <li>骚扰、威胁或恐吓其他用户</li>
              <li>发送垃圾邮件、恶意软件或病毒</li>
              <li>尝试未经授权访问其他账户或系统</li>
              <li>干扰或破坏服务的正常运行</li>
              <li>创建虚假身份或冒充他人</li>
            </ul>
          </div>

          {/* 用户内容 */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">用户内容</h2>
            <div className="space-y-4 text-gray-700">
              <p>通过向服务提交内容，您声明并保证：</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>您拥有或有权使用您提交的内容</li>
                <li>内容不侵犯任何第三方的权利</li>
                <li>内容符合所有适用法律和本条款</li>
              </ul>
              <p>您保留对您内容的所有权利。但通过提交内容，您授予我们非独占、免版税、可再许可的全球许可，以使用、复制、修改、分发、公开展示和公开展示您的内容。</p>
            </div>
          </div>

          {/* 知识产权 */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">知识产权</h2>
            <div className="space-y-4 text-gray-700">
              <p>服务及其原始内容、功能、外观和设计是我们和/或许可方的专有财产。未经我们明确书面许可，您不得复制、修改、分发或创建衍生作品。</p>
              <p>职场Story名称和徽标是我们的商标。未经我们事先书面许可，您不得使用这些商标。</p>
            </div>
          </div>

          {/* 免责声明 */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Shield className="h-6 w-6" />
              免责声明
            </h2>
            <p className="text-gray-700 mb-4">服务按"原样"和"可用"提供，不提供任何明示或暗示的保证，包括但不限于适销性、特定用途适用性和不侵权的保证。</p>
            <p className="text-gray-700">我们不保证：</p>
            <ul className="list-disc pl-5 text-gray-700 space-y-2">
              <li>服务将不间断、及时、安全或无错误</li>
              <li>结果准确或可靠</li>
              <li>任何错误将得到纠正</li>
              <li>服务无病毒或其他有害组件</li>
            </ul>
          </div>

          {/* 责任限制 */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">责任限制</h2>
            <p className="text-gray-700 mb-4">在法律允许的最大范围内，我们不对任何间接、附带、特殊、后果性或惩罚性损害负责，包括但不限于利润损失、数据损失或其他无形损失，无论原因如何。</p>
            <p className="text-gray-700">我们的总责任不应超过您在过去12个月内为使用服务而支付的金额。</p>
          </div>

          {/* 终止 */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">终止</h2>
            <p className="text-gray-700 mb-4">我们可自行决定，无需通知，出于任何原因终止或暂停您的账户，包括但不限于违反本条款。</p>
            <p className="text-gray-700">终止后，您访问和使用服务的权利将立即终止。如果终止，我们无义务维护或向您提供您的数据。</p>
          </div>

          {/* 管辖法律 */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">管辖法律</h2>
            <p className="text-gray-700">本条款受中华人民共和国法律管辖，不考虑其法律冲突规定。</p>
            <p className="text-gray-700">您同意，有关本条款的任何争议应提交有管辖权的中国法院解决。</p>
          </div>

          {/* 完整协议 */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">完整协议</h2>
            <p className="text-gray-700">本条款构成您与我们之间关于使用服务的完整协议，取代所有先前或同期的通信和提议。</p>
          </div>

          {/* 联系我们 */}
          <div className="p-6 bg-purple-50 rounded-xl">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              联系我们
            </h3>
            <p className="text-gray-700 mb-4">
              如果您对本服务条款有任何疑问，请通过以下方式联系我们：
            </p>
            <div className="space-y-2">
              <p className="text-gray-700 font-medium">电子邮箱：115382613@qq.com</p>
              <p className="text-gray-700">我们将在15个工作日内回复您的咨询。</p>
            </div>
          </div>

          {/* 重要提示 */}
          <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800">
                重要：本服务条款是您与我们之间的法律协议。如果您不同意本条款的任何部分，请不要使用我们的服务。您有责任定期查看本条款的任何更改。
              </p>
            </div>
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