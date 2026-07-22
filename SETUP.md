# دليل التشغيل — Moon Store (مستقل بالكامل عن Base44)

هذا المشروع الآن كود عادي يعتمد على [Supabase](https://supabase.com) كباك اند
بدل Base44. اتبع الخطوات بالترتيب — تقريبًا 15 دقيقة أول مرة.

## 1) أنشئ مشروع Supabase (مجاني)

1. افتح https://supabase.com وسجّل حساب (تقدر تسجّل دخول بحساب GitHub مباشرة).
2. اضغط **New Project** → اختر اسم ومنطقة قريبة (مثلاً Frankfurt أو Singapore) وكلمة مرور لقاعدة البيانات (احفظها).
3. انتظر دقيقة لين يجهز المشروع.

## 2) شغّل ملف قاعدة البيانات

1. من القائمة الجانبية اختر **SQL Editor** → **New query**.
2. افتح ملف `supabase/schema.sql` من هذا المشروع، انسخ **محتواه كامل**، والصقه في المحرر.
3. اضغط **Run**. هذا ينشئ كل الجداول (منتجات، طلبات، أكواد خصم، موردين، إعدادات المتجر) مع كل قواعد الحماية.

## 3) وصّل المشروع بمفاتيح Supabase

1. من القائمة الجانبية: **Project Settings** → **API**.
2. انسخ **Project URL** و **anon public key**.
3. في مجلد المشروع، انسخ `.env.example` وسمّه `.env.local`، وعبّي القيمتين:
   ```
   VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
   ```

## 4) شغّل المشروع محليًا

```bash
npm install
npm run dev
```

الموقع يفتح على `http://localhost:5173`.

## 5) أنشئ حساب الأدمن (لوحة التحكم)

لوحة التحكم `/admin` الآن تتطلب تسجيل دخول حقيقي بدل رمز PIN (رمز PIN وحده
كان ما يحمي الكتابة الفعلية على قاعدة البيانات بعد ما صار المشروع مستقل).

1. افتح `/register` بالموقع وسجّل حساب بإيميلك.
2. ارجع لـ Supabase → **SQL Editor** وشغّل (استبدل الإيميل بإيميلك):
   ```sql
   update public.profiles set role = 'admin'
   where id = (select id from auth.users where email = 'your-email@example.com');
   ```
3. الآن افتح `/admin` وسجّل دخولك — بترى لوحة التحكم كاملة.

## 6) رفع صور المنتجات

مفعّل تلقائيًا — رفع الصور من لوحة التحكم (المنتجات) يخزّنها في Supabase
Storage (bucket باسم `product-images`، أنشأه ملف `schema.sql` تلقائيًا).

## 7) (اختياري) تفعيل إرسال بريد "تذكير السلة المتروكة"

هذه الميزة تحتاج خدمة بريد خارجية (Supabase وحده لا يرسل بريد مخصص من المتصفح).
الخطوات باستخدام [Resend](https://resend.com) (له خطة مجانية):

```bash
npm install -g supabase
supabase login
supabase link --project-ref your-project-ref
supabase functions deploy send-email
supabase secrets set RESEND_API_KEY=your_resend_api_key
supabase secrets set SENDER_EMAIL="Moon Store <orders@yourdomain.com>"
```

إذا ما ودّك هذه الميزة الآن، تقدر تتجاهل هذه الخطوة — باقي الموقع يشتغل عادي بدونها.

## 8) النشر (Deploy)

المشروع Vite عادي — انشره على أي استضافة ساكنة: Vercel، Netlify، Cloudflare
Pages. لا تنسَ تضيف `VITE_SUPABASE_URL` و `VITE_SUPABASE_ANON_KEY` كمتغيرات
بيئة (Environment Variables) في إعدادات الاستضافة.

```bash
npm run build
# ينتج مجلد dist/ جاهز للرفع
```

## ملاحظات مهمة

- **الصور الحالية**: استبدلت كل الصور اللي كانت مستضافة عند Base44 (الشعار،
  دليل المقاسات، صورة "قصتنا") بصور محلية مؤقتة داخل `public/images/` —
  غيّرها بصورك الحقيقية من نفس المسار، أو من خلال لوحة التحكم للمنتجات.
- **بيانات المتجر** (الجوال، الإيميل، رسوم الشحن...) صارت مركزية بالكامل —
  عدّلها من `/admin` → الإعدادات، وبتنعكس تلقائيًا بكل الموقع (التذييل، خدمة
  العملاء، الطلبات الجماعية) بدل ما تكون متفرقة بعدة ملفات.
