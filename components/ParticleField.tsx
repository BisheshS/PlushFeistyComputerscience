import { useEffect, useRef } from 'react'
import { gsap, reducedMotion } from '../lib/motion'

/**
 * One particle field for the whole puchka site (raw WebGL, no library).
 * The same points take different forms as you scroll, read from the DOM:
 *   [data-pf-ribbon]  a glowing folding ribbon centred on this element ("hero" sits a little higher)
 *   [data-pf-stage]   scatter plot -> orchestrator network -> living app, stepped by fieldState.principle (0..3)
 *                     (research: observe, agentic engineering: act, experiences: deliver)
 *   [data-pf-word]    the particles assemble into this element's text
 *   [data-pf-dark]    regions with a dark ground: points glow there, elsewhere they are ink
 * Between those, the ribbon stays on as a softer full-width background.
 */
export const fieldState = { principle: 0 }

const VERT = `
precision highp float;
attribute vec3 aP;
attribute float aR;
attribute vec2 aT;
uniform float uTime, uAspect, uDpr, uZoom, uTurb, uIntro, uRibY, uRibA, uSpan, uRot;
uniform vec2 uMouse;
uniform vec4 uW;     // research, agentic, experiences, (unused)
uniform float uWW;   // word
uniform vec3 uStage; // ndc centre x, y, half size
uniform vec4 uWord;  // ndc x0, y0 (bottom), x1, y1 (top)
varying float vA;
varying float vU;
varying float vHot;

mat2 rot(float a) { float c = cos(a), s = sin(a); return mat2(c, s, -s, c); }

// 3D simplex noise (Ashima Arts, MIT).
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

vec2 stageProj(vec3 q, out float k) {
  k = 3.0 / (3.0 - q.z * 0.8);
  return uStage.xy + vec2(q.x / uAspect, q.y) * uStage.z * k;
}

// A point on a rounded rectangle outline, s in 0..1 around the perimeter.
vec2 rrect(float s, float w, float h, float c) {
  float ew = 2.0 * (w - c), eh = 2.0 * (h - c), arc = 1.5707963 * c;
  float d = s * (2.0 * ew + 2.0 * eh + 4.0 * arc);
  if (d < ew) return vec2(-w + c + d, h);
  d -= ew;
  if (d < arc) { float a = d / c; return vec2(w - c, h - c) + c * vec2(sin(a), cos(a)); }
  d -= arc;
  if (d < eh) return vec2(w, h - c - d);
  d -= eh;
  if (d < arc) { float a = d / c; return vec2(w - c, -h + c) + c * vec2(cos(a), -sin(a)); }
  d -= arc;
  if (d < ew) return vec2(w - c - d, -h);
  d -= ew;
  if (d < arc) { float a = d / c; return vec2(-w + c, -h + c) + c * vec2(-sin(a), -cos(a)); }
  d -= arc;
  if (d < eh) return vec2(-w, -h + c + d);
  d -= eh;
  float a = d / c;
  return vec2(-w + c, h - c) + c * vec2(-cos(a), sin(a));
}

float h11(float n) { return fract(sin(n * 12.9898) * 43758.5453); }

// Agent n (0..3 inner workers, 4..9 outer specialists) on its orbit.
vec2 agentPos(float n, float t) {
  float a = n < 3.5 ? n * 1.5707963 + t * 0.15 : (n - 4.0) * 1.0471976 + 0.4 - t * 0.06;
  return (n < 3.5 ? 0.42 : 0.80) * vec2(cos(a), sin(a));
}

// Agent state over a 9 s cycle: x = progress, y = cycle phase, z = ember flicker on failure.
vec3 agentState(float n, float t) {
  float c = t / 9.0 + n * 0.37, m = floor(c);
  c = fract(c);
  float fail = step(0.6, h11(m * 5.0 + n));
  float pr = clamp((c - 0.15) / 0.6, 0.0, 1.0);
  float prF = c < 0.55 ? min(pr, 0.45) : clamp((c - 0.55) / 0.2, 0.0, 1.0);
  float hot = fail * step(0.35, c) * step(c, 0.55) * step(0.25, fract(t * 3.0));
  return vec3(mix(pr, prF, fail), c, hot);
}

// Height of the app's progress chart at screen x.
float chartY(float cx, float t) {
  return 0.17 + 0.25 * smoothstep(-0.36, 0.36, cx) + 0.03 * sin(cx * 17.0 + 1.0) + 0.006 * sin(t * 0.7 + cx * 5.0);
}

// Each particle commits to a form at its own moment, so shapes assemble in waves.
float stagger(float w, float r) { return clamp((w - r * 0.4) / 0.6, 0.0, 1.0); }

void main() {
  float u = aP.x, v = aP.y, r = aP.z, t = uTime;
  float dust = step(0.94, aR);

  // ---- Ribbon: a folding sheet fixed to the screen, longer than any screen edge.
  // Three moods (fold, helix twist, ripple) drift in and out on slow, unrelated clocks,
  // and simplex noise bends the sheet, so the pattern never visibly repeats.
  float ph = t * 0.045;
  float mFold = 0.5 + 0.5 * sin(ph);
  float mTwist = 0.5 + 0.5 * sin(ph * 0.73 + 2.0);
  float mRipple = 0.5 + 0.5 * sin(ph * 1.31 + 4.0);
  float x = mix(-uSpan, uSpan, u);
  float uu = (x / 1.9 + 1.0) * 0.5;
  float nz = snoise(vec3(uu * 1.4, v * 0.9, t * 0.06));
  float cy = (0.2 + 0.1 * mRipple) * sin(uu * 3.1 + t * 0.23) + 0.10 * sin(uu * 6.3 - t * 0.31) + 0.12 * nz;
  float ang = uu * (2.0 + 1.6 * mTwist) + 1.5 * sin(uu * 2.1 + t * 0.17) + 0.6 * sin(t * 0.13)
    + mTwist * 1.1 * sin(uu * 5.0 - t * 0.37) + 0.8 * nz;
  float w = (0.75 + 0.35 * sin(uu * 3.6 - t * 0.2 + 1.3)) * (0.7 + 0.6 * mFold);
  float off = (v - 0.5) * w;
  off += 0.045 * mRipple * sin(v * 16.0 + uu * 7.0 - t * 1.1);
  vec3 p = vec3(x, cy + cos(ang) * off, sin(ang) * off + (r - 0.5) * (0.03 + dust * 1.1));
  p.y += dust * (fract(r * 7.13) - 0.5) * 1.2;
  p.z += 0.15 * snoise(vec3(uu * 2.2 + 7.0, v * 2.0, t * 0.09));
  float mx = exp(-pow((x - uMouse.x * 1.8 * uSpan / 1.9) * 1.3, 2.0));
  p.y += uMouse.y * 0.12 * mx;
  p.z += 0.18 * mx * abs(uMouse.x);
  p.yz = rot(0.5) * p.yz;
  float d = 3.0 - p.z;
  vec2 q2 = vec2(p.x * uZoom, p.y * uZoom) / d;
  q2 = rot(uRot) * q2;
  vec2 nR = vec2(q2.x / uAspect, q2.y + uRibY);
  float blur = abs(d - 3.0) * 1.8;
  float sR = uZoom * 1.25 / d * (1.0 + blur);
  float sheen = 0.55 + 1.3 * pow(abs(sin(ang)), 6.0);
  float edge = 1.0 - pow(abs(v - 0.5) * 2.0, 6.0) * 0.75;
  float aRb = (dust > 0.5 ? 0.38 : 0.22 * sheen) * edge * uRibA / (1.0 + blur * blur * 1.5);

  // ---- research (observe): a noisy scatter plot on faint axes collapses onto one
  // clean S-curve, then loosens again. A few ember outliers never join the curve.
  float isAxis = step(aR, 0.06);
  float isOut = step(0.9975, r) * (1.0 - isAxis);
  float pulse = smoothstep(0.15, 0.85, 0.5 + 0.5 * sin(t * 0.45));
  vec2 S;
  if (isAxis > 0.5) {
    float tick = step(fract(u * 7.0), 0.05) * fract(r * 5.0) * 0.05;
    S = v < 0.5 ? vec2(mix(-0.9, 0.92, u), -0.78 - tick) : vec2(-0.9 - tick, mix(-0.78, 0.86, u));
  } else {
    float sx = mix(-0.82, 0.86, u);
    float curve = 1.35 / (1.0 + exp(-5.5 * sx)) - 0.62 + 0.03 * sin(sx * 3.0 + t * 0.4);
    float spread = mix(0.6, 0.02, pulse);
    S = vec2(sx, curve + (v + fract(r * 13.7) - 1.0) * spread);
    if (isOut > 0.5) {
      // Seven stubborn data points, well off the curve.
      float oi = floor(fract(aR * 13.0) * 7.0);
      float ox = -0.62 + oi * 0.22;
      float oc = 1.35 / (1.0 + exp(-5.5 * ox)) - 0.62;
      float side = mod(oi, 2.0) < 0.5 ? 1.0 : -1.0;
      S = vec2(ox, oc + side * (0.28 + 0.12 * fract(oi * 0.37))) + (vec2(v, fract(r * 31.0)) - 0.5) * 0.025;
    }
  }
  float kS;
  vec2 nS = stageProj(vec3(S, (aR - 0.5) * 0.05), kS);
  float hS = isOut;
  float aS = isAxis * 0.11 + isOut * 0.9 + (1.0 - isAxis) * (1.0 - isOut) * (0.035 + 0.035 * pulse);

  // ---- agentic engineering (act): an orchestrator network. Four workers on a fast inner
  // orbit and six specialists on a slow outer orbit, on a plane tilted back. Task dashes
  // travel out along curved links, each agent's progress ring fills while it works, results
  // travel back. A failing agent flickers ember, then restarts. A status arc circles the
  // orchestrator; when it completes, a ship ring bursts outward.
  vec2 A; float aL; float pk = 0.0;
  if (aR < 0.08) {
    float gs = aR / 0.08, ga = u * 6.2831853;
    if (gs < 0.8) {
      A = (gs < 0.3 ? 0.42 : 0.80) * vec2(cos(ga), sin(ga));
      aL = 0.12 * step(fract(u * 90.0), 0.5);
    } else {
      float tn = floor(u * 72.0), tk = tn / 72.0 * 6.2831853;
      A = (0.87 + v * (mod(tn, 6.0) < 0.5 ? 0.05 : 0.025)) * vec2(cos(tk), sin(tk));
      aL = 0.25;
    }
  } else if (aR < 0.38) {
    float kn = floor((aR - 0.08) / 0.30 * 10.0);
    vec2 pn = agentPos(kn, t);
    vec3 st = agentState(kn, t);
    float s0 = kn < 3.5 ? 0.38 : 0.22;
    float sl = mix(s0, 1.0 - 0.4 * s0, u);
    vec2 ctl = 0.5 * pn + (kn < 3.5 ? 0.35 : -0.3) * vec2(-pn.y, pn.x);
    A = mix(ctl * sl, mix(ctl, pn, sl), sl) + (v - 0.5) * 0.006;
    float c = st.y;
    float sp = c < 0.15 ? c / 0.15 : 1.0 - clamp((c - 0.75) / 0.15, 0.0, 1.0);
    float go = (c < 0.15 || (c > 0.75 && c < 0.9)) ? 1.0 : 0.0;
    float dash = go * (1.0 - smoothstep(0.0, 0.05, abs(u - sp)));
    aL = 0.03 + 0.03 * step(0.15, c) * step(c, 0.75) + 0.5 * dash;
  } else if (aR < 0.68) {
    float ks = (aR - 0.38) / 0.30 * 10.0, kn = floor(ks), kf = fract(ks);
    vec3 st = agentState(kn, t);
    float work = step(0.15, st.y) * step(st.y, 0.75);
    float na = 1.5707963 - u * 6.2831853, nr;
    if (kf < 0.4) { nr = 0.055 + (v - 0.5) * 0.006; aL = 0.12; }
    else if (kf < 0.8) { nr = 0.036 + (v - 0.5) * 0.012; aL = 0.16 * step(u, st.x); }
    else { nr = 0.016 * sqrt(v); aL = 0.05 + 0.2 * work; }
    A = agentPos(kn, t) + nr * (kn < 3.5 ? 1.25 : 1.5) * vec2(cos(na), sin(na));
    pk = st.z;
  } else if (aR < 0.76) {
    float ks = (aR - 0.68) / 0.08 * 12.0, kn = 4.0 + floor(ks * 0.5);
    vec3 st = agentState(kn, t);
    float grow = smoothstep(0.15, 0.3, st.y) * (1.0 - smoothstep(0.65, 0.75, st.y));
    float sa = t * 1.2 + floor(ks) * 3.1415927 + kn, da = fract(ks) * 6.2831853;
    A = agentPos(kn, t) + 0.16 * grow * vec2(cos(sa), sin(sa)) + 0.018 * sqrt(v) * vec2(cos(da), sin(da));
    aL = 0.12 * grow;
    pk = st.z;
  } else if (aR < 0.94) {
    float os = (aR - 0.76) / 0.18, oa = 1.5707963 - u * 6.2831853, orad;
    float done = step(u, fract(t / 18.0));
    if (os < 0.3) { orad = 0.05 * sqrt(v) * (1.0 + 0.08 * sin(t * 1.4)); aL = 0.06; }
    else if (os < 0.5) { orad = 0.082 + (v - 0.5) * 0.004; aL = 0.07; }
    else { orad = 0.17 + (v - 0.5) * mix(0.004, 0.022, done); aL = mix(0.04, 0.2, done); }
    A = orad * vec2(cos(oa), sin(oa));
  } else {
    float be = clamp(fract(t / 18.0) / 0.2, 0.0, 1.0), ba = u * 6.2831853;
    A = mix(0.17, 0.95, 1.0 - (1.0 - be) * (1.0 - be)) * (1.0 + (v - 0.5) * 0.02) * vec2(cos(ba), sin(ba));
    aL = 0.4 * (1.0 - be);
  }
  float kL;
  float zL = -A.y * 0.435 + (aR - 0.5) * 0.05;
  A.y *= 0.9;
  vec2 nL = stageProj(vec3(A, zL), kL);

  // ---- experiences (deliver): a living app. A large phone whose screen is a habit app
  // drawn in particles: header, a line chart that draws itself as the week fills, seven
  // streak days, a card sliding in, a checklist ticking off (the active box in ember).
  // One 14 s clock drives the screen.
  vec2 P; float aK; float pkK = 0.0;
  float D = fract(t / 14.0);
  float days = min(D * 9.0, 7.0);
  float live = 1.0 - smoothstep(0.93, 1.0, D);
  float rev = (0.15 + 0.85 * days / 7.0) * 0.96;
  if (aR < 0.16) {
    float fs = aR / 0.16;
    if (fs < 0.8) {
      float inr = step(0.6, fs);
      P = rrect(u, 0.42 - 0.024 * inr, 0.86 - 0.024 * inr, 0.12 - 0.022 * inr) * (1.0 + (v - 0.5) * 0.01);
      aK = mix(0.16, 0.06, inr);
    } else if (fs < 0.95) {
      // Ghost screens either side: the previous and the next screen of the app.
      P = rrect(u, 0.26, 0.56, 0.09) + vec2(fs < 0.875 ? -0.74 : 0.74, 0.0);
      aK = 0.2;
    } else { P = vec2(0.435 + (v - 0.5) * 0.01, mix(0.28, 0.46, u)); aK = 0.12; }
  } else if (aR < 0.19) {
    P = aR < 0.175 ? vec2((u - 0.5) * 0.16, 0.775 + (v - 0.5) * 0.036)
                   : vec2((u - 0.5) * 0.26, -0.805 + (v - 0.5) * 0.012);
    aK = 0.18;
  } else if (aR < 0.27) {
    float hs = (aR - 0.19) / 0.08, ha = u * 6.2831853;
    if (hs < 0.35) {
      P = vec2(-0.27, 0.62) + (hs < 0.15 ? 0.05 + (v - 0.5) * 0.005 : 0.03 * sqrt(v)) * vec2(cos(ha), sin(ha));
      aK = 0.10;
    } else if (hs < 0.75) { P = vec2(mix(-0.17, 0.14, u), 0.645 + (v - 0.5) * 0.034); aK = 0.10; }
    else { P = vec2(mix(-0.17, 0.03, u), 0.59 + (v - 0.5) * 0.018); aK = 0.05; }
  } else if (aR < 0.50) {
    float cs = (aR - 0.27) / 0.23;
    if (cs < 0.6) {
      float tipc = step(rev, u), ca = cs * 73.3;
      float cxx = mix(-0.31, 0.31, min(u, rev));
      P = vec2(cxx, chartY(cxx, t)) + mix(vec2(0.0, (v - 0.5) * 0.016), 0.022 * sqrt(v) * vec2(cos(ca), sin(ca)), tipc);
      aK = mix(0.07, mix(0.012, 0.12, rev), tipc) * live;
    } else if (cs < 0.85) {
      float dk = floor(u * 7.0) + 1.0, dx = -0.31 + dk * 0.0886;
      P = vec2(dx, mix(0.10, chartY(dx, t), v));
      aK = 0.05 * step(dk, days + 0.001) * step(fract(v * 14.0), 0.5) * live;
    } else { P = vec2(mix(-0.33, 0.33, u), 0.10 + (v - 0.5) * 0.004); aK = 0.06; }
  } else if (aR < 0.62) {
    float ss = (aR - 0.50) / 0.12 * 7.0, sk = floor(ss), sf = fract(ss), sa = u * 6.2831853;
    float full = clamp(days - sk, 0.0, 1.0) * live;
    float sr = sf < 0.4 ? 0.03 + (v - 0.5) * 0.004 : 0.022 * sqrt(v) * full;
    P = vec2(-0.27 + sk * 0.09, -0.03) + sr * vec2(cos(sa), sin(sa));
    aK = sf < 0.4 ? 0.10 : 0.09 * full;
  } else if (aR < 0.74) {
    float ks = (aR - 0.62) / 0.12, ka = u * 6.2831853;
    float ce = smoothstep(0.04, 0.14, D) * live;
    if (ks < 0.5) P = rrect(u, 0.31, 0.075, 0.035) * (1.0 + (v - 0.5) * 0.01);
    else if (ks < 0.65) P = vec2(-0.22, 0.0) + 0.032 * sqrt(v) * vec2(cos(ka), sin(ka));
    else if (ks < 0.85) P = vec2(mix(-0.15, 0.12, u), 0.02 + (v - 0.5) * 0.02);
    else P = vec2(mix(-0.15, -0.15 + 0.37 * days / 7.0, u), -0.025 + (v - 0.5) * 0.01);
    P += vec2(0.22 * (1.0 - ce), -0.215);
    aK = 0.08 * ce;
  } else if (aR < 0.96) {
    float ls = (aR - 0.74) / 0.22 * 3.0, lk = floor(ls), lf = fract(ls);
    float t0 = 0.30 + 0.18 * lk;
    float tick = smoothstep(0.0, 0.06, D - t0) * live;
    float act = step(t0 - 0.18, D) * (1.0 - step(t0, D));
    vec2 row = vec2(-0.27, -0.40 - 0.13 * lk);
    if (lf < 0.25) { P = row + rrect(u, 0.042, 0.042, 0.014); aK = 0.10; pkK = act; }
    else if (lf < 0.45) {
      vec2 ck = u < 0.35 ? mix(vec2(-0.018, 0.002), vec2(-0.005, -0.013), u / 0.35)
                         : mix(vec2(-0.005, -0.013), vec2(0.02, 0.016), (u - 0.35) / 0.65);
      P = row + ck * 1.4 + (v - 0.5) * 0.01;
      aK = 0.08 * step(u, tick) * step(0.001, tick);
    } else {
      P = vec2(mix(-0.19, 0.21 - 0.07 * lk, u), row.y + (v - 0.5) * 0.026);
      aK = mix(0.09, 0.04, tick);
    }
  } else {
    float hx = mix(-0.31, 0.31, rev), rp = fract(t * 0.4), ra = u * 6.2831853;
    P = vec2(hx, chartY(hx, t)) + (0.03 + 0.07 * rp + (v - 0.5) * 0.004) * vec2(cos(ra), sin(ra));
    aK = 0.12 * (1.0 - rp) * live;
  }
  P *= 1.2;
  float kK;
  vec2 nK = stageProj(vec3(P, (aR - 0.5) * 0.04), kK);

  // ---- Wordmark: points sampled from the footer text.
  vec2 nW = vec2(mix(uWord.x, uWord.z, aT.x), mix(uWord.w, uWord.y, aT.y))
    + 0.0015 * vec2(sin(t * 1.7 + r * 40.0), cos(t * 1.3 + aR * 50.0));

  // ---- Blend the forms. The ribbon takes whatever weight is left.
  float wS = stagger(uW.x, r), wL = stagger(uW.y, r), wK = stagger(uW.z, r);
  float wW = stagger(uWW, r);
  float wR = max(0.0, 1.0 - (wS + wL + wK + wW));
  float sum = wR + wS + wL + wK + wW + 1e-4;
  vec2 n = (nR * wR + nS * wS + nL * wL + nK * wK + nW * wW) / sum;
  float size = (sR * wR + kS * wS + kL * wL + kK * wK + 0.85 * wW) / sum;
  vA = (aRb * wR + aS * wS + aL * wL + aK * wK + 0.34 * wW) / sum;
  vHot = (hS * wS + pk * wL + pkK * wK) / sum;
  vU = u;

  // Opening: every point starts as scattered dust and flows into place at its own moment.
  float ip = clamp(uIntro * 1.7 - fract(r * 3.7 + aR) * 0.7, 0.0, 1.0);
  ip = ip * ip * (3.0 - 2.0 * ip);
  vec2 scat = vec2(r * 2.0 - 1.0, aR * 2.0 - 1.0) * 1.1;
  n = mix(scat, n, ip);
  vA = mix(0.1, vA, ip);
  size = mix(1.0, size, ip);

  // Fast scrolling stirs the field.
  n += uTurb * 0.05 * vec2(sin(r * 50.0 + t * 3.0), cos(aR * 60.0 + t * 2.7)) * (0.3 + dust);

  gl_Position = vec4(n, 0.0, 1.0);
  gl_PointSize = uDpr * (0.9 + r * 1.4) * size;
}`

