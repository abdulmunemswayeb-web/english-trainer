/* مرجع المفردات الإنجليزية A1 → B2
   المصدر: English Vocabulary Reference (مرجع المفردات الإنجليزية) */
window.VOCAB_LEVELS = [
  { id: 'A1', name: 'A1 — Beginner',           nameAr: 'المبتدئ',        color: '#22c55e' },
  { id: 'A2', name: 'A2 — Elementary',         nameAr: 'الأساسي',        color: '#38bdf8' },
  { id: 'B1', name: 'B1 — Pre-Intermediate',   nameAr: 'ما قبل المتوسط', color: '#a78bfa' },
  { id: 'B2', name: 'B2 — Upper-Intermediate', nameAr: 'فوق المتوسط',    color: '#f59e0b' }
];

window.VOCAB_GROUPS = [
  /* ============================ A1 ============================ */
  { level: 'A1', category: 'Greetings & Basics', categoryAr: 'تحيات وأساسيات', icon: '👋', items: [
    { en: 'Hello',             ar: 'مرحبا' },
    { en: 'Good morning',      ar: 'صباح الخير' },
    { en: 'Good evening',      ar: 'مساء الخير' },
    { en: 'Goodbye',           ar: 'مع السلامة' },
    { en: 'Please',            ar: 'من فضلك' },
    { en: 'Thank you',         ar: 'شكرا' },
    { en: 'Yes / No',          ar: 'نعم / لا' },
    { en: 'Sorry',             ar: 'آسف' },
    { en: 'Excuse me',         ar: 'عفوا' },
    { en: 'My name is...',     ar: 'اسمي...' }
  ]},
  { level: 'A1', category: 'Numbers', categoryAr: 'الأرقام', icon: '🔢', items: [
    { en: 'One / Two / Three', ar: 'واحد / اثنان / ثلاثة' },
    { en: 'Ten',               ar: 'عشرة' },
    { en: 'Twenty',            ar: 'عشرون' },
    { en: 'Hundred',           ar: 'مئة' },
    { en: 'First / Second',    ar: 'الأول / الثاني' }
  ]},
  { level: 'A1', category: 'Family', categoryAr: 'العائلة', icon: '👨‍👩‍👧', items: [
    { en: 'Family',            ar: 'عائلة' },
    { en: 'Father',            ar: 'أب' },
    { en: 'Mother',            ar: 'أم' },
    { en: 'Brother',           ar: 'أخ' },
    { en: 'Sister',            ar: 'أخت' },
    { en: 'Son / Daughter',    ar: 'ابن / ابنة' },
    { en: 'Friend',            ar: 'صديق' }
  ]},
  { level: 'A1', category: 'Colors', categoryAr: 'الألوان', icon: '🎨', items: [
    { en: 'Red',               ar: 'أحمر' },
    { en: 'Blue',              ar: 'أزرق' },
    { en: 'Green',             ar: 'أخضر' },
    { en: 'Black / White',     ar: 'أسود / أبيض' },
    { en: 'Yellow',            ar: 'أصفر' }
  ]},
  { level: 'A1', category: 'Daily Verbs', categoryAr: 'أفعال يومية', icon: '🏃', items: [
    { en: 'To be',             ar: 'يكون' },
    { en: 'To have',           ar: 'يملك' },
    { en: 'To go',             ar: 'يذهب' },
    { en: 'To eat',            ar: 'يأكل' },
    { en: 'To drink',          ar: 'يشرب' },
    { en: 'To sleep',          ar: 'ينام' },
    { en: 'To work',           ar: 'يعمل' },
    { en: 'To live',           ar: 'يعيش' },
    { en: 'To speak',          ar: 'يتحدث' },
    { en: 'To want',           ar: 'يريد' },
    { en: 'To like',           ar: 'يحب' },
    { en: 'To see',            ar: 'يرى' }
  ]},
  { level: 'A1', category: 'Time', categoryAr: 'الوقت', icon: '🕐', items: [
    { en: 'Today',             ar: 'اليوم' },
    { en: 'Tomorrow',          ar: 'غدا' },
    { en: 'Yesterday',         ar: 'أمس' },
    { en: 'Now',               ar: 'الآن' },
    { en: 'Day / Week / Month',ar: 'يوم / أسبوع / شهر' },
    { en: 'Morning / Night',   ar: 'صباح / ليل' }
  ]},
  { level: 'A1', category: 'Food & Drink', categoryAr: 'الطعام والشراب', icon: '🍞', items: [
    { en: 'Water',             ar: 'ماء' },
    { en: 'Bread',             ar: 'خبز' },
    { en: 'Milk',              ar: 'حليب' },
    { en: 'Coffee / Tea',      ar: 'قهوة / شاي' },
    { en: 'Meat',              ar: 'لحم' },
    { en: 'Fruit',             ar: 'فاكهة' },
    { en: 'Restaurant',        ar: 'مطعم' }
  ]},
  { level: 'A1', category: 'Places', categoryAr: 'الأماكن', icon: '🏙️', items: [
    { en: 'House',             ar: 'منزل' },
    { en: 'School',            ar: 'مدرسة' },
    { en: 'Street',            ar: 'شارع' },
    { en: 'City',              ar: 'مدينة' },
    { en: 'Country',           ar: 'بلد' },
    { en: 'Shop',              ar: 'متجر' }
  ]},

  /* ============================ A2 ============================ */
  { level: 'A2', category: 'Daily Routine', categoryAr: 'الروتين اليومي', icon: '⏰', items: [
    { en: 'To wake up',        ar: 'يستيقظ' },
    { en: 'To get dressed',    ar: 'يرتدي ملابسه' },
    { en: 'To take a shower',  ar: 'يستحم' },
    { en: 'To have breakfast', ar: 'يتناول الفطور' },
    { en: 'To leave / arrive', ar: 'يغادر / يصل' },
    { en: 'Usually / Sometimes', ar: 'عادة / أحيانا' },
    { en: 'Every day',         ar: 'كل يوم' }
  ]},
  { level: 'A2', category: 'Travel', categoryAr: 'السفر', icon: '✈️', items: [
    { en: 'Airport',           ar: 'مطار' },
    { en: 'Ticket',            ar: 'تذكرة' },
    { en: 'Passport',          ar: 'جواز سفر' },
    { en: 'Flight',            ar: 'رحلة جوية' },
    { en: 'Hotel',             ar: 'فندق' },
    { en: 'Luggage',           ar: 'أمتعة' },
    { en: 'Reservation',       ar: 'حجز' },
    { en: 'To travel',         ar: 'يسافر' },
    { en: 'Departure / Arrival', ar: 'مغادرة / وصول' }
  ]},
  { level: 'A2', category: 'Shopping', categoryAr: 'التسوق', icon: '🛍️', items: [
    { en: 'Price',             ar: 'سعر' },
    { en: 'Cheap / Expensive', ar: 'رخيص / غالي' },
    { en: 'To buy / To sell',  ar: 'يشتري / يبيع' },
    { en: 'Money',             ar: 'مال' },
    { en: 'Discount',          ar: 'خصم' },
    { en: 'Receipt',           ar: 'إيصال' },
    { en: 'Size',              ar: 'مقاس' }
  ]},
  { level: 'A2', category: 'Adjectives', categoryAr: 'الصفات', icon: '📐', items: [
    { en: 'Big / Small',       ar: 'كبير / صغير' },
    { en: 'Fast / Slow',       ar: 'سريع / بطيء' },
    { en: 'Happy / Sad',       ar: 'سعيد / حزين' },
    { en: 'Easy / Difficult',  ar: 'سهل / صعب' },
    { en: 'New / Old',         ar: 'جديد / قديم' },
    { en: 'Hot / Cold',        ar: 'حار / بارد' },
    { en: 'Strong / Weak',     ar: 'قوي / ضعيف' }
  ]},
  { level: 'A2', category: 'Prepositions', categoryAr: 'حروف الجر', icon: '🧭', items: [
    { en: 'In / On / At',      ar: 'في / على / عند' },
    { en: 'Under / Above',     ar: 'تحت / فوق' },
    { en: 'Between',           ar: 'بين' },
    { en: 'Next to',           ar: 'بجانب' },
    { en: 'Before / After',    ar: 'قبل / بعد' }
  ]},
  { level: 'A2', category: 'Work', categoryAr: 'العمل', icon: '💼', items: [
    { en: 'Job',               ar: 'وظيفة' },
    { en: 'Company',           ar: 'شركة' },
    { en: 'Meeting',           ar: 'اجتماع' },
    { en: 'Office',            ar: 'مكتب' },
    { en: 'Salary',            ar: 'راتب' },
    { en: 'Colleague',         ar: 'زميل' },
    { en: 'Manager',           ar: 'مدير' },
    { en: 'Deadline',          ar: 'موعد نهائي' }
  ]},
  { level: 'A2', category: 'Weather', categoryAr: 'الطقس', icon: '🌤️', items: [
    { en: 'Sunny',             ar: 'مشمس' },
    { en: 'Rainy',             ar: 'ممطر' },
    { en: 'Cloudy',            ar: 'غائم' },
    { en: 'Windy',             ar: 'عاصف' },
    { en: 'Temperature',       ar: 'درجة الحرارة' }
  ]},

  /* ============================ B1 ============================ */
  { level: 'B1', category: 'Feelings & Opinions', categoryAr: 'المشاعر والآراء', icon: '💭', items: [
    { en: 'I think that...',   ar: 'أعتقد أن' },
    { en: 'In my opinion',     ar: 'في رأيي' },
    { en: 'I agree / disagree',ar: 'أوافق / لا أوافق' },
    { en: 'Worried',           ar: 'قلق' },
    { en: 'Confident',         ar: 'واثق' },
    { en: 'Disappointed',      ar: 'خائب الأمل' },
    { en: 'Surprised',         ar: 'متفاجئ' },
    { en: 'Comfortable / Uncomfortable', ar: 'مرتاح / غير مرتاح' }
  ]},
  { level: 'B1', category: 'Common Phrasal Verbs', categoryAr: 'الأفعال المركبة الشائعة', icon: '🔗', items: [
    { en: 'To find out',       ar: 'يكتشف' },
    { en: 'To give up',        ar: 'يستسلم' },
    { en: 'To look for',       ar: 'يبحث عن' },
    { en: 'To get along',      ar: 'ينسجم مع' },
    { en: 'To put off',        ar: 'يؤجل' },
    { en: 'To carry on',       ar: 'يستمر' },
    { en: 'To turn down',      ar: 'يرفض' },
    { en: 'To come up with',   ar: 'يتوصل إلى فكرة' }
  ]},
  { level: 'B1', category: 'Describing Experiences', categoryAr: 'وصف التجارب', icon: '🌱', items: [
    { en: 'Experience',        ar: 'خبرة / تجربة' },
    { en: 'Achievement',       ar: 'إنجاز' },
    { en: 'Challenge',         ar: 'تحد' },
    { en: 'Opportunity',       ar: 'فرصة' },
    { en: 'Improvement',       ar: 'تحسن' },
    { en: 'Progress',          ar: 'تقدم' },
    { en: 'Skill',             ar: 'مهارة' }
  ]},
  { level: 'B1', category: 'Business & Money Basics', categoryAr: 'أساسيات الأعمال والمال', icon: '💰', items: [
    { en: 'Contract',          ar: 'عقد' },
    { en: 'Payment',           ar: 'دفعة' },
    { en: 'Invoice',           ar: 'فاتورة' },
    { en: 'Budget',            ar: 'ميزانية' },
    { en: 'Investment',        ar: 'استثمار' },
    { en: 'Profit / Loss',     ar: 'ربح / خسارة' },
    { en: 'Client',            ar: 'عميل' },
    { en: 'Supplier',          ar: 'مورد' }
  ]},
  { level: 'B1', category: 'Linking Words', categoryAr: 'أدوات الربط', icon: '🪡', items: [
    { en: 'However',           ar: 'لكن / مع ذلك' },
    { en: 'Although',          ar: 'على الرغم من' },
    { en: 'Because of',        ar: 'بسبب' },
    { en: 'As a result',       ar: 'نتيجة لذلك' },
    { en: 'On the other hand', ar: 'من ناحية أخرى' },
    { en: 'In addition',       ar: 'بالإضافة إلى ذلك' }
  ]},
  { level: 'B1', category: 'Health', categoryAr: 'الصحة', icon: '🩺', items: [
    { en: 'Symptom',           ar: 'عرض / أعراض' },
    { en: 'Appointment',       ar: 'موعد' },
    { en: 'Treatment',         ar: 'علاج' },
    { en: 'Prescription',      ar: 'وصفة طبية' },
    { en: 'Emergency',         ar: 'طارئ' }
  ]},

  /* ============================ B2 ============================ */
  { level: 'B2', category: 'Formal & Abstract Vocabulary', categoryAr: 'مفردات رسمية ومجردة', icon: '🎓', items: [
    { en: 'Significant',       ar: 'مهم / كبير الأثر' },
    { en: 'Consequently',      ar: 'بالتالي' },
    { en: 'Nevertheless',      ar: 'ومع ذلك' },
    { en: 'Sustainable',       ar: 'مستدام' },
    { en: 'Efficient',         ar: 'فعال' },
    { en: 'Reliable',          ar: 'موثوق' },
    { en: 'Consistent',        ar: 'متسق' },
    { en: 'Comprehensive',     ar: 'شامل' },
    { en: 'Substantial',       ar: 'كبير / جوهري' }
  ]},
  { level: 'B2', category: 'Negotiation & Meetings', categoryAr: 'التفاوض والاجتماعات', icon: '🤝', items: [
    { en: 'To negotiate',      ar: 'يتفاوض' },
    { en: 'Proposal',          ar: 'اقتراح' },
    { en: 'Agenda',            ar: 'جدول أعمال' },
    { en: 'To reach an agreement', ar: 'يتوصل إلى اتفاق' },
    { en: 'Compromise',        ar: 'حل وسط' },
    { en: 'Stakeholder',       ar: 'صاحب مصلحة' },
    { en: 'To postpone',       ar: 'يؤجل' }
  ]},
  { level: 'B2', category: 'Idioms', categoryAr: 'تعبيرات اصطلاحية', icon: '💡', items: [
    { en: 'To be on the same page', ar: 'أن يكون الجميع متفقين' },
    { en: 'To think outside the box', ar: 'يفكر بطريقة إبداعية' },
    { en: 'To break the ice',  ar: 'يكسر الجمود' },
    { en: 'To keep in touch',  ar: 'يبقى على تواصل' },
    { en: 'A win-win situation', ar: 'وضع مربح للطرفين' },
    { en: 'To take into account', ar: 'يأخذ بعين الاعتبار' }
  ]},
  { level: 'B2', category: 'Analysis & Reporting', categoryAr: 'التحليل وإعداد التقارير', icon: '📊', items: [
    { en: 'Trend',             ar: 'اتجاه' },
    { en: 'Estimate',          ar: 'تقدير' },
    { en: 'Outcome',           ar: 'نتيجة' },
    { en: 'Overview',          ar: 'نظرة عامة' },
    { en: 'Data',              ar: 'بيانات' },
    { en: 'Evidence',          ar: 'دليل' },
    { en: 'Assumption',        ar: 'افتراض' }
  ]},
  { level: 'B2', category: 'Exhibitions & Networking', categoryAr: 'المعارض والتواصل المهني', icon: '🏛️', items: [
    { en: 'Exhibition / Trade fair', ar: 'معرض تجاري' },
    { en: 'Booth / Stand',     ar: 'جناح العرض' },
    { en: 'Networking',        ar: 'بناء علاقات مهنية' },
    { en: 'Business card',     ar: 'بطاقة عمل' },
    { en: 'Partnership',       ar: 'شراكة' },
    { en: 'To showcase',       ar: 'يعرض' },
    { en: 'Follow-up',         ar: 'متابعة' }
  ]}
];
