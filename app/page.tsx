'use client'
import React, { useState, useRef, useEffect } from 'react';
import { Upload, Sparkles, RotateCcw, Share2, Camera, Loader2, ArrowRight } from 'lucide-react';

const MEMBERS = {
  FREYA: {
    name: 'FREYA',
    role: 'The Dreamer',
    colorway: 'Lavender Purple',
    hex: '#B5A0D6',
    soft: '#DCCFEC',
    deep: '#6B5491',
    accent: '#EFE6F8',
    paper: '#F8F4FC',
  },
  FIONY: {
    name: 'FIONY',
    role: 'The Grounded One',
    colorway: 'Sage Green',
    hex: '#A8BD8B',
    soft: '#CFDDB8',
    deep: '#5E7142',
    accent: '#E8F0DC',
    paper: '#F5F8EE',
  },
  CHRISTY: {
    name: 'CHRISTY',
    role: 'The Magnetic One',
    colorway: 'Sunset Orange',
    hex: '#ED9B5C',
    soft: '#F5C39B',
    deep: '#8E5424',
    accent: '#FCEEDC',
    paper: '#FFF7EE',
  },
  SHANI: {
    name: 'SHANI',
    role: 'The Electric One',
    colorway: 'Stellar Blue',
    hex: '#5B7BA8',
    soft: '#A8BDD6',
    deep: '#2D4368',
    accent: '#E0EAF5',
    paper: '#F2F6FB',
  },
  MARSHA: {
    name: 'MARSHA',
    role: 'The Sleek One',
    colorway: 'Cool Silver',
    hex: '#9BA3B0',
    soft: '#CDD2DA',
    deep: '#4D525B',
    accent: '#E8EBEF',
    paper: '#F4F5F7',
  },
};

const ANALYZING_PHRASES = [
  'reading your aura',
  'tuning into your frequency',
  'matching your shade',
  'finding your color',
];

