import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, AlertCircle, MessageSquare, User, Loader2 } from 'lucide-react';

export default function ContactUsPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      setError('请填写所有必填字段');
      return;
    }

    if (!formData.email.includes('@')) {
      setError('请输入有效的邮箱地址');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      // 这里可以添加实际的提交逻辑，比如调用API
      // 暂时用setTimeout模拟提交过程
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setError('提交失败，请稍后重试');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* 头部 */}
      <div className="mb-12 text-center">
        <div className="inline-flex p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl mb-6">
          <MessageSquare className="h-16 w-16 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">联系我们</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          我们期待听到您的声音。无论您有任何问题、建议或合作意向，我们都乐意与您交流。
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 mb-12">
        {/* 左侧：联系信息 */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border p-8 mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">联系信息</h2>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">电子邮箱</h3>
                  <p className="text-gray-600">115382613@qq.com</p>
                  <p className="text-sm text-gray-500 mt-1">通常在24小时内回复</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="h-12 w-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">服务时间</h3>
                  <p className="text-gray-600">周一至周五：9:00-18:00</p>
                  <p className="text-gray-600">周六、周日：10:00-17:00</p>
                  <p className="text-sm text-gray-500 mt-1">节假日可能调整</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">办公地址</h3>
                  <p className="text-gray-600">中国·杭州</p>
                  <p className="text-sm text-gray-500 mt-1">远程办公团队，覆盖全国</p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
              <h3 className="font-semibold text-gray-900 mb-2">响应承诺</h3>
              <p className="text-sm text-gray-600">
                我们承诺在工作时间内24小时内回复所有咨询，非工作时间收到的信息将在下一个工作日处理。
              </p>
            </div>
          </div>

          {/* 常见问题 */}
          <div className="bg-white rounded-2xl shadow-sm border p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">常见问题</h2>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-1">如何注册账户？</h4>
                <p className="text-sm text-gray-600">点击网站右上角"注册"按钮，按照提示完成注册流程。</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-1">如何修改个人信息？</h4>
                <p className="text-sm text-gray-600">登录后点击用户头像，进入个人主页，点击"设置"按钮进行修改。</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-1">忘记密码怎么办？</h4>
                <p className="text-sm text-gray-600">在登录页面点击"忘记密码"，按照提示重设密码。</p>
              </div>
            </div>
          </div>
        </div>

        {/* 右侧：联系表单 */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">发送消息</h2>
            
            {submitted ? (
              <div className="text-center py-12">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">消息发送成功！</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  感谢您联系我们。我们已收到您的消息，将在24小时内通过邮件回复您。
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
                >
                  发送新消息
                </button>
              </div>
            ) : (
              <>
                <p className="text-gray-600 mb-8">
                  请填写下面的表格，我们会尽快回复您。标有 * 的字段是必填的。
                </p>

                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        姓名 *
                      </label>
                      <div className="relative">
                        <div className="absolute left-3 top-3.5">
                          <User className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="请输入您的姓名"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        邮箱 *
                      </label>
                      <div className="relative">
                        <div className="absolute left-3 top-3.5">
                          <Mail className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="请输入您的邮箱"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      主题
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">请选择主题</option>
                      <option value="general">一般咨询</option>
                      <option value="technical">技术问题</option>
                      <option value="partnership">合作意向</option>
                      <option value="feedback">产品反馈</option>
                      <option value="bug">BUG报告</option>
                      <option value="other">其他</option>
                    </select>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      消息 *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      placeholder="请详细描述您的问题或需求..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      required
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                      提交即表示您同意我们的
                      <Link to="/privacy" className="text-blue-600 hover:text-blue-800 ml-1">
                        隐私政策
                      </Link>
                    </p>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-md transition disabled:opacity-50"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          发送中...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          发送消息
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>

          {/* 其他联系方式 */}
          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">紧急技术支持</h3>
              <p className="text-sm text-gray-600 mb-4">遇到紧急技术问题？</p>
              <a
                href="mailto:115382613@qq.com?subject=紧急技术支持请求"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
              >
                发送紧急邮件
              </a>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">商务合作</h3>
              <p className="text-sm text-gray-600 mb-4">有意与我们合作？</p>
              <a
                href="mailto:115382613@qq.com?subject=商务合作咨询"
                className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm"
              >
                联系商务部门
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 返回链接 */}
      <div className="text-center">
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