const FRAG = `
precision mediump float;
varying float vA;
varying float vU;
varying float vHot;
uniform vec4 uDark; // device px from the bottom: region A y0, y1, region B y0, y1
void main() {
  vec2 c = gl_PointCoord - 0.5;
  float d = dot(c, c);
  if (d > 0.25) discard;
  float fy = gl_FragCoord.y;
  float dark = max(step(uDark.x, fy) * step(fy, uDark.y), step(uDark.z, fy) * step(fy, uDark.w));
  vec3 glow = vec3(1.0, 0.97, 0.92);
  glow = mix(glow, vec3(1.0, 0.79, 0.29), smoothstep(0.55, 1.0, vU) * 0.55);
  glow = mix(glow, vec3(1.0, 0.36, 0.18), smoothstep(0.4, 0.0, vU) * 0.45);
  vec3 ink = vec3(0.04, 0.04, 0.05);
  float hot = clamp(vHot, 0.0, 1.0);
  vec3 col = mix(mix(ink, glow, dark), vec3(1.0, 0.36, 0.18), hot);
  float a = vA * (1.0 - d * 4.0) * mix(0.9, 1.0, max(dark, hot));
  gl_FragColor = vec4(col * a, a);
}`

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const smooth = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a))
  return t * t * (3 - 2 * t)
}