export default function ColorAuraFilter() {
  const [stage, setStage] = useState('intro');
  const [imageData, setImageData] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [analyzingPhrase, setAnalyzingPhrase] = useState(0);
  const [revealStep, setRevealStep] = useState(0);
  const [isSharing, setIsSharing] = useState(false);
  const [shareStatus, setShareStatus] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (stage !== 'analyzing') return;
    const interval = setInterval(() => {
      setAnalyzingPhrase((p) => (p + 1) % ANALYZING_PHRASES.length);
    }, 1400);
    return () => clearInterval(interval);
  }, [stage]);

  useEffect(() => {
    if (stage !== 'result') return;
    setRevealStep(0);
    const t1 = setTimeout(() => setRevealStep(1), 200);
    const t2 = setTimeout(() => setRevealStep(2), 700);
    const t3 = setTimeout(() => setRevealStep(3), 1200);
    const t4 = setTimeout(() => setRevealStep(4), 1700);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [stage]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      if (!evt.target) return;
  const dataUrl = evt.target.result as string;
  setImagePreview(dataUrl);
  const base64 = dataUrl.split(',')[1];
      const mediaType = file.type || 'image/jpeg';
      setImageData({ base64, mediaType });
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async () => {
    if (!imageData) return;
    setStage('analyzing');
    setError(null);

    const prompt = `You are a color aura analyst for the Infinix HOT 70 × JKT48 campaign. You're not a horoscope app — you're the friend who's *funny* about people. Tone of voice: TikTok caption, group chat banter, the bestie who actually pays attention.

Analyze this photo and match the person to ONE of five JKT48 members based on dominant colors, lighting, energy, and overall vibe.

VOICE RULES (strict):
- Write everything in ENGLISH. Casual, internet-native Gen Z. Phrases like "main character energy", "very [X] of you", "lowkey", "the vibe is immaculate", "literally", "babe", "this photo is so you" are fine — but never forced, never cringe.
- MEDIUM EDGE: playful, observational, lightly teasing — the friend who roasts you because they love you. NEVER mean, never body-comments, never insulting. NEVER comment on appearance, weight, skin, or features.
- DO NOT INVENTORY THE PHOTO. Do not describe specific clothing items, accessories, or objects in the frame. Saying "your navy plaid shirt" or "the thumbs up" is WRONG. The user already knows what they're wearing.
- INSTEAD: reference mood, energy, light, composition, the *choices* behind the photo, the *feeling* of the frame. Examples of RIGHT observations:
  · "The way you angled this from below is a confident move."
  · "Something about how composed you look says you took this 14 times before posting."
  · "Soft light, soft expression — you knew exactly what you were doing."
  · "There's a quietness to this frame that's very deliberate."
- Confident, expressive, never apologetic about being colorful.

MEMBERS & HOT 70 COLORWAYS:
- FREYA → Lavender Purple (#B5A0D6). Dreamy, expressive, soft, romantic, ethereal, artistic mood, gentle confidence, main character energy.
- FIONY → Sage Green (#A8BD8B). Grounded, fresh, calm, natural earthy energy, mindful, quiet strength, that "kalem but iconic" feeling.
- CHRISTY → Sunset Orange (#ED9B5C). Warm, magnetic, bold, golden-hour energy, charisma, radiant, the one who walks in and shifts the room.
- SHANI → Stellar Blue (#5B7BA8). Electric, mysterious, cool, deep jewel-tone energy, after-dark mood, sophisticated edge.
- MARSHA → Cool Silver (#9BA3B0). Sleek, minimalist, modern, refined, monochrome moods, polished restraint. Pick Marsha ONLY if the photo genuinely reads as monochrome or minimalist — not just because the photo is plain.

Return ONLY valid JSON, no preamble, no markdown fences:

{
  "member": "FREYA" | "FIONY" | "CHRISTY" | "SHANI" | "MARSHA",
  "shade_name": "2-word evocative shade name (e.g., 'Lavender Mist', 'Quiet Sage', 'Golden Hour', 'After Midnight', 'Polished Silver')",
  "shade_hex": "#hexcode for the specific shade",
  "vibe_title": "3-5 word personality label. Examples: 'Soft With Boundaries', 'Quietly Iconic', 'Main Character Energy', 'Effortless on Purpose'",
  "one_line_vibe": "ONE quotable sentence capturing who they are. Reference mood/energy/light/composition of the photo — NEVER specific items. Examples: 'The kind of person who claims they don't take selfies and then posts four to their close friends story.' or 'There's something about this frame that says you'd survive in a poetry slam.' or 'You are giving "I read one philosophy book in 2021 and it changed me" and I respect it.'",
  "vibe_description": "2 sentences. Observational, playful, teasing-but-affectionate. Reference mood, energy, light, composition, choices — NOT clothing or objects. Example: 'The composition here is doing a lot of work — soft light, careful angle, calm expression that says I am, in fact, the protagonist. Lavender suits you because you've already decided it does.'",
  "color_words": ["3 evocative words"],
  "tiktok_bio": "what their TikTok bio would be — one weird/funny line in Gen Z internet voice. 1-2 emojis ok. Examples: 'just girl, just lavender, just delulu ✨' or 'soft launched my hard launch 🌿' or 'unserious about everything except my playlists'",
  "red_flag": "playful red flag — an affectionate observation about a tiny relatable habit. NEVER cruel, NEVER about appearance. Examples: 'You definitely have 14 unread texts and zero plans to reply.' or 'You've reread one chapter of the same book six times this week and called it self-care.'",
  "song_pick": "a real JKT48 song that matches their vibe",
  "match_percent": 85-99
}`;

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-5',
          max_tokens: 1000,
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'image',
                  source: {
                    type: 'base64',
                    media_type: imageData.mediaType,
                    data: imageData.base64,
                  },
                },
                { type: 'text', text: prompt },
              ],
            },
          ],
        }),
      });

      if (!response.ok) throw new Error('API request failed');
      const data = await response.json();
      const text = data.content
        .filter((b) => b.type === 'text')
        .map((b) => b.text)
        .join('')
        .replace(/```json|```/g, '')
        .trim();

      const parsed = JSON.parse(text);
      if (!MEMBERS[parsed.member]) throw new Error('Invalid member returned');

      // Hold the analyzing state for at least 2.5s for drama
      setTimeout(() => {
        setResult(parsed);
        setStage('result');
      }, 2500);
    } catch (err) {
      console.error(err);
      setTimeout(() => {
        setError('something went wrong reading your aura. try another photo?');
        setStage('upload');
      }, 1500);
    }
  };

  const drawShareCard = async () => {
    // Wait for fonts to be loaded so canvas text renders in the right typefaces
    if (document.fonts && document.fonts.ready) {
      try { await document.fonts.ready; } catch (e) {}
    }

    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext('2d');

    // Background paper
    ctx.fillStyle = member.paper;
    ctx.fillRect(0, 0, 1080, 1920);

    // Soft color-flood blobs (matching the on-screen result aesthetic)
    ctx.save();
    if (ctx.filter !== undefined) ctx.filter = 'blur(120px)';
    ctx.globalAlpha = 0.7;
    ctx.fillStyle = member.soft;
    ctx.beginPath();
    ctx.arc(200, 400, 420, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 0.45;
    ctx.fillStyle = member.hex;
    ctx.beginPath();
    ctx.arc(900, 1650, 480, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Eyebrow
    ctx.textAlign = 'center';
    ctx.fillStyle = member.deep;
    ctx.globalAlpha = 0.65;
    ctx.font = '500 22px "DM Mono", monospace';
    ctx.fillText('INFINIX HOT 70 × JKT48  ·  COLOR AURA', 540, 130);

    ctx.font = '500 26px "DM Mono", monospace';
    ctx.globalAlpha = 0.75;
    ctx.fillText('— MY MATCH IS —', 540, 220);
    ctx.globalAlpha = 1;

    // Glow halo behind photo
    ctx.save();
    if (ctx.filter !== undefined) ctx.filter = 'blur(50px)';
    ctx.globalAlpha = 0.55;
    ctx.fillStyle = member.hex;
    ctx.beginPath();
    ctx.arc(540, 600, 340, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Load and draw user photo as circle with cover-fit
    try {
      const img = await new Promise((resolve, reject) => {
        const i = new Image();
        i.onload = () => resolve(i);
        i.onerror = reject;
        i.src = imagePreview;
      });

      ctx.save();
      ctx.beginPath();
      ctx.arc(540, 600, 300, 0, Math.PI * 2);
      ctx.clip();
      const targetSize = 600;
      const ratio = img.width / img.height;
      let dW, dH;
      if (ratio > 1) { dH = targetSize; dW = targetSize * ratio; }
      else { dW = targetSize; dH = targetSize / ratio; }
      ctx.drawImage(img, 540 - dW / 2, 600 - dH / 2, dW, dH);
      ctx.restore();

      // Thin ring stroke around photo
      ctx.strokeStyle = member.deep;
      ctx.globalAlpha = 0.15;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(540, 600, 301, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;
    } catch (e) {
      // photo failed to load — draw a placeholder
      ctx.fillStyle = member.soft;
      ctx.beginPath();
      ctx.arc(540, 600, 300, 0, Math.PI * 2);
      ctx.fill();
    }

    // Member name — big, in member color
    ctx.fillStyle = member.hex;
    ctx.font = '600 220px "Fraunces", serif';
    ctx.fillText(member.name, 540, 1100);

    // Role (italic)
    ctx.fillStyle = member.deep;
    ctx.font = 'italic 600 56px "Fraunces", serif';
    ctx.fillText(member.role, 540, 1175);

    // Vibe title — wrap if long
    ctx.font = 'italic 600 62px "Fraunces", serif';
    const vibeTitle = `"${result.vibe_title}"`;
    wrapText(ctx, vibeTitle, 540, 1310, 900, 75);

    // One-line vibe (the quotable screenshot moment)
    if (result.one_line_vibe) {
      ctx.font = 'italic 400 36px "Fraunces", serif';
      ctx.fillStyle = member.deep;
      ctx.globalAlpha = 0.85;
      wrapText(ctx, result.one_line_vibe, 540, 1410, 880, 48);
      ctx.globalAlpha = 1;
    }

    // Color words row
    ctx.font = 'italic 400 44px "Fraunces", serif';
    ctx.globalAlpha = 0.75;
    const wordsLine = (result.color_words || []).join('  ·  ');
    ctx.fillText(wordsLine, 540, 1470);
    ctx.globalAlpha = 1;

    // Divider
    ctx.strokeStyle = member.deep;
    ctx.globalAlpha = 0.2;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(140, 1550);
    ctx.lineTo(940, 1550);
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Colorway row: swatch · official colorway · hex
    ctx.fillStyle = member.hex;
    ctx.beginPath();
    ctx.arc(300, 1615, 18, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = member.deep;
    ctx.textAlign = 'left';
    ctx.font = '500 32px "DM Sans", sans-serif';
    ctx.fillText(member.colorway, 335, 1626);

    ctx.textAlign = 'right';
    ctx.font = '500 24px "DM Mono", monospace';
    ctx.globalAlpha = 0.55;
    ctx.fillText(member.hex.toUpperCase(), 940, 1626);
    ctx.globalAlpha = 1;

    // Tagline — gradient "Hidup Penuh Warna" + Sacramento script "When I Hold You"
    ctx.textAlign = 'center';

    // Gradient for "Hidup Penuh Warna"
    const hpwGradient = ctx.createLinearGradient(140, 1740, 940, 1740);
    hpwGradient.addColorStop(0, '#6B5491');
    hpwGradient.addColorStop(0.5, '#5B7BA8');
    hpwGradient.addColorStop(1, '#5E7142');
    ctx.fillStyle = hpwGradient;
    ctx.font = '600 64px "Fraunces", serif';
    ctx.fillText('Hidup Penuh Warna,', 540, 1740);

    // Sacramento script for "When I Hold You"
    ctx.fillStyle = member.deep;
    ctx.font = '400 92px "Sacramento", cursive';
    ctx.fillText('When I Hold You', 540, 1830);

    // Signature underline flourish (skewed line under the script)
    ctx.strokeStyle = member.deep;
    ctx.globalAlpha = 0.5;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(280, 1850);
    ctx.lineTo(800, 1846);
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Footer
    ctx.font = '500 20px "DM Mono", monospace';
    ctx.globalAlpha = 0.55;
    ctx.fillText('INFINIX HOT 70  ·  25 · 05 · 2026  ·  #FindYourColor', 540, 1895);
    ctx.globalAlpha = 1;

    return canvas;
  };

  // Simple word-wrap helper for canvas
  const wrapText = (ctx, text, x, y, maxWidth, lineHeight) => {
    const words = text.split(' ');
    let line = '';
    let curY = y;
    for (let i = 0; i < words.length; i++) {
      const test = line + words[i] + ' ';
      if (ctx.measureText(test).width > maxWidth && line.length > 0) {
        ctx.fillText(line.trim(), x, curY);
        line = words[i] + ' ';
        curY += lineHeight;
      } else {
        line = test;
      }
    }
    ctx.fillText(line.trim(), x, curY);
  };

  const handleShare = async () => {
    if (isSharing) return;
    setIsSharing(true);
    setShareStatus(null);

    try {
      const canvas = await drawShareCard();
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png', 0.95));
      if (!blob) throw new Error('Failed to generate image');

      const filename = `infinix-hot70-aura-${result.member.toLowerCase()}.png`;
      const file = new File([blob], filename, { type: 'image/png' });
      const shareText = `My Infinix HOT 70 color is ${member.colorway}. Hidup Penuh Warna, When I Hold You. #FindYourColor #InfinixHOT70 #JKT48xInfinix`;

      // Try Web Share API with files (iOS/Android native share sheet)
      if (typeof navigator !== 'undefined' && navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: 'My Color Aura',
            text: shareText,
          });
          setShareStatus('shared');
          setTimeout(() => setShareStatus(null), 2500);
          return;
        } catch (err) {
          if (err && err.name === 'AbortError') {
            // User cancelled — no fallback needed
            return;
          }
          // Other share errors fall through to download
        }
      }

      // Fallback: download the PNG
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setShareStatus('downloaded');
      setTimeout(() => setShareStatus(null), 3500);
    } catch (err) {
      console.error('Share failed', err);
      setShareStatus('error');
      setTimeout(() => setShareStatus(null), 3000);
    } finally {
      setIsSharing(false);
    }
  };

  const reset = () => {
    setStage('intro');
    setImageData(null);
    setImagePreview(null);
    setResult(null);
    setError(null);
  };

  const tryAgain = () => {
    setStage('upload');
    setImageData(null);
    setImagePreview(null);
    setResult(null);
  };

  const member = result ? MEMBERS[result.member] : null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,600;0,9..144,800;1,9..144,400;1,9..144,600&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500;700&family=Sacramento&display=swap');

        .aura-root {
          font-family: 'DM Sans', sans-serif;
          --beige-bg: #EFEAE0;
          --beige-paper: #F5F1E8;
          --ink: #1a1a1a;
          --ink-soft: #4a4a4a;
          --hpw-gradient: linear-gradient(90deg, #6B5491 0%, #5B7BA8 50%, #5E7142 100%);
          --hpw-gradient-soft: linear-gradient(90deg, #B5A0D6 0%, #8FA8C9 50%, #A8BD8B 100%);
        }

        .aura-display { font-family: 'Fraunces', serif; letter-spacing: -0.03em; }
        .aura-mono { font-family: 'DM Mono', monospace; letter-spacing: 0.02em; }
        .aura-script { font-family: 'Sacramento', cursive; letter-spacing: 0.01em; }

        .hpw-text {
          background: var(--hpw-gradient);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          background-size: 200% auto;
        }

        .signature-underline {
          display: inline-block;
          position: relative;
          padding-bottom: 0.15em;
        }
        .signature-underline::after {
          content: '';
          position: absolute;
          left: 5%;
          right: 5%;
          bottom: 0;
          height: 2px;
          background: var(--hpw-gradient);
          border-radius: 2px;
          transform: skewY(-2deg);
        }

        @keyframes shimmerShine {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes auraPulse {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.15); opacity: 0.7; }
        }
        @keyframes auraRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes colorFlood {
          from { transform: scale(0); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes slowDrift {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(2%, -2%) rotate(2deg); }
        }
        @keyframes phraseSwap {
          0%, 100% { opacity: 0; transform: translateY(8px); }
          15%, 85% { opacity: 1; transform: translateY(0); }
        }

        .shimmer-text {
          background: linear-gradient(110deg, currentColor 0%, currentColor 40%, rgba(255,255,255,0.6) 50%, currentColor 60%, currentColor 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmerShine 4s linear infinite;
        }

        .grain-overlay {
          position: absolute; inset: 0; pointer-events: none; opacity: 0.08; mix-blend-mode: overlay;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }

        .btn-primary {
          position: relative; overflow: hidden;
          background: var(--ink); color: var(--beige-paper);
          padding: 1rem 2rem; border-radius: 999px;
          font-family: 'DM Mono', monospace; font-size: 0.85rem;
          letter-spacing: 0.15em; text-transform: uppercase;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          cursor: pointer; border: none;
          display: inline-flex; align-items: center; gap: 0.6rem;
        }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 30px rgba(0,0,0,0.2); }
        .btn-primary::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(110deg, transparent 40%, rgba(255,255,255,0.3) 50%, transparent 60%);
          transform: translateX(-100%);
          transition: transform 0.6s ease;
        }
        .btn-primary:hover::before { transform: translateX(100%); }

        .btn-ghost {
          background: transparent; color: var(--ink);
          padding: 1rem 2rem; border-radius: 999px;
          font-family: 'DM Mono', monospace; font-size: 0.85rem;
          letter-spacing: 0.15em; text-transform: uppercase;
          border: 1.5px solid var(--ink); cursor: pointer;
          transition: all 0.3s ease;
          display: inline-flex; align-items: center; gap: 0.6rem;
        }
        .btn-ghost:hover { background: var(--ink); color: var(--beige-paper); }
      `}</style>

      <div className="aura-root min-h-screen w-full relative overflow-hidden" style={{ background: stage === 'result' && member ? member.paper : 'var(--beige-bg)', transition: 'background 1.2s ease' }}>

        {/* INTRO */}
        {stage === 'intro' && (
          <div className="relative min-h-screen flex flex-col">
            <div className="grain-overlay" />

            {/* Top bar */}
            <div className="flex justify-between items-center px-6 md:px-12 py-6 z-10">
              <div className="aura-mono text-xs tracking-widest" style={{ color: 'var(--ink-soft)' }}>
                INFINIX HOT 70 × JKT48
              </div>
              <div className="aura-mono text-xs tracking-widest" style={{ color: 'var(--ink-soft)' }}>
                25 · 05 · 2026
              </div>
            </div>

            {/* Decorative drifting circles in beige tones */}
            <div className="absolute top-1/4 -left-20 w-80 h-80 rounded-full opacity-30" style={{ background: '#D4C9B0', filter: 'blur(60px)', animation: 'slowDrift 12s ease-in-out infinite' }} />
            <div className="absolute bottom-1/4 -right-20 w-96 h-96 rounded-full opacity-25" style={{ background: '#C9BFA3', filter: 'blur(70px)', animation: 'slowDrift 14s ease-in-out infinite reverse' }} />

            <div className="flex-1 flex flex-col justify-center items-center px-6 text-center relative z-10">
              <div className="aura-mono text-xs tracking-[0.3em] mb-6 opacity-70" style={{ color: 'var(--ink-soft)', animation: 'fadeUp 0.8s ease both' }}>
                — A COLOR AURA EXPERIENCE —
              </div>

              <h1 className="aura-display text-6xl md:text-8xl lg:text-9xl leading-[0.95] mb-2" style={{ color: 'var(--ink)', animation: 'fadeUp 0.8s 0.15s ease both' }}>
                the world is
              </h1>
              <h1 className="aura-display italic text-6xl md:text-8xl lg:text-9xl leading-[0.95] mb-8" style={{ color: 'var(--ink-soft)', animation: 'fadeUp 0.8s 0.3s ease both' }}>
                beige.
              </h1>

              <p className="aura-display text-2xl md:text-3xl max-w-xl mb-12 leading-snug" style={{ color: 'var(--ink)', animation: 'fadeUp 0.8s 0.45s ease both' }}>
                but <span className="italic">you</span> — you're something else entirely.
              </p>

              <div style={{ animation: 'fadeUp 0.8s 0.6s ease both' }}>
                <button onClick={() => setStage('upload')} className="btn-primary">
                  Find Your Color
                  <ArrowRight size={16} />
                </button>
              </div>

              <p className="aura-mono text-xs mt-8 opacity-60" style={{ color: 'var(--ink-soft)', animation: 'fadeUp 0.8s 0.75s ease both' }}>
                upload a selfie. we'll match you to your JKT48 shade.
              </p>
            </div>

            <div className="px-6 md:px-12 py-6 flex justify-between items-end z-10">
              <div className="flex flex-col items-start">
                <div className="aura-display text-sm md:text-base" style={{ color: 'var(--ink)' }}>
                  <span className="hpw-text font-semibold">Hidup Penuh Warna</span>
                </div>
                <div className="aura-script text-xl md:text-2xl signature-underline -mt-1" style={{ color: 'var(--ink-soft)' }}>
                  When I Hold You
                </div>
              </div>
              <div className="aura-mono text-[10px] tracking-widest opacity-50" style={{ color: 'var(--ink-soft)' }}>
                01 / FIND • 02 / MATCH • 03 / SHARE
              </div>
            </div>
          </div>
        )}

        {/* UPLOAD */}
        {stage === 'upload' && (
          <div className="relative min-h-screen flex flex-col">
            <div className="grain-overlay" />

            <div className="flex justify-between items-center px-6 md:px-12 py-6 z-10">
              <button onClick={reset} className="aura-mono text-xs tracking-widest underline-offset-4 hover:underline" style={{ color: 'var(--ink-soft)' }}>
                ← back
              </button>
              <div className="aura-mono text-xs tracking-widest" style={{ color: 'var(--ink-soft)' }}>
                STEP 01 / 02
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-center items-center px-6 z-10">
              <div className="aura-mono text-xs tracking-[0.3em] mb-4 opacity-70" style={{ color: 'var(--ink-soft)' }}>
                — UPLOAD YOUR PHOTO —
              </div>
              <h2 className="aura-display text-5xl md:text-7xl mb-3 text-center leading-tight" style={{ color: 'var(--ink)' }}>
                show us <span className="italic">you.</span>
              </h2>
              <p className="text-center max-w-md mb-10" style={{ color: 'var(--ink-soft)' }}>
                a selfie, your OOTD, that one photo you actually like. we're reading the vibe, not the angle.
              </p>

              {error && (
                <div className="aura-mono text-xs px-4 py-2 mb-6 rounded-full" style={{ background: '#FFD9D9', color: '#8B2838' }}>
                  {error}
                </div>
              )}

              {!imagePreview ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="cursor-pointer group relative"
                  style={{ animation: 'fadeUp 0.6s ease both' }}
                >
                  <div className="w-72 h-96 md:w-80 md:h-[28rem] rounded-3xl border-2 border-dashed flex flex-col items-center justify-center transition-all group-hover:scale-[1.02]" style={{ borderColor: 'var(--ink-soft)', background: 'rgba(255,255,255,0.3)' }}>
                    <Camera size={40} strokeWidth={1.2} style={{ color: 'var(--ink)' }} />
                    <div className="aura-display text-2xl mt-4" style={{ color: 'var(--ink)' }}>tap to upload</div>
                    <div className="aura-mono text-[10px] tracking-widest mt-2 opacity-60" style={{ color: 'var(--ink-soft)' }}>
                      JPG · PNG · HEIC
                    </div>
                  </div>
                  <div className="absolute -top-3 -right-3 w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'var(--ink)' }}>
                    <Upload size={18} style={{ color: 'var(--beige-paper)' }} />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center" style={{ animation: 'fadeUp 0.5s ease both' }}>
                  <div className="relative w-72 h-96 md:w-80 md:h-[28rem] rounded-3xl overflow-hidden shadow-2xl">
                    <img src={imagePreview} alt="Your selfie" className="w-full h-full object-cover" style={{ filter: 'saturate(0.7)' }} />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 60%, rgba(0,0,0,0.4))' }} />
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                      <div className="aura-mono text-[10px] tracking-widest text-white opacity-80">PREVIEW</div>
                      <button onClick={() => { setImagePreview(null); setImageData(null); }} className="aura-mono text-[10px] tracking-widest text-white underline">
                        change
                      </button>
                    </div>
                  </div>
                  <button onClick={analyzeImage} className="btn-primary mt-8">
                    <Sparkles size={16} />
                    reveal my aura
                  </button>
                </div>
              )}

              <input ref={fileInputRef} type="file" accept="image/*" capture="user" onChange={handleFileSelect} className="hidden" />
            </div>

            <div className="px-6 md:px-12 py-6 z-10">
              <p className="aura-mono text-[10px] tracking-widest opacity-50 text-center" style={{ color: 'var(--ink-soft)' }}>
                photos are analyzed in-session and not stored.
              </p>
            </div>
          </div>
        )}

        {/* ANALYZING */}
        {stage === 'analyzing' && (
          <div className="relative min-h-screen flex flex-col items-center justify-center px-6">
            <div className="grain-overlay" />

            <div className="relative w-72 h-72 flex items-center justify-center">
              {/* Rotating aura rings */}
              <div className="absolute inset-0 rounded-full" style={{ background: 'conic-gradient(from 0deg, #E85A6B, #8B6BB8, #7A9560, #E85A6B)', animation: 'auraRotate 4s linear infinite', filter: 'blur(20px)', opacity: 0.5 }} />
              <div className="absolute inset-6 rounded-full" style={{ background: 'conic-gradient(from 180deg, #8B6BB8, #7A9560, #E85A6B, #8B6BB8)', animation: 'auraRotate 6s linear infinite reverse', filter: 'blur(15px)', opacity: 0.6 }} />

              {/* Photo in center */}
              {imagePreview && (
                <div className="relative w-44 h-44 rounded-full overflow-hidden border-4 border-white shadow-2xl" style={{ animation: 'auraPulse 2.5s ease-in-out infinite' }}>
                  <img src={imagePreview} alt="Analyzing" className="w-full h-full object-cover" style={{ filter: 'saturate(0.5)' }} />
                </div>
              )}
            </div>

            <div className="mt-12 text-center">
              <div className="aura-mono text-xs tracking-[0.3em] mb-3 opacity-70" style={{ color: 'var(--ink-soft)' }}>
                — ANALYZING —
              </div>
              <div className="aura-display italic text-3xl md:text-4xl h-12" style={{ color: 'var(--ink)' }}>
                <span key={analyzingPhrase} style={{ display: 'inline-block', animation: 'fadeUp 0.5s ease both' }}>
                  {ANALYZING_PHRASES[analyzingPhrase]}
                </span>
              </div>
              <div className="flex gap-1.5 justify-center mt-6">
                {[0,1,2].map(i => (
                  <div key={i} className="w-2 h-2 rounded-full" style={{ background: 'var(--ink)', animation: `auraPulse 1.2s ${i*0.2}s ease-in-out infinite` }} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* RESULT */}
        {stage === 'result' && result && member && (
          <div className="relative min-h-screen overflow-hidden">
            {/* Color flood background */}
            <div className="absolute inset-0" style={{ background: member.paper }} />
            <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full" style={{ background: member.soft, filter: 'blur(80px)', opacity: 0.7, animation: 'colorFlood 1.2s ease both' }} />
            <div className="absolute -bottom-40 -right-40 w-[700px] h-[700px] rounded-full" style={{ background: member.hex, filter: 'blur(100px)', opacity: 0.4, animation: 'colorFlood 1.4s 0.2s ease both' }} />
            <div className="grain-overlay" />

            <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 py-8">

              {/* Top bar */}
              <div className="flex justify-between items-center mb-8" style={{ opacity: revealStep >= 1 ? 1 : 0, transform: revealStep >= 1 ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.6s ease' }}>
                <div className="aura-mono text-xs tracking-widest" style={{ color: member.deep }}>
                  INFINIX HOT 70 × JKT48
                </div>
                <div className="aura-mono text-xs tracking-widest" style={{ color: member.deep }}>
                  {result.match_percent}% MATCH
                </div>
              </div>

              {/* Hero block */}
              <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center mb-12">

                {/* Photo with aura */}
                <div className="relative" style={{ opacity: revealStep >= 2 ? 1 : 0, transform: revealStep >= 2 ? 'scale(1)' : 'scale(0.9)', transition: 'all 0.8s ease' }}>
                  <div className="absolute -inset-6 rounded-full" style={{ background: `radial-gradient(circle, ${member.hex}55 0%, transparent 70%)`, animation: 'auraPulse 3s ease-in-out infinite' }} />
                  <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl">
                    <img src={imagePreview} alt="You" className="w-full h-full object-cover" />
                    <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, transparent 50%, ${member.deep}80)` }} />
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end text-white">
                      <div>
                        <div className="aura-mono text-[10px] tracking-widest opacity-80">YOUR COLORWAY</div>
                        <div className="aura-display text-xl">{member.colorway}</div>
                      </div>
                      <div className="aura-mono text-[10px] tracking-widest opacity-80">{member.hex.toUpperCase()}</div>
                    </div>
                  </div>
                </div>

                {/* Text block */}
                <div>
                  <div className="aura-mono text-xs tracking-[0.3em] mb-3" style={{ color: member.deep, opacity: revealStep >= 1 ? 0.8 : 0, transition: 'opacity 0.6s 0.2s ease' }}>
                    — YOUR MATCH IS —
                  </div>

                  <div style={{ opacity: revealStep >= 2 ? 1 : 0, transform: revealStep >= 2 ? 'translateY(0)' : 'translateY(30px)', transition: 'all 0.8s 0.1s ease' }}>
                    <h1 className="aura-display text-7xl md:text-8xl lg:text-9xl leading-[0.9]" style={{ color: member.deep }}>
                      <span className="shimmer-text" style={{ color: member.hex }}>{member.name}</span>
                    </h1>
                    <p className="aura-display italic text-2xl md:text-3xl mt-2" style={{ color: member.deep }}>
                      {member.role}
                    </p>
                  </div>

                  <div style={{ opacity: revealStep >= 3 ? 1 : 0, transform: revealStep >= 3 ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.6s ease' }}>
                    <div className="aura-mono text-[10px] tracking-[0.3em] mt-8 mb-2 opacity-60" style={{ color: member.deep }}>
                      — YOUR LABEL —
                    </div>
                    <div className="aura-display text-2xl md:text-3xl leading-tight" style={{ color: member.deep }}>
                      "{result.vibe_title}"
                    </div>

                    {result.one_line_vibe && (
                      <div
                        className="aura-display italic text-xl md:text-2xl mt-5 leading-snug relative pl-6"
                        style={{ color: member.deep, opacity: 0.92 }}
                      >
                        <span
                          className="absolute left-0 top-0 aura-display"
                          style={{ color: member.hex, fontSize: '2.5rem', lineHeight: 1, fontWeight: 600 }}
                        >
                          "
                        </span>
                        {result.one_line_vibe}
                      </div>
                    )}

                    <p className="mt-5 text-base md:text-lg leading-relaxed" style={{ color: member.deep, opacity: 0.8 }}>
                      {result.vibe_description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Detail strip */}
              <div className="grid md:grid-cols-3 gap-4 md:gap-6 mb-10" style={{ opacity: revealStep >= 4 ? 1 : 0, transform: revealStep >= 4 ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.6s ease' }}>

                {/* Color words */}
                <div className="p-6 rounded-2xl" style={{ background: `${member.accent}` , border: `1px solid ${member.hex}30`}}>
                  <div className="aura-mono text-[10px] tracking-widest mb-3 opacity-70" style={{ color: member.deep }}>
                    YOUR COLOR ENERGY
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.color_words?.map((w, i) => (
                      <span key={i} className="aura-display italic text-xl" style={{ color: member.deep }}>
                        {w}{i < result.color_words.length - 1 && <span className="opacity-40 mx-1">·</span>}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Song pick */}
                <div className="p-6 rounded-2xl" style={{ background: member.accent, border: `1px solid ${member.hex}30` }}>
                  <div className="aura-mono text-[10px] tracking-widest mb-3 opacity-70" style={{ color: member.deep }}>
                    YOUR JKT48 ANTHEM
                  </div>
                  <div className="aura-display text-xl leading-tight" style={{ color: member.deep }}>
                    ♫ {result.song_pick}
                  </div>
                </div>

                {/* Color swatch */}
                <div className="p-6 rounded-2xl relative overflow-hidden" style={{ background: member.hex }}>
                  <div className="aura-mono text-[10px] tracking-widest mb-3 opacity-80 text-white">
                    INFINIX HOT 70 COLORWAY
                  </div>
                  <div className="aura-display text-xl text-white leading-tight">
                    {member.colorway}
                  </div>
                  <div className="aura-mono text-[10px] tracking-widest mt-2 text-white opacity-80">
                    {member.hex.toUpperCase()}
                  </div>
                </div>
              </div>

              {/* TikTok Bio + Red Flag row */}
              {(result.tiktok_bio || result.red_flag) && (
                <div className="grid md:grid-cols-2 gap-4 md:gap-6 mb-10" style={{ opacity: revealStep >= 4 ? 1 : 0, transform: revealStep >= 4 ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.6s 0.1s ease' }}>

                  {result.tiktok_bio && (
                    <div className="p-6 rounded-2xl relative overflow-hidden" style={{ background: member.accent, border: `1px solid ${member.hex}30` }}>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="aura-mono text-[10px] tracking-widest opacity-70" style={{ color: member.deep }}>
                          YOUR TIKTOK BIO
                        </div>
                        <div className="aura-mono text-[10px] tracking-widest opacity-40" style={{ color: member.deep }}>
                          / @your.{result.member.toLowerCase()}.era
                        </div>
                      </div>
                      <div className="aura-display italic text-xl md:text-2xl leading-snug" style={{ color: member.deep }}>
                        {result.tiktok_bio}
                      </div>
                    </div>
                  )}

                  {result.red_flag && (
                    <div className="p-6 rounded-2xl relative overflow-hidden" style={{ background: member.accent, border: `1px solid ${member.hex}30` }}>
                      <div className="aura-mono text-[10px] tracking-widest mb-3 opacity-70" style={{ color: member.deep }}>
                        🚩 RED FLAG CHECK
                      </div>
                      <div className="aura-display italic text-xl md:text-2xl leading-snug" style={{ color: member.deep }}>
                        {result.red_flag}
                      </div>
                      <div className="aura-mono text-[9px] tracking-widest mt-3 opacity-50" style={{ color: member.deep }}>
                        — affectionate teasing only, love you bestie
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* CTA */}
              <div className="flex flex-col items-center text-center" style={{ opacity: revealStep >= 4 ? 1 : 0, transition: 'opacity 0.6s 0.3s ease' }}>
                <div className="aura-display text-3xl md:text-5xl mb-1 font-semibold tracking-tight">
                  <span className="hpw-text" style={{ background: `linear-gradient(90deg, ${member.deep} 0%, ${member.hex} 100%)`, WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Hidup Penuh Warna,
                  </span>
                </div>
                <div className="aura-script text-5xl md:text-7xl mb-8 signature-underline" style={{ color: member.deep }}>
                  When I Hold You
                </div>

                <div className="flex flex-wrap gap-3 justify-center">
                  <button onClick={tryAgain} className="btn-ghost" style={{ borderColor: member.deep, color: member.deep }}>
                    <RotateCcw size={14} />
                    try another photo
                  </button>
                  <button
                    onClick={handleShare}
                    disabled={isSharing}
                    className="btn-primary"
                    style={{ background: member.deep, opacity: isSharing ? 0.7 : 1, cursor: isSharing ? 'wait' : 'pointer' }}
                  >
                    {isSharing ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        generating card...
                      </>
                    ) : (
                      <>
                        <Share2 size={14} />
                        Find Your Color
                      </>
                    )}
                  </button>
                </div>

                {shareStatus && (
                  <div
                    className="aura-mono text-xs tracking-widest mt-4 px-4 py-2 rounded-full"
                    style={{
                      background: shareStatus === 'error' ? '#FFD9D9' : `${member.hex}25`,
                      color: shareStatus === 'error' ? '#8B2838' : member.deep,
                      animation: 'fadeUp 0.4s ease both',
                    }}
                  >
                    {shareStatus === 'shared' && '✓ shared — paste it to your story'}
                    {shareStatus === 'downloaded' && '✓ saved to your device — post it to your story'}
                    {shareStatus === 'error' && 'couldn\'t generate card — try again'}
                  </div>
                )}

                <p className="aura-mono text-[10px] tracking-widest mt-8 opacity-50" style={{ color: member.deep }}>
                  INFINIX HOT 70 · DYNAMIC SHINE DESIGN · 25 MAY 2026
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}