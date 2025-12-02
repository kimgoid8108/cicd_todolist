"use client";

import { useState, useEffect } from "react";

interface IntroProps {
  onComplete: () => void;
}

export default function Intro({ onComplete }: IntroProps) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // 2초 후 페이드아웃 시작
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 2000);

    // 2.5초 후 인트로 완료
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 10000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center transition-opacity duration-500"
      style={{
        backgroundColor: "#1e293b",
        opacity: fadeOut ? 0 : 1,
        zIndex: 9999,
      }}>
      <div className="text-center">
        <div className="mb-8 animate-bounce">
          <div className="text-8xl mb-4">✅</div>
        </div>
        <h1 className="text-6xl font-bold text-white mb-4 animate-pulse">투두리스트</h1>
        <p className="text-xl text-gray-300">당신의 하루를 계획하세요</p>
      </div>
    </div>
  );
}
