import React from 'react';
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from 'remotion';

/* ---------------------------------------------------------------- theme */
const FONT =
  'Outfit, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
const C = {
  bg0: '#0a0e14',
  bg1: '#05070a',
  panel: '#121a24',
  panelEdge: 'rgba(148,163,184,0.18)',
  text: '#e5e7eb',
  muted: '#9aa6b2',
  emerald: '#10b981',
  emeraldLite: '#34d399',
  indigo: '#6366f1',
  amber: '#f59e0b',
  red: '#ef4444',
};

/* ----------------------------------------------------------- helpers */
const useEnter = (delay = 0, dur = 18) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 200 }, durationInFrames: dur });
  return s;
};

const fade = (frame: number, inAt: number, outAt: number, hold = 12) =>
  interpolate(
    frame,
    [inAt, inAt + hold, outAt - hold, outAt],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

/* ----------------------------------------------------------- background */
const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = interpolate(frame, [0, 450], [0, 40]);
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(1200px 700px at 50% -10%, #0f1722 0%, ${C.bg0} 55%, ${C.bg1} 100%)`,
      }}
    >
      <AbsoluteFill
        style={{
          backgroundImage:
            'linear-gradient(rgba(99,102,241,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.06) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          backgroundPosition: `${drift}px ${drift}px`,
          maskImage: 'radial-gradient(circle at 50% 40%, black 30%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(circle at 50% 40%, black 30%, transparent 75%)',
        }}
      />
    </AbsoluteFill>
  );
};

const Watermark: React.FC = () => (
  <div
    style={{
      position: 'absolute',
      bottom: 22,
      right: 28,
      fontFamily: FONT,
      fontSize: 16,
      letterSpacing: 1,
      textTransform: 'uppercase',
      color: 'rgba(148,163,184,0.55)',
      border: '1px solid rgba(148,163,184,0.25)',
      padding: '4px 10px',
      borderRadius: 999,
    }}
  >
    Concept preview
  </div>
);

const Logo: React.FC<{ size?: number; opacity?: number }> = ({ size = 28, opacity = 1 }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, opacity }}>
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 8,
        background: `linear-gradient(135deg, ${C.emerald}, ${C.indigo})`,
        boxShadow: `0 0 24px ${C.emerald}66`,
      }}
    />
    <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: size * 0.8, color: C.text }}>
      Vera
    </span>
  </div>
);

