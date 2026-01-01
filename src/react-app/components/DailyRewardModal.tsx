import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient'; 
import { useAuth } from '../../contexts/AuthContext';
import { Gift, Sparkles, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function DailyRewardModal() {
  const { user } = useAuth();
  const [show, setShow] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (user) {
      checkStatus();
    }
  }, [user]);

  const checkStatus = async () => {
    if (!user) return;
    
    const today = new Date().toISOString().split('T')[0];
    
    // 检查本地缓存
    const localLock = localStorage.getItem(`daily_reward_lock_${user.id}`);
    
    if (localLock === today) {
      return; // 今天已从本地缓存领取
    } 
    
    try {
      // 检查数据库中的最后领取时间
      const { data, error } = await supabase
        .from('profiles')
        .select('last_login_reward, coins, username')
        .eq('id', user.id)
        .single();
        
      if (error) {
        console.error('查询用户信息失败:', error);
        return;
      }
      
      // 检查今天是否已领取
      if (data.last_login_reward !== today) {
        // 可以领取，显示弹窗
        setTimeout(() => {
          setShow(true);
          localStorage.setItem(`daily_reward_lock_${user.id}`, today);
        }, 1500);
      } else {
        // 今天已经领取过了，更新本地缓存
        localStorage.setItem(`daily_reward_lock_${user.id}`, today);
      }
    } catch (err) {
      console.error('检查状态异常:', err);
    }
  };

  const handleClaim = async () => {
    if (!user) return;
    
    setClaiming(true);
    setErrorMsg('');
    
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // 先检查今天是否已领取
      const { data: checkData } = await supabase
        .from('profiles')
        .select('last_login_reward, coins')
        .eq('id', user.id)
        .single();
        
      if (checkData && checkData.last_login_reward === today) {
        throw new Error('今天已经领取过奖励了');
      }
      
      // 获取当前谷子币
      const currentCoins = checkData?.coins || 0;
      const newCoins = currentCoins + 50;
      
      // 方法1: 尝试使用函数
      try {
        const { data: rpcData, error: rpcError } = await supabase.rpc('award_coins_to_pool', {
          u_id: user.id,
          reward_type: 'daily_login',
          pool_name: 'daily',
          amount: 50,
          log_reason: '每日登录奖励'
        });
        
        if (rpcError) {
          console.warn('RPC失败，使用直接更新:', rpcError);
          throw rpcError;
        }
        
        console.log('RPC调用成功:', rpcData);
        
        if (rpcData && rpcData.is_success === false) {
          throw new Error(rpcData.message || '领取失败');
        }
      } catch (funcError) {
        // 方法2: 直接更新
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ 
            coins: newCoins,
            last_login_reward: today,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id);
          
        if (updateError) {
          throw new Error(`更新失败: ${updateError.message}`);
        }
        
        // 添加交易记录
        await supabase.from('coin_logs').insert({
          user_id: user.id,
          amount: 50,
          reason: '每日登录奖励',
          reward_type: 'daily_login',
          created_at: new Date().toISOString()
        });
      }
      
      // 标记为成功
      setIsSuccess(true);
      
      // 更新本地缓存
      localStorage.setItem(`daily_reward_lock_${user.id}`, today);
      
      // 3秒后关闭并刷新
      setTimeout(() => {
        setShow(false);
        window.location.reload();
      }, 3000);
      
    } catch (err) {
      console.error('领取奖励失败:', err);
      setErrorMsg(err.message || '领取失败，请稍后重试');
      
      setTimeout(() => {
        setShow(false);
      }, 3000);
    } finally {
      setClaiming(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-sm bg-gradient-to-b from-red-500 to-red-600 rounded-[3rem] p-8 shadow-2xl text-center animate-in zoom-in duration-500">
        {/* 已移除调试信息 */}
        
        <Sparkles className="absolute top-10 left-10 text-yellow-300 animate-pulse" />
        <Sparkles className="absolute top-10 right-10 text-yellow-300 animate-pulse" />
        
        <div className="bg-white/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          {isSuccess ? (
            <CheckCircle2 className="h-10 w-10 text-yellow-300 animate-bounce" />
          ) : claiming ? (
            <Loader2 className="h-10 w-10 text-white animate-spin" />
          ) : (
            <Gift className="h-10 w-10 text-white animate-bounce" />
          )}
        </div>

        <h2 className="text-2xl font-black text-white mb-2 tracking-tight">
          {isSuccess ? "领取成功！" : errorMsg ? "领取失败" : "每日登录奖励"}
        </h2>
        
        <p className="text-red-100 font-bold text-sm mb-8">
          {isSuccess ? "谷子币已存入账户" : 
           errorMsg ? "请稍后再试" : "开启今天的好运"}
        </p>

        <div className="bg-white rounded-[2rem] p-6 mb-6 shadow-xl relative min-h-[160px] flex flex-col justify-center">
          {claiming ? (
            <div className="py-4 flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 text-red-500 animate-spin" />
              <span className="font-black text-red-500 text-xs">正在发放奖励...</span>
            </div>
          ) : isSuccess ? (
            <div className="py-4 flex flex-col items-center animate-in zoom-in">
              <div className="flex items-baseline gap-1 text-green-600 mb-2">
                <span className="text-5xl font-black">+50</span>
                <span className="text-sm font-bold">谷子币</span>
              </div>
              <p className="text-gray-400 text-xs font-bold">页面即将自动刷新...</p>
            </div>
          ) : errorMsg ? (
            <div className="py-4 flex flex-col items-center gap-2">
              <AlertCircle className="h-12 w-12 text-red-400" />
              <p className="text-red-500 font-semibold">领取失败</p>
              <p className="text-gray-500 text-sm mt-2">{errorMsg}</p>
              <button 
                onClick={() => setShow(false)}
                className="mt-4 px-6 py-2 bg-red-500 text-white rounded-full font-semibold hover:bg-red-600 transition-colors"
              >
                关闭
              </button>
            </div>
          ) : (
            <>
              <div className="flex flex-col items-center mb-4">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-5xl font-black text-red-600">50</span>
                  <span className="text-lg font-black text-red-400">谷子币</span>
                </div>
                <p className="text-gray-500 text-sm">每天登录即可领取</p>
              </div>
              
              <button 
                onClick={handleClaim} 
                disabled={claiming}
                className="w-full py-4 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-white font-black rounded-2xl shadow-[0_8px_0_0_#d97706] active:shadow-[0_2px_0_0_#d97706] active:translate-y-1 transition-all text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                立即领取
              </button>
            </>
          )}
        </div>
        
        {!isSuccess && !errorMsg && (
          <button 
            onClick={() => setShow(false)} 
            className="text-red-100 text-xs font-bold hover:text-white transition-colors px-4 py-2 rounded-full hover:bg-white/10"
          >
            下次再说
          </button>
        )}
      </div>
    </div>
  );
}