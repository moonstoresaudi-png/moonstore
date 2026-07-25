import React, { useEffect, useRef } from 'react';

const MOYASAR_JS = 'https://cdn.moyasar.com/mpf/1.15.0/moyasar.js';
const MOYASAR_CSS = 'https://cdn.moyasar.com/mpf/1.15.0/moyasar.css';

export default function MoyasarPayment({ amount, description, callbackUrl }) {
  const mountRef = useRef(null);
  const key = import.meta.env.VITE_MOYASAR_PUBLISHABLE_KEY;

  useEffect(() => {
    if (!key) return;

    if (!document.getElementById('moyasar-css')) {
      const link = document.createElement('link');
      link.id = 'moyasar-css';
      link.rel = 'stylesheet';
      link.href = MOYASAR_CSS;
      document.head.appendChild(link);
    }

    const initForm = () => {
      if (!mountRef.current || !window.Moyasar) return;
      window.Moyasar.init({
        element: mountRef.current,
        amount: Math.round(amount * 100), // بالهللة
        currency: 'SAR',
        description,
        publishable_api_key: key,
        callback_url: callbackUrl,
        methods: ['creditcard', 'applepay', 'stcpay'],
      });
    };

    if (window.Moyasar) {
      initForm();
    } else if (!document.getElementById('moyasar-js')) {
      const script = document.createElement('script');
      script.id = 'moyasar-js';
      script.src = MOYASAR_JS;
      script.onload = initForm;
      document.body.appendChild(script);
    } else {
      document.getElementById('moyasar-js').addEventListener('load', initForm);
    }
  }, [amount, description, callbackUrl, key]);

  if (!key) {
    return (
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-800">
        بوابة الدفع (Moyasar) لسه ما اترتبطت — لازم تضيف <code className="font-mono">VITE_MOYASAR_PUBLISHABLE_KEY</code> بإعدادات Vercel.
      </div>
    );
  }

  return <div ref={mountRef} className="mysr-form" />;
}