/* ----------------------------------------------------------- Scene 1 */
const SceneIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const pop = useEnter(0, 22);
  const sub = useEnter(12, 20);
  const lineW = interpolate(frame, [22, 46], [0, 340], { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', opacity: fade(frame, 0, 75) }}>
      <div style={{ transform: `scale(${interpolate(pop, [0, 1], [0.8, 1])})`, textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: `linear-gradient(135deg, ${C.emerald}, ${C.indigo})`,
              boxShadow: `0 0 60px ${C.emerald}55`,
            }}
          />
          <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 96, color: C.text }}>Vera</span>
        </div>
        <div
          style={{
            height: 4,
            width: lineW,
            margin: '22px auto 0',
            borderRadius: 4,
            background: `linear-gradient(90deg, ${C.emerald}, ${C.indigo})`,
          }}
        />
        <div
          style={{
            marginTop: 22,
            fontFamily: FONT,
            fontSize: 34,
            color: C.muted,
            opacity: sub,
            transform: `translateY(${interpolate(sub, [0, 1], [14, 0])}px)`,
          }}
        >
          your AI playtester
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ----------------------------------------------------------- game viewport */
const Viewport: React.FC<{ children?: React.ReactNode; glitch?: boolean }> = ({ children, glitch }) => (
  <div
    style={{
      position: 'relative',
      width: 760,
      height: 428,
      borderRadius: 18,
      overflow: 'hidden',
      border: `1px solid ${C.panelEdge}`,
      background: 'linear-gradient(160deg, #16202c 0%, #0c131c 100%)',
      boxShadow: '0 30px 80px rgba(0,0,0,0.55)',
    }}
  >
    {/* fake game scene */}
    <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(700px 300px at 30% 20%, #1f3350 0%, transparent 60%)' }} />
    <div style={{ position: 'absolute', left: 90, bottom: 70, width: 200, height: 8, background: '#2b3b52', borderRadius: 4, transform: 'rotate(-6deg)' }} />
    <div style={{ position: 'absolute', left: 360, bottom: 110, width: 260, height: 8, background: '#243248', borderRadius: 4, transform: 'rotate(4deg)' }} />
    {/* a "character" block */}
    <div
      style={{
        position: 'absolute',
        left: 300,
        bottom: 120,
        width: 64,
        height: 110,
        borderRadius: 10,
        background: glitch ? `linear-gradient(180deg, ${C.indigo}, #1b2435)` : 'linear-gradient(180deg, #5468ff, #1b2435)',
        filter: glitch ? 'hue-rotate(20deg) saturate(1.4)' : 'none',
        transform: glitch ? 'translateX(34px) skewX(-8deg)' : 'none',
        boxShadow: glitch ? `0 0 30px ${C.amber}` : 'none',
      }}
    />
    {children}
  </div>
);

/* ----------------------------------------------------------- Scene 2 */
const SceneWatch: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const enter = useEnter(0, 20);
  const sweep = interpolate(frame, [10, 90], [0, 1], { extrapolateRight: 'clamp' });
  const dot = (Math.sin(frame / 5) + 1) / 2;
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', opacity: fade(frame, 0, durationInFrames) }}>
      <div style={{ transform: `translateY(${interpolate(enter, [0, 1], [30, 0])}px)`, opacity: enter }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18, fontFamily: FONT }}>
          <div style={{ width: 12, height: 12, borderRadius: 99, background: C.emerald, opacity: 0.4 + dot * 0.6, boxShadow: `0 0 12px ${C.emerald}` }} />
          <span style={{ color: C.emeraldLite, fontWeight: 600, letterSpacing: 2, fontSize: 20, textTransform: 'uppercase' }}>
            Vera · watching your build
          </span>
        </div>
        <Viewport>
          {/* scanning beam */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: `${sweep * 100}%`,
              width: 3,
              background: C.emeraldLite,
              boxShadow: `0 0 40px 8px ${C.emerald}`,
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              width: `${sweep * 100}%`,
              background: `linear-gradient(90deg, ${C.emerald}00, ${C.emerald}14)`,
            }}
          />
        </Viewport>
      </div>
    </AbsoluteFill>
  );
};

/* ----------------------------------------------------------- Scene 3 */
const SceneDetect: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const box = spring({ frame: frame - 14, fps, config: { damping: 12, stiffness: 140 } });
  const pulse = 0.6 + 0.4 * ((Math.sin(frame / 4) + 1) / 2);
  const label = useEnter(28, 16);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', opacity: fade(frame, 0, durationInFrames) }}>
      <Viewport glitch>
        {/* detection bounding box around the glitched character */}
        <div
          style={{
            position: 'absolute',
            left: 318,
            bottom: 112,
            width: 96,
            height: 132,
            border: `3px solid ${C.amber}`,
            borderRadius: 6,
            boxShadow: `0 0 ${20 * pulse}px ${C.amber}`,
            transform: `scale(${interpolate(box, [0, 1], [1.6, 1])})`,
            opacity: box,
          }}
        >
          <div style={{ position: 'absolute', top: -28, left: -3, background: C.amber, color: '#1a1205', fontFamily: FONT, fontWeight: 700, fontSize: 14, padding: '2px 8px', borderRadius: 4, whiteSpace: 'nowrap' }}>
            ⚠ clipping
          </div>
        </div>
      </Viewport>
      <div
        style={{
          marginTop: 22,
          fontFamily: FONT,
          fontSize: 26,
          color: C.text,
          opacity: label,
          transform: `translateY(${interpolate(label, [0, 1], [12, 0])}px)`,
        }}
      >
        <b style={{ color: C.amber }}>Visual bug detected</b> · character clipping through wall · <span style={{ color: C.muted }}>00:42</span>
      </div>
    </AbsoluteFill>
  );
};

/* ----------------------------------------------------------- Scene 4 */
const Row: React.FC<{ k: string; v: string; color?: string }> = ({ k, v, color }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: FONT, fontSize: 22, padding: '10px 0', borderBottom: '1px solid rgba(148,163,184,0.12)' }}>
    <span style={{ color: C.muted }}>{k}</span>
    <span style={{ color: color || C.text, fontWeight: 600 }}>{v}</span>
  </div>
);

