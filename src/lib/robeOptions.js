// خيارات تفصيلية لتصميم الروب/العباية والوشاح والكاب — مطابقة لورقة الخيارات
// الرسمية اللي تستخدمها متجر مون مع عملائها حاليًا ("خذ القلم للاختيار").

// شكل الروب — كل شكل له تكلفة إضافية (تُقرأ من إعدادات المنتج بالأدمن)
export const ROBE_SHAPES = [
  { id: 'plain', label: 'عادي بدون كسرات بالكتف', addonKey: null },
  { id: 'pleated', label: 'عادي بكسرات بالكتف', addonKey: null },
  { id: 'cloche', label: 'كلوش أو نص كلوش', addonKey: 'cloche_addon' },
  { id: 'bisht', label: 'عباية بشت', addonKey: 'bisht_addon' },
];

// موديل الكم
export const SLEEVE_STYLES = [
  { id: 'plain', label: 'سادة' },
  { id: 'double_line', label: 'خطين', hint: 'نفس لون الروب' },
  { id: 'wide_edge', label: 'طرف عريض', hint: 'مثل لون الوشاح' },
  { id: 'braid', label: 'قيطان', hint: 'ذهبي وفضي فقط' },
  { id: 'double_face', label: 'دبل فيس' },
  { id: 'double_face_bow', label: 'دبل فيس وفيونكة' },
  { id: 'open_cuff', label: 'اكمام بفتحه' },
  { id: 'open_cuff_bow', label: 'اكمام بفتحه وفيونكه' },
  { id: 'hemmed', label: 'تحديد' },
  { id: 'hemmed_bow', label: 'تحديد وفيونكه' },
];

// شكل الوشاح
export const SASH_SHAPES = [
  { id: 'regular', label: 'عادي' },
  { id: 'triangle_back', label: 'مثلث من الخلف' },
  { id: 'arched_back', label: 'مقوس من الخلف' },
  { id: 'triangle_front_back', label: 'مثلث من الامام والخلف' },
  { id: 'round_short', label: 'دائري قصير' },
  { id: 'round_long', label: 'دائري طويل' },
];

// طرف الوشاح (قيطان أم لا)
export const SASH_TRIM = [
  { id: 'braid', label: 'قيطان ذهبي وفضي' },
  { id: 'none', label: 'بدون قيطان' },
];

// اتجاه التطريز على الوشاح
export const EMBROIDERY_DIRECTIONS = [
  { id: 'length', label: 'إتجاة بالطول' },
  { id: 'width', label: 'إتجاة بالعرض' },
];

// تصاميم تطريز القبعة الجاهزة — كل تصميم بنفس التسمية المستخدمة بورقة الخيارات
export const CAP_EMBROIDERY_DESIGNS = [
  { id: 1, label: 'فراشات' },
  { id: 2, label: 'I did it (هيكل عظمي)' },
  { id: 3, label: 'أجنحة' },
  { id: 4, label: 'Class of 2026 (إكليل)' },
  { id: 5, label: 'إكليل 2026' },
  { id: 6, label: 'I did it (إكليل)' },
  { id: 7, label: 'I did it and Felt victorious' },
  { id: 8, label: 'هيكل عظمي طائر' },
  { id: 9, label: 'I DID IT 2026 (فراشات)' },
  { id: 10, label: 'I Did it (نجوم)' },
  { id: 11, label: 'GRADUATE 2026 (نجوم)' },
  { id: 12, label: 'كاب + أجنحة 2026' },
  { id: 13, label: 'SENIOR SURVIVORS 2026' },
  { id: 14, label: 'Finally I DID IT (هيكل عظمي)' },
  { id: 15, label: 'إكليل دائري' },
  { id: 16, label: 'I DID IT 2026 (نجوم)' },
];

// تصاميم "عام التخرج" الجاهزة (بديل عن كتابة السنة يدويًا)
export const GRAD_YEAR_DESIGNS = [
  { id: 1, label: '2026 (عمودي مزخرف)' },
  { id: 2, label: 'CLASS OF 2026' },
  { id: 3, label: '2026 + 1447 (كاب)' },
  { id: 4, label: '2026 (كاب)' },
  { id: 5, label: '2026 (أرقام مرصوصة)' },
];

// خطوط التطريز على الوشاح
export const SASH_EMBROIDERY_FONTS = [
  { id: 1, label: 'مون ستور — خط 1 (عربي مزخرف)' },
  { id: 2, label: 'مون ستور — خط 2 (عربي مزخرف)' },
  { id: 3, label: 'مون ستور — خط 3 (عربي مزخرف)' },
  { id: 4, label: 'مون ستور — خط 4 (عربي مزخرف)' },
  { id: 5, label: 'Moon — كورسيف إنجليزي' },
  { id: 6, label: 'Moon — إنجليزي عادي' },
];

// ===== عبايات الجامعة =====
export const UNIVERSITIES = [
  { id: 'taif', label: 'جامعة الطايف' },
  { id: 'umqura', label: 'جامعة أم القرى' },
  { id: 'jeddah', label: 'جامعة جدة' },
  { id: 'kau_old', label: 'جامعة الملك عبدالعزيز — الروب القديم' },
  { id: 'kau_new', label: 'جامعة الملك عبدالعزيز — الروب الجديد' },
];

// لون الكتابة على وشاح الجامعة
export const UNIVERSITY_WRITING_COLORS = [
  { id: 'silver', label: 'فضي' },
  { id: 'gold', label: 'ذهبي' },
  { id: 'white', label: 'ابيض' },
];

// طرف وشاح الجامعة
export const UNIVERSITY_SASH_TRIM = [
  { id: 'braid', label: 'قيطان فضي وذهبي' },
  { id: 'none', label: 'بدون قيطان' },
];

// نوع تصميم وشاح الجامعة — ترتيب العناصر على الوشاح
export const UNIVERSITY_SASH_LAYOUTS = [
  { id: 1, label: 'الاسم + التاريخ + الشعار' },
  { id: 2, label: 'الاسم + الشعار + التاريخ' },
  { id: 3, label: 'الاسم + التخصص + مرتبة الشرف + الشعار + التاريخ' },
  { id: 4, label: 'الشعار + مرتبة الشرف + التخصص + التاريخ' },
  { id: 5, label: 'التخصص + الاسم + التاريخ + الشعار' },
  { id: 6, label: 'الاسم + مرتبة الشرف + التاريخ + الشعار' },
  { id: 7, label: 'مرتبة الشرف + الاسم + الشعار + التاريخ' },
  { id: 8, label: 'الاسم + التاريخ' },
];

// شكل وشاح الجامعة (أبسط من وشاح الأرواب العام)
export const UNIVERSITY_SASH_SHAPES = [
  { id: 'regular', label: 'عادي' },
  { id: 'triangle_back', label: 'مثلث من الخلف' },
  { id: 'arched_back', label: 'مقوس من الخلف' },
];
