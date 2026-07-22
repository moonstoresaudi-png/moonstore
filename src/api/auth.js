// طبقة مصادقة بسيطة فوق Supabase Auth، بديلة لـ base44 auth SDK.
import { supabase } from '@/lib/supabaseClient';

async function fetchProfile(userId) {
  const { data } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
  return data;
}

export const auth = {
  // يرجّع المستخدم الحالي (مع role من جدول profiles) أو يرمي خطأ إن لم يكن مسجّل دخول
  async me() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) throw error || new Error('لا يوجد مستخدم مسجّل دخول');
    const profile = await fetchProfile(user.id);
    return {
      id: user.id,
      email: user.email,
      full_name: profile?.full_name || user.user_metadata?.full_name || '',
      role: profile?.role || 'user',
    };
  },

  async loginViaEmailPassword(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  },

  async register({ email, password, full_name }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name } },
    });
    if (error) throw error;
    return data;
  },

  loginWithProvider(provider = 'google', redirectPath = '/') {
    const redirectTo = `${window.location.origin}${redirectPath}`;
    return supabase.auth.signInWithOAuth({ provider, options: { redirectTo } });
  },

  async logout() {
    await supabase.auth.signOut();
  },

  async resetPasswordRequest(email) {
    const redirectTo = `${window.location.origin}/reset-password`;
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    if (error) throw error;
  },

  async resetPassword({ newPassword }) {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw error;
  },

  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
  },
};
