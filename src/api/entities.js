// طبقة وصول بيانات بسيطة فوق Supabase، بديلة لـ base44 SDK.
// كل "Entity" هنا يمثّل جدول في قاعدة البيانات (راجع supabase/schema.sql).
import { supabase } from '@/lib/supabaseClient';

// النماذج القديمة تستخدم created_date كاسم حقل التاريخ، بينما جدولنا
// يسمّيه created_at — هذه الدالة تضيف alias حتى تشتغل كل الصفحات بدون تعديل إضافي.
function withCreatedDate(row) {
  if (!row) return row;
  return { ...row, created_date: row.created_date ?? row.created_at };
}

function withCreatedDateList(rows) {
  return (rows || []).map(withCreatedDate);
}

// يحوّل معامل الترتيب بأسلوب base44 (مثال: '-created_date') إلى شكل Supabase
function parseSort(sort) {
  if (!sort) return null;
  const desc = sort.startsWith('-');
  const field = desc ? sort.slice(1) : sort;
  const column = field === 'created_date' ? 'created_at' : field;
  return { column, ascending: !desc };
}

// يحوّل شروط الفلترة البسيطة (تساوي، أو {$gt: value}) إلى استعلام Supabase
function applyFilters(query, filters = {}) {
  let q = query;
  for (const [key, value] of Object.entries(filters)) {
    if (value && typeof value === 'object' && '$gt' in value) {
      q = q.gt(key, value.$gt);
    } else if (value && typeof value === 'object' && '$gte' in value) {
      q = q.gte(key, value.$gte);
    } else if (value && typeof value === 'object' && '$lt' in value) {
      q = q.lt(key, value.$lt);
    } else if (value && typeof value === 'object' && '$lte' in value) {
      q = q.lte(key, value.$lte);
    } else {
      q = q.eq(key, value);
    }
  }
  return q;
}

function createEntity(table) {
  return {
    async list(sort = '-created_date', limit = 50) {
      let q = supabase.from(table).select('*');
      const s = parseSort(sort);
      if (s) q = q.order(s.column, { ascending: s.ascending });
      if (limit) q = q.limit(limit);
      const { data, error } = await q;
      if (error) throw error;
      return withCreatedDateList(data);
    },

    async filter(filters = {}, sort = '-created_date', limit = 50) {
      let q = supabase.from(table).select('*');
      q = applyFilters(q, filters);
      const s = parseSort(sort);
      if (s) q = q.order(s.column, { ascending: s.ascending });
      if (limit) q = q.limit(limit);
      const { data, error } = await q;
      if (error) throw error;
      return withCreatedDateList(data);
    },

    async get(id) {
      const { data, error } = await supabase.from(table).select('*').eq('id', id).single();
      if (error) throw error;
      return withCreatedDate(data);
    },

    async create(payload) {
      const { data, error } = await supabase.from(table).insert(payload).select().single();
      if (error) throw error;
      return withCreatedDate(data);
    },

    async update(id, payload) {
      const { data, error } = await supabase.from(table).update(payload).eq('id', id).select().single();
      if (error) throw error;
      return withCreatedDate(data);
    },

    async delete(id) {
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) throw error;
      return true;
    },
  };
}

export const entities = {
  Product: createEntity('products'),
  Order: createEntity('orders'),
  DiscountCode: createEntity('discount_codes'),
  Supplier: createEntity('suppliers'),
};

// تتبّع طلب بأمان (زائر بدون تسجيل دخول) عبر رقم الطلب أو الجوال
export async function trackOrder(query) {
  const { data, error } = await supabase.rpc('track_order', { p_query: query });
  if (error) throw error;
  return withCreatedDateList(data);
}

// التحقق من صلاحية كود خصم قبل تطبيقه على الطلب
export async function validateDiscountCode(code) {
  const { data, error } = await supabase.rpc('validate_discount_code', { p_code: code });
  if (error) throw error;
  return data && data.length ? data[0] : null;
}

// إعدادات المتجر (صف واحد فقط في store_settings)
export const storeSettingsApi = {
  async get() {
    const { data, error } = await supabase.from('store_settings').select('*').eq('id', 1).single();
    if (error) throw error;
    return data;
  },
  async update(payload) {
    const { data, error } = await supabase
      .from('store_settings')
      .update(payload)
      .eq('id', 1)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};
