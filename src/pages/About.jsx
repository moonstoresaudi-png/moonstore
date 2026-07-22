import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import BrandStory from '@/components/sections/BrandStory';
import CustomerService from '@/components/sections/CustomerService';
import SocialLinks from '@/components/sections/SocialLinks';
import { Award, Heart, Sparkles, Users, Target, Eye } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <div className="text-center mb-12">
          <span className="chip bg-accent/40 text-primary mb-3">قصتنا</span>
          <h1 className="font-heading text-3xl sm:text-5xl font-extrabold">من <span className="text-grad-violet">نحن</span></h1>
          <p className="text-foreground/60 mt-4 max-w-2xl mx-auto leading-relaxed">
            Moon Store علامة سعودية متخصصة في أرواب وملحقات التخرج الفاخرة. بدأت رحلتنا من شغف بصناعة لحظات لا تُنسى لخريجي الجامعات، لنقدّم منتجات تجمع بين الأصالة والأناقة العصرية.
          </p>
        </div>

        <div className="card-soft overflow-hidden mb-10">
          <img src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&h=400&fit=crop" alt="Moon Store" className="w-full h-48 sm:h-64 object-cover" />
        </div>

        <div className="grid md:grid-cols-3 gap-5 mb-12">
          {[
            { icon: Target, title: 'رسالتنا', text: 'تمكين كل خريج من الاحتفال بإنجازه بأناقة تليق بتعبه، بمنتجات فاخرة بأسعار عادلة.' },
            { icon: Eye, title: 'رؤيتنا', text: 'أن نكون الخيار الأول لملحقات التخرج في المملكة، بخامات راقية وتطريز يدوي أصيل.' },
            { icon: Heart, title: 'قيمنا', text: 'الجودة، الأصالة، الاهتمام بأدق التفاصيل، ورضا العملاء فوق كل اعتبار.' },
          ].map((v, i) => (
            <div key={i} className="card-soft p-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4"><v.icon className="w-7 h-7 text-primary" /></div>
              <h3 className="font-heading font-bold text-lg mb-2">{v.title}</h3>
              <p className="text-sm text-foreground/60 leading-relaxed">{v.text}</p>
            </div>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {[
            { icon: Users, value: '+5000', label: 'خريج سعيد' },
            { icon: Award, value: '+8', label: 'سنوات خبرة' },
            { icon: Sparkles, value: '+50', label: 'تصميم حصري' },
            { icon: Heart, value: '4.9★', label: 'تقييم العملاء' },
          ].map((s, i) => (
            <div key={i} className="card-soft p-5 text-center">
              <s.icon className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="font-heading text-2xl font-extrabold">{s.value}</p>
              <p className="text-xs text-foreground/55">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="card-soft p-6 sm:p-8">
          <h2 className="font-heading font-bold text-xl mb-4">لماذا Moon Store؟</h2>
          <ul className="space-y-3 text-sm text-foreground/70">
            <li className="flex gap-3"><span className="text-primary font-bold">✦</span> خامات فاخرة مستوردة بأجود الأنواع</li>
            <li className="flex gap-3"><span className="text-primary font-bold">✦</span> تطريز ذهبي يدوي بحرفية عالية</li>
            <li className="flex gap-3"><span className="text-primary font-bold">✦</span> إمكانية تصميم وشاحك بالاسم والخط الذي تختاره</li>
            <li className="flex gap-3"><span className="text-primary font-bold">✦</span> توصيل سريع لجميع مناطق المملكة</li>
            <li className="flex gap-3"><span className="text-primary font-bold">✦</span> ضمان الجودة وسياسة إرجاع مرنة</li>
          </ul>
        </div>

        <div className="mt-12">
         <BrandStory />
        </div>
        <div className="mt-12">
         <CustomerService />
        </div>
        <div className="mt-12">
         <SocialLinks />
        </div>
        </main>
        <Footer />
      <CartDrawer />
    </div>
  );
}