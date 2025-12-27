'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';

// Hero Section Component
function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative h-screen overflow-hidden">
      {/* 패럴랙스 배경 이미지 */}
      <motion.div
        style={{ y }}
        className="absolute inset-0 w-full h-[120%]"
      >
        <Image
          src="/images/landing/2th_section_02.png"
          alt="Family Hero"
          fill
          priority
          className="object-cover object-top"
        />
      </motion.div>

      {/* 어두운 오버레이 */}
      <div className="absolute inset-0 bg-black/30" />

      {/* 슬로건 텍스트 */}
      <motion.div
        style={{ opacity }}
        className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-10"
      >
        <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-wide uppercase">
          <span className="block">We are a family of</span>
          <span className="block">Faith that serves</span>
          <span className="block">God the Creator.</span>
        </h1>
        <p className="mt-6 text-lg md:text-xl text-amber-200 font-medium">
          창조주 하나님을 믿는 믿음의 가정입니다.
        </p>
      </motion.div>

      {/* 하단 그라데이션 (자연스러운 전환) */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black via-black/70 to-transparent" />

      {/* 스크롤 안내 */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 z-10"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </motion.div>
    </section>
  );
}

// Bible Verse Section
function BibleVerseSection() {
  return (
    <section className="bg-black py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto px-6 text-center"
      >
        {/* 장식선 */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="w-16 h-px bg-amber-600" />
          <span className="text-amber-500 text-2xl">✦</span>
          <div className="w-16 h-px bg-amber-600" />
        </div>

        {/* 한글 */}
        <p className="font-serif text-xl md:text-3xl text-stone-200 leading-relaxed">
          "태초에 하나님이 천지를 창조하시니라"
        </p>

        {/* 영문 */}
        <p className="mt-4 font-serif text-lg md:text-xl text-stone-400 italic">
          "In the beginning God created the heaven and the earth."
        </p>

        {/* 출처 */}
        <p className="mt-6 text-sm text-amber-600 tracking-widest uppercase">
          Genesis 1:1 · 창세기 1장 1절
        </p>

        {/* 장식선 */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <div className="w-16 h-px bg-amber-600" />
          <span className="text-amber-500 text-2xl">✦</span>
          <div className="w-16 h-px bg-amber-600" />
        </div>
      </motion.div>
    </section>
  );
}

// Section 1: 새 가족의 시작
function NewFamilySection() {
  return (
    <section className="bg-gradient-to-b from-black via-stone-900 to-stone-800 py-16">
      <div className="max-w-6xl mx-auto px-6">
        {/* 섹션 제목 - 패럴랙스 효과 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.5 }}
          className="text-center mb-12"
        >
          <motion.h2
            initial={{ scale: 0.9 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="font-serif text-4xl md:text-5xl text-white"
          >
            A new family begins. <br className="md:hidden" /> <span className="text-amber-500">새 가족의 시작</span>
          </motion.h2>
        </motion.div>

        {/* 콘텐츠 */}
        <div className="grid md:grid-cols-2 gap-12 items-stretch">
          {/* 결혼 사진 */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative aspect-square rounded-lg overflow-hidden shadow-2xl border-2 border-amber-700/50"
          >
            <Image
              src="/images/landing/1th_section_01.png"
              alt="나기봉 김필자 결혼식"
              fill
              className="object-cover"
            />
          </motion.div>

          {/* 텍스트 - 사진 높이에 맞춰 상하 간격 확대 */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-col justify-center py-8 space-y-8"
          >
            {/* 영문 - 폰트 크기 확대 */}
            <p className="text-lg md:text-xl leading-relaxed text-stone-400 italic">
              I declare in the name of the Father, the Son, and the Holy Spirit that the groom Na Ki-bong and the bride Kim Pil-ja have become a couple chosen by God.
            </p>

            {/* 한글 - 폰트 크기 확대 */}
            <p className="text-xl md:text-2xl leading-relaxed text-stone-200">
              신랑 나기봉과 신부 김필자는 하나님께서 맺어주신 부부가 되었음을 성부와 성자와 성령의 이름으로 공포합니다.
            </p>

            {/* 구분선 + 정보 영역 */}
            <div className="pt-8 border-t border-stone-600 space-y-5">
              {/* 제목 - 폰트 크기 확대 */}
              <h3 className="text-2xl md:text-3xl font-serif font-bold text-amber-400">
                A couple created by God.
              </h3>

              {/* 아이콘 + 정보 (폰트 크기 확대, 간격 확대) */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-blue-400 text-2xl">✠</span>
                  <span className="text-base md:text-lg text-stone-300">나기봉 (Na, Ki Bong) 1924.11.29 ~ 2011.01.02</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-pink-400 text-2xl">♡</span>
                  <span className="text-base md:text-lg text-stone-300">김필자 (Kim, Phil Ja) 1934.01.04 ~</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-amber-400 text-2xl">⛪</span>
                  <span className="text-base md:text-lg text-stone-300">결혼일 (Wedding Day) 1957.06.15 (춘천제일교회)</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Section 2: 새 생명의 시작
function NewLifeSection() {
  // 자녀 데이터 - isAlive: true (초록), false (흰색/사망)
  const childrenData = [
    { name: '나종춘', nameEn: 'Jong Choon', birth: '1958.03.25', isAlive: true },
    { name: '나종훈', nameEn: 'Jong Hoon', birth: '1959.11.04', isAlive: false },
    { name: '나종철', nameEn: 'Jong Chul', birth: '1961.12.31', isAlive: false },
    { name: '나종섭', nameEn: 'Jong Seob', birth: '1965.04.23', isAlive: true },
    { name: '나신숙', nameEn: 'Shin Sook', birth: '1970.12.26', isAlive: true },
  ];

  return (
    <section className="bg-stone-800 py-16">
      <div className="max-w-6xl mx-auto px-6">
        {/* 섹션 제목 - 패럴랙스 효과 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.5 }}
          className="text-center mb-12"
        >
          <motion.h2
            initial={{ scale: 0.9 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="font-serif text-4xl md:text-5xl text-white"
          >
            A new life begins. <br className="md:hidden" /> <span className="text-amber-500">새 생명의 시작</span>
          </motion.h2>
        </motion.div>

        {/* 사진 + 텍스트 그리드 (높이 균형) */}
        <div className="grid md:grid-cols-2 gap-12 items-stretch mb-12">
          {/* 텍스트 - 왼쪽 (사진 높이에 맞춤) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-col justify-center py-6 space-y-8"
          >
            {/* 한글 성경 */}
            <div>
              <p className="text-xl md:text-2xl leading-relaxed text-stone-200">
                자식은 여호와의 주신 기업이요 태의 열매는 그의 상급이로다 젊은 자의 자식은 장사의 수중의 화살 같으니 이것이 그 전통에 가득한 자는 복되도다 저희가 성문에서 그 원수와 말할 때에 수치를 당치 아니하리로다
              </p>
              <p className="text-sm text-amber-500 mt-3">
                (시편 127:3~5)
              </p>
            </div>

            {/* 영문 성경 */}
            <div>
              <p className="text-base md:text-lg leading-relaxed text-stone-400 italic">
                Sons are a heritage from the LORD, children a reward from him. Like arrows in the hands of a warrior are sons born in one&apos;s youth. Blessed is the man whose quiver is full of them. They will not be put to shame when they contend with their enemies in the gate.
              </p>
              <p className="text-sm text-stone-500 mt-3">
                (Psalms 127:3~5)
              </p>
            </div>
          </motion.div>

          {/* 가족 사진 - 오른쪽 */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative aspect-square rounded-lg overflow-hidden shadow-2xl border-2 border-amber-700/50"
          >
            <Image
              src="/images/landing/2th_section_02.png"
              alt="가족 사진"
              fill
              className="object-cover"
            />
          </motion.div>
        </div>

        {/* 자녀 이름 카드 - 하단 배열 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {childrenData.map((child, idx) => (
              <motion.div
                key={child.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                viewport={{ once: true }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
                }}
                className="relative group bg-gradient-to-br from-stone-700 to-stone-800 rounded-xl p-5 border border-stone-600 hover:border-amber-500/50 transition-all duration-300 cursor-pointer"
              >
                {/* 생존 상태 아이콘 */}
                <div className={`absolute top-3 right-3 w-3 h-3 rounded-full ${child.isAlive
                  ? 'bg-green-500 shadow-lg shadow-green-500/50'
                  : 'bg-white/80'
                  }`} />

                {/* 이름 (한글) */}
                <h4 className="font-serif text-xl md:text-2xl font-bold text-stone-100 group-hover:text-amber-400 transition-colors">
                  {child.name}
                </h4>

                {/* 이름 (영문) */}
                <p className="text-sm text-stone-400 mt-1">
                  {child.nameEn}
                </p>

                {/* 생년월일 */}
                <p className="text-xs text-amber-600 mt-2 group-hover:text-amber-400 transition-colors">
                  {child.birth}
                </p>

                {/* 호버 시 하단 악센트 라인 */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-amber-700 opacity-0 group-hover:opacity-100 transition-opacity rounded-b-xl" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}



// Section 3: 기적같은 만남 - 결혼 카드 (3x2 그리드)
function WeddingCardsSection() {
  // 6개 커플 카드 데이터
  const coupleCards = [
    {
      id: 1,
      image: '/images/couple/01-nakibong-kimphilja.png',
      groomKr: '신랑 나기봉',
      brideKr: '신부 김필자',
      date: '1957. 06. 15',
      groomEn: 'Na Ki Bong',
      brideEn: 'Kim Phil Ja',
      slug: 'nakibong-kimphilja',
    },
    {
      id: 2,
      image: '/images/couple/02-najongchoon-jangmyeongae.png',
      groomKr: '신랑 나종춘',
      brideKr: '신부 장명애',
      date: '1982. 12. 09',
      groomEn: 'Na Jong Choon',
      brideEn: 'Jang Myung Eai',
      slug: 'najongchoon-jangmyeongae',
    },
    {
      id: 3,
      image: '/images/couple/03-najongseob-kimyangjin.png',
      groomKr: '신랑 나종섭',
      brideKr: '신부 김양진',
      date: '1997. 04. 12',
      groomEn: 'Na Jong Seob',
      brideEn: 'Kim Yang Jin',
      slug: 'najongseob-kimyangjin',
    },
    {
      id: 4,
      image: '/images/couple/04-nashinsook-kimjinsu.png',
      groomKr: '신랑 김진수',
      brideKr: '신부 나신숙',
      date: '1994. 03. 01',
      groomEn: 'Kim Jin Soo',
      brideEn: 'Na Shin Sook',
      slug: 'nashinsook-kimjinsu',
    },
    {
      id: 5,
      image: '/images/couple/05-nahanna-jeongkiwon.png',
      groomKr: '신랑 정기원',
      brideKr: '신부 나한나',
      date: '2016. 09. 24',
      groomEn: 'Jung Ki Won',
      brideEn: 'Na Han Na',
      slug: 'nahanna-jeongkiwon',
    },
    {
      id: 6,
      image: '/images/couple/06-nayohan-hyeongjeongsun.png',
      groomKr: '신랑 나요한',
      brideKr: '신부 형정순',
      date: '2014. 11. 29',
      groomEn: 'Na Yo Han',
      brideEn: 'Hyung Jung Soon',
      slug: 'nayohan-hyeongjeongsun',
    },
  ];

  return (
    <section className="bg-gradient-to-b from-stone-800 to-amber-900/30 py-16">
      <div className="max-w-6xl mx-auto px-6">
        {/* 섹션 제목 - 패럴랙스 효과 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.5 }}
          className="text-center mb-4"
        >
          <motion.h2
            initial={{ scale: 0.9 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="font-serif text-4xl md:text-5xl text-amber-400 uppercase tracking-widest"
          >
            What a Wonderful Miracle!
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-4 font-serif text-2xl md:text-3xl text-white"
          >
            기적같은 만남의 시작
          </motion.p>
        </motion.div>

        {/* 소제목 */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-stone-400">우리의 만남은...<span className="italic">Our marriage...</span></p>
          <p className="text-stone-300 mt-2">우연이 아니고...<span className="italic">was not a coincidence...</span></p>
          <p className="text-stone-200 mt-2">하나님의 은혜였습니다...<span className="italic">it was God's grace...</span></p>
        </motion.div>

        {/* 결혼 카드 그리드 - 3x2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {coupleCards.map((card, idx) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <Link href={`/photo/${card.slug}`}>
                {/* 카드 컨테이너 - 2단 구성 */}
                <div className="rounded-[15px] border-2 border-green-600 overflow-hidden bg-stone-900 shadow-[4px_4px_12px_rgba(0,0,0,0.5)] hover:border-green-400 hover:shadow-[6px_6px_20px_rgba(0,0,0,0.6)] transition-all duration-300">

                  {/* 1단: 결혼식 사진 */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={card.image}
                      alt={`${card.groomKr} ${card.brideKr}`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* 2단: 신랑신부 정보 카드 */}
                  <div className="p-5 text-center space-y-2 bg-gradient-to-b from-stone-800 to-stone-900">
                    {/* 한글 이름 */}
                    <p className="text-lg font-medium text-stone-100">
                      {card.groomKr} <span className="text-amber-500">.</span> {card.brideKr}
                    </p>

                    {/* 결혼일 */}
                    <p className="text-stone-100 font-medium">
                      ({card.date}) 제{new Date().getFullYear() - parseInt(card.date.substring(0, 4))}주년
                    </p>

                    {/* 영문 이름 */}
                    <p className="text-sm text-stone-400 italic">
                      {card.groomEn} . {card.brideEn}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Main Landing Page
export default function Home() {
  return (
    <main className="bg-black min-h-screen">
      <HeroSection />
      <BibleVerseSection />
      <NewFamilySection />
      <NewLifeSection />
      <WeddingCardsSection />
    </main>
  );
}
