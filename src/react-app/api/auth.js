// E:\zhihuguali\src\react-app\api\auth.js
import { supabase } from '../../lib/supabase'; // 根据你的实际路径调整

// 忘记密码 - 发送重置邮件
export const forgotPassword = async (email) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    
    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error('Forgot password error:', error);
    return { 
      success: false, 
      error: error.message || '发送重置邮件失败' 
    };
  }
};