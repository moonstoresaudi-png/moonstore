import { useEffect, useRef } from 'react';

// شريط متحرك بالجافاسكربت بدل CSS animation — يضمن إنه يستمر للأبد بدون ما
// يتوقف أو تصير الشاشة فاضية، بغض النظر عن أي إعدادات متصفح أو تعارض CSS.
// يحسب عرض نصف المحتوى (المكرر) في كل إطار ويلف تلقائيًا (modulo) بدل ما
// يعتمد على @keyframes ثابتة.
export default function useMarquee(speedPxPerSec = 45) {
  const trackRef = useRef(null);

  useEffect(() => {
    let raf;
    let last = performance.now();
    let pos = 0;

    const step = (now) => {
      const dt = Math.min((now - last) / 1000, 0.1); // نحدّ الفرق حتى ما تصير قفزة كبيرة بعد رجوع التبويب من الخلفية
      last = now;
      const el = trackRef.current;
      if (el) {
        const half = el.scrollWidth / 2;
        if (half > 0) {
          pos += speedPxPerSec * dt;
          if (pos >= half) pos -= half;
          el.style.transform = `translateX(-${pos}px)`;
        }
      }
      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [speedPxPerSec]);

  return trackRef;
}