const SceneReport: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const card = useEnter(0, 20);
  const check = useEnter(34, 16);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', opacity: fade(frame, 0, durationInFrames) }}>
      <div
        style={{
          width: 720,
          background: C.panel,
          border: `1px solid ${C.panelEdge}`,
          borderRadius: 18,
          padding: 30,
          boxShadow: '0 30px 80px rgba(0,0,0,0.55)',
          transform: `translateY(${interpolate(card, [0, 1], [40, 0])}px) scale(${interpolate(card, [0, 1], [0.96, 1])})`,
          opacity: card,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
          {/* video evidence thumbnail */}
          <div style={{ position: 'relative', width: 150, height: 90, borderRadius: 10, overflow: 'hidden', background: 'linear-gradient(160deg, #1f3350, #0c131c)', border: `1px solid ${C.panelEdge}`, flex: 'none' }}>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 0, height: 0, borderLeft: `18px solid ${C.text}`, borderTop: '11px solid transparent', borderBottom: '11px solid transparent', marginLeft: 4 }} />
            </div>
          </div>
          <div style={{ fontFamily: FONT }}>
            <div style={{ color: C.text, fontSize: 26, fontWeight: 700 }}>Bug report</div>
            <div style={{ color: C.muted, fontSize: 18 }}>auto-generated by Vera</div>
          </div>
        </div>
        <Row k="Severity" v="High" color={C.red} />
        <Row k="Type" v="Geometry / clipping" />
        <Row k="Frame" v="#1280 · 00:42" />
        <Row k="Video evidence" v="attached ✓" color={C.emeraldLite} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 22, opacity: check }}>
          <div style={{ width: 26, height: 26, borderRadius: 99, background: C.emerald, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#03130d', fontWeight: 900 }}>✓</div>
          <span style={{ fontFamily: FONT, color: C.emeraldLite, fontSize: 22, fontWeight: 600 }}>Report filed automatically</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ----------------------------------------------------------- Scene 5 */
const SceneCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const a = useEnter(0, 20);
  const b = useEnter(10, 20);
  const btn = useEnter(22, 18);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center', opacity: fade(frame, 0, durationInFrames) }}>
      <div style={{ marginBottom: 26, opacity: a }}>
        <Logo size={40} />
      </div>
      <div
        style={{
          fontFamily: FONT,
          fontSize: 56,
          fontWeight: 800,
          color: C.text,
          opacity: a,
          transform: `translateY(${interpolate(a, [0, 1], [20, 0])}px)`,
        }}
      >
        Catch bugs while you sleep.
      </div>
      <div style={{ fontFamily: FONT, fontSize: 28, color: C.muted, marginTop: 14, opacity: b }}>
        A fraction of the cost of Gemini or Claude.
      </div>
      <div
        style={{
          marginTop: 34,
          opacity: btn,
          transform: `scale(${interpolate(btn, [0, 1], [0.9, 1])})`,
          fontFamily: FONT,
          fontWeight: 700,
          fontSize: 26,
          color: '#03130d',
          background: `linear-gradient(135deg, ${C.emeraldLite}, ${C.emerald})`,
          padding: '16px 30px',
          borderRadius: 12,
          boxShadow: `0 0 40px ${C.emerald}55`,
        }}
      >
        Join the private beta →
      </div>
      <div style={{ fontFamily: FONT, fontSize: 20, color: C.muted, marginTop: 18, opacity: btn }}>
        unrealsolutions.com
      </div>
    </AbsoluteFill>
  );
};

/* ----------------------------------------------------------- root */
export const VeraDemo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg1 }}>
      <Background />
      <Sequence from={0} durationInFrames={75}>
        <SceneIntro />
      </Sequence>
      <Sequence from={75} durationInFrames={105}>
        <SceneWatch />
      </Sequence>
      <Sequence from={180} durationInFrames={105}>
        <SceneDetect />
      </Sequence>
      <Sequence from={285} durationInFrames={90}>
        <SceneReport />
      </Sequence>
      <Sequence from={375} durationInFrames={75}>
        <SceneCTA />
      </Sequence>
      <Watermark />
    </AbsoluteFill>
  );
};
