// خيارات فورم طلب الجاكيت — مطابقة لنموذج الطلب الرسمي (الاسم بالخلف / المقاس / لون الاكمام)

// التصاميم المؤطرة بالبنفسجي بالفورم الرسمي (بدون كلمة "مجاني") هي تصاميم خاصة/مخصصة
// وتضاف عليها رسوم + تتطلب صورة مرجعية من العميل لتنفيذها
export const JACKET_CUSTOM_DESIGN_FEE = 15; // ريال لكل تصميم خاص واحد

export const JACKET_FRONT_DESIGNS = [
  { id: 1, label: 'تصميم أمامي 1', free: true },
  { id: 2, label: 'تصميم أمامي 2', free: false },
];

export const JACKET_LEFT_SLEEVE_DESIGNS = [
  { id: 3, label: 'كم أيسر — تصميم 3', free: true },
  { id: 4, label: 'كم أيسر — تصميم 4', free: true },
  { id: 5, label: 'كم أيسر — تصميم 5', free: false },
];

export const JACKET_RIGHT_SLEEVE_DESIGNS = [
  { id: 6, label: 'كم أيمن — تصميم 6', free: true },
  { id: 7, label: 'كم أيمن — تصميم 7', free: true },
  { id: 8, label: 'كم أيمن — تصميم 8', free: false },
];

export const JACKET_BACK_DESIGN = { id: 9, label: 'تصميم الظهر', free: true };