// Sample the footer wordmark into points (0..1, y down).
function sampleText(el: HTMLElement): Float32Array {
  const rect = el.getBoundingClientRect()
  const W = Math.max(1, Math.round(Math.min(rect.width, 1800)))
  const H = Math.max(1, Math.round(rect.height))
  const cv = document.createElement('canvas')
  cv.width = W
  cv.height = H
  const ctx = cv.getContext('2d')
  if (!ctx) return new Float32Array([0.5, 0.5])
  const cs = getComputedStyle(el)
  let fs = parseFloat(cs.fontSize)
  const text = el.dataset.pfWord || el.textContent || ''
  const setFont = () => {
    ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${fs}px ${cs.fontFamily}`
    ;(ctx as CanvasRenderingContext2D & { letterSpacing?: string }).letterSpacing = `${-0.04 * fs}px`
  }
  setFont()
  let m = ctx.measureText(text)
  if (m.width > W * 0.96) {
    fs *= (W * 0.96) / m.width
    setFont()
    m = ctx.measureText(text)
  }
  ctx.textAlign = 'center'
  ctx.textBaseline = 'alphabetic'
  const asc = m.actualBoundingBoxAscent
  const desc = m.actualBoundingBoxDescent
  ctx.fillStyle = '#000'
  ctx.fillText(text, W / 2, H / 2 + (asc - desc) / 2)
  const data = ctx.getImageData(0, 0, W, H).data
  const pts: number[] = []
  for (let y = 0; y < H; y += 2)
    for (let x = 0; x < W; x += 2) if (data[(y * W + x) * 4 + 3] > 120) pts.push(x / W, y / H)
  return pts.length ? new Float32Array(pts) : new Float32Array([0.5, 0.5])
}

const ParticleField = () => {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas || reducedMotion()) return
    const gl = canvas.getContext('webgl', { antialias: false, premultipliedAlpha: true, alpha: true })
    if (!gl) return

    const sh = (type: number, src: string) => {
      const s = gl.createShader(type)!
      gl.shaderSource(s, src)
      gl.compileShader(s)
      return s
    }
    const prog = gl.createProgram()!
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT))
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG))
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return
    gl.useProgram(prog)
    document.documentElement.dataset.pf = 'on'

    const N = window.innerWidth < 700 ? 90000 : 220000
    const pts = new Float32Array(N * 3)
    const rnd = new Float32Array(N)
    for (let i = 0; i < N; i++) {
      pts[i * 3] = Math.random()
      pts[i * 3 + 1] = Math.random()
      pts[i * 3 + 2] = Math.random()
      rnd[i] = Math.random()
    }
    const attr = (data: Float32Array, name: string, size: number, usage: number = gl.STATIC_DRAW) => {
      const buf = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, buf)
      gl.bufferData(gl.ARRAY_BUFFER, data, usage)
      const loc = gl.getAttribLocation(prog, name)
      if (loc >= 0) {
        gl.enableVertexAttribArray(loc)
        gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0)
      }
      return buf
    }
    attr(pts, 'aP', 3)
    attr(rnd, 'aR', 1)
    const word = new Float32Array(N * 2).fill(0.5)
    const wordBuf = attr(word, 'aT', 2, gl.DYNAMIC_DRAW)

    const U = (n: string) => gl.getUniformLocation(prog, n)
    const u = {
      time: U('uTime'), aspect: U('uAspect'), dpr: U('uDpr'), zoom: U('uZoom'),
      turb: U('uTurb'), intro: U('uIntro'), ribY: U('uRibY'), ribA: U('uRibA'), span: U('uSpan'), rot: U('uRot'), mouse: U('uMouse'), w: U('uW'),
      ww: U('uWW'), stage: U('uStage'), word: U('uWord'), dark: U('uDark'),
    }

    gl.enable(gl.BLEND)
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
    gl.clearColor(0, 0, 0, 0)

    let dpr = 1
    let aspect = 1
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(window.innerWidth * dpr)
      canvas.height = Math.round(window.innerHeight * dpr)
      gl.viewport(0, 0, canvas.width, canvas.height)
      aspect = window.innerWidth / Math.max(1, window.innerHeight)
      gl.uniform1f(u.aspect, aspect)
      const portrait = aspect < 1
      const zoom = portrait ? 2.2 : 2.7 * clamp(aspect / 1.5, 0.75, 1)
      gl.uniform1f(u.zoom, zoom)
      gl.uniform1f(u.dpr, dpr)
      // Phones: the ribbon runs corner to corner so it fills a tall screen.
      gl.uniform1f(u.rot, portrait ? 1.05 : 0)
      // Half-length in world units, so both ends always sit past the screen edges.
      const reach = portrait ? Math.sqrt(aspect * aspect + 1) : aspect
      gl.uniform1f(u.span, (1.35 * 3 * reach) / zoom)
    }
    resize()

    const sampleWord = () => {
      const el = document.querySelector<HTMLElement>('[data-pf-word]')
      if (!el) return
      const s = sampleText(el)
      const n = s.length / 2
      const el2 = el.getBoundingClientRect()
      const jx = 1.2 / Math.max(1, el2.width)
      const jy = 1.2 / Math.max(1, el2.height)
      for (let i = 0; i < N; i++) {
        const j = Math.floor(Math.random() * n)
        word[i * 2] = s[j * 2] + (Math.random() - 0.5) * jx
        word[i * 2 + 1] = s[j * 2 + 1] + (Math.random() - 0.5) * jy
      }
      gl.bindBuffer(gl.ARRAY_BUFFER, wordBuf)
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, word)
    }
    document.fonts?.ready.then(sampleWord)
    sampleWord()

    const intro = { v: 0 }
    gsap.to(intro, { v: 1, duration: 3.6, delay: 0.35, ease: 'power2.out' })
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 }
    const cur = { rib: 1, s: 0, l: 0, k: 0, w: 0, ribY: 0.1 }
    let lastY = window.scrollY
    let vel = 0
    let t = 8
    let raf = 0

    const vis = (r: DOMRect, vh: number) =>
      r.height <= 0 ? 0 : clamp((Math.min(r.bottom, vh) - Math.max(r.top, 0)) / Math.min(vh, r.height))
    const ndcY = (y: number, vh: number) => 1 - (2 * y) / vh

    const frame = () => {
      t += 0.016
      const vw = window.innerWidth
      const vh = window.innerHeight

      // Ribbon: fixed to the screen. Anchors ([data-pf-ribbon]) only make it brighter.
      let rib = 0
      document.querySelectorAll<HTMLElement>('[data-pf-ribbon]').forEach((el) => {
        rib = Math.max(rib, vis(el.getBoundingClientRect(), vh))
      })
      rib = smooth(0.15, 0.85, rib)
      const ribY = aspect < 1 ? 0.05 : 0.08

      // Stage: the three figures, stepped by the pinned section.
      let sv = 0
      const stage = document.querySelector<HTMLElement>('[data-pf-stage]')
      if (stage) {
        const r = stage.getBoundingClientRect()
        sv = smooth(0.35, 0.9, vis(r, vh))
        const half = r.height / vh
        gl.uniform3f(u.stage, ((r.left + r.width / 2) / vw) * 2 - 1, ndcY(r.top + r.height / 2, vh), half * 0.62)
      }
      const p = fieldState.principle
      const ts = sv * (1 - smooth(0.7, 1.1, p))
      const tl = sv * smooth(0.7, 1.1, p) * (1 - smooth(1.7, 2.1, p))
      const tk = sv * smooth(1.7, 2.1, p)

      // Wordmark.
      let tw = 0
      const wEl = document.querySelector<HTMLElement>('[data-pf-word]')
      if (wEl) {
        const r = wEl.getBoundingClientRect()
        tw = smooth(0.45, 0.9, clamp((vh - r.top) / (r.height * 0.9 + vh * 0.1)))
        gl.uniform4f(u.word, (r.left / vw) * 2 - 1, ndcY(r.bottom, vh), (r.right / vw) * 2 - 1, ndcY(r.top, vh))
      }

      // Dark grounds (up to two on screen).
      const dark: number[] = []
      document.querySelectorAll<HTMLElement>('[data-pf-dark]').forEach((el) => {
        const r = el.getBoundingClientRect()
        if (r.bottom > 0 && r.top < vh && dark.length < 4) dark.push((vh - r.bottom) * dpr, (vh - r.top) * dpr)
      })
      while (dark.length < 4) dark.push(-1, -1)

      const ease = 0.1
      cur.rib += (rib - cur.rib) * ease
      cur.s += (ts - cur.s) * ease
      cur.l += (tl - cur.l) * ease
      cur.k += (tk - cur.k) * ease
      cur.w += (tw - cur.w) * ease
      cur.ribY = ribY

      const y = window.scrollY
      vel += (y - lastY - vel) * 0.15
      lastY = y
      mouse.x += (mouse.tx - mouse.x) * 0.04
      mouse.y += (mouse.ty - mouse.y) * 0.04

      gl.uniform1f(u.time, t)
      gl.uniform1f(u.intro, intro.v)
      gl.uniform1f(u.ribY, cur.ribY)
      gl.uniform1f(u.ribA, 0.55 + 0.45 * cur.rib)
      gl.uniform1f(u.turb, clamp(Math.abs(vel) / 45))
      gl.uniform2f(u.mouse, mouse.x, mouse.y)
      gl.uniform4f(u.w, cur.s, cur.l, cur.k, 0)
      gl.uniform1f(u.ww, cur.w)
      gl.uniform4f(u.dark, dark[0], dark[1], dark[2], dark[3])
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.drawArrays(gl.POINTS, 0, N)
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      mouse.tx = (e.clientX / window.innerWidth) * 2 - 1
      mouse.ty = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    let rt = 0
    const onResize = () => {
      resize()
      window.clearTimeout(rt)
      rt = window.setTimeout(sampleWord, 200)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(rt)
      gsap.killTweensOf(intro)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('resize', onResize)
      delete document.documentElement.dataset.pf
    }
  }, [])

  return <canvas ref={ref} className="pfield" aria-hidden="true" />
}

export default ParticleField
