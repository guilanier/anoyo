function s(n,e,t){return e+n*(t-e)}var a=`float aastep(float threshold, float value) {
    float afwidth = length(vec2(dFdx(value), dFdy(value))) * 0.70710678118654757;
    return smoothstep(threshold - afwidth, threshold + afwidth, value);
}

float aaedge(vec2 uv, float thresh) {
    vec2 st = abs((uv - 0.5) * 2.0);
    float border = aastep(0.5, smoothstep(1.0, thresh, length(st.x))) *
    aastep(0.5, smoothstep(1.0, thresh, length(st.y)));
    return border;
}

#define BLACK           vec3(0.0, 0.0, 0.0)
#define WHITE           vec3(1.0, 1.0, 1.0)
#define RED             vec3(1.0, 0.0, 0.0)
#define GREEN           vec3(0.0, 1.0, 0.0)
#define BLUE            vec3(0.0, 0.0, 1.0)
#define YELLOW          vec3(1.0, 1.0, 0.0)
#define CYAN            vec3(0.0, 1.0, 1.0)
#define MAGENTA         vec3(1.0, 0.0, 1.0)
#define ORANGE          vec3(1.0, 0.5, 0.0)
#define PURPLE          vec3(1.0, 0.0, 0.5)
#define LIME            vec3(0.5, 1.0, 0.0)
#define ACQUA           vec3(0.0, 1.0, 0.5)
#define VIOLET          vec3(0.5, 0.0, 1.0)
#define AZUR            vec3(0.0, 0.5, 1.0)

/* Signed distance drawing methods */
float fill(in float x) { return 1.0 - aastep(0.0, x); }
float fill(float x, float size, float edge) {
    return 1.0 - smoothstep(size - edge, size + edge, x);
}
float fill(float x, float size) {
    return 1.0 - aastep(size, x);
}

float stroke(in float d, in float t) { return (1.0 - aastep(t, abs(d))); }
float stroke(float x, float size, float w) {
    float d = aastep(size, x + w * 0.5) - aastep(size, x - w * 0.5);
    return clamp(d, 0.0, 1.0);
}
float stroke(float x, float size, float w, float edge) {
    float d = smoothstep(size - edge, size + edge, x + w * 0.5) - smoothstep(size - edge, size + edge, x - w * 0.5);
    return clamp(d, 0.0, 1.0);
}

vec3 draw(in sampler2D t, in vec2 pos, in vec2 w) { vec2 s = w / 1.0; s.x *= -1.0; return texture2D(t, pos / s + 0.5).rgb; }

vec3 field(float d) {
	vec3 c1 = mix(WHITE, YELLOW, 0.4);
	vec3 c2 = mix(WHITE, AZUR, 0.7);
	vec3 c3 = mix(WHITE, ORANGE, 0.9);
	vec3 c4 = BLACK;
	
	float d0 = abs(stroke(mod(d + 0.1, 0.2) - 0.1, 0.004));
	float d1 = abs(stroke(mod(d + 0.025, 0.05) - 0.025, 0.004));
	float d2 = abs(stroke(d, 0.004));
	float f = clamp(d * 0.85, 0.0, 1.0);
	
	vec3 grd = mix(c1, c2, f);
	grd = mix(grd, c4, 1.0 - clamp(1.25 - d * 0.25, 0.0, 1.0));
	grd = mix(grd, c3, fill(d));
	grd = mix(grd, c4, max(d2 * 0.85, max(d0 * 0.25, d1 * 0.06125)) * clamp(1.25 - d, 0.0, 1.0));
	
	return grd;
}`,c=`#ifndef FNC_SCALE
#define FNC_SCALE
float scale(in float st, in float s, in float center) {
  return (st - center) * s + center;
}

float scale(in float st, in float s) {
  #ifdef CENTER_2D
  return scale(st, s, CENTER);
  #else
  return scale(st, s, 0.5);
  #endif
}

vec2 scale(in vec2 st, in vec2 s, in vec2 center) {
  return (st - center) * s + center;
}

vec2 scale(in vec2 st, in float value, in vec2 center) {
  return scale(st, vec2(value), center);
}

vec2 scale(in vec2 st, in vec2 s) {
  #ifdef CENTER_2D
  return scale(st, s, CENTER_2D);
  #else
  return scale(st, s, vec2(0.5));
  #endif
}

vec2 scale(in vec2 st, in float value) {
  return scale(st, vec2(value));
}

vec3 scale(in vec3 st, in vec3 s, in vec3 center) {
  return (st - center) * s + center;
}

vec3 scale(in vec3 st, in float value, in vec3 center) {
  return scale(st, vec3(value), center);
}

vec3 scale(in vec3 st, in vec3 s) {
  #ifdef CENTER_3D
  return scale(st, s, CENTER_3D);
  #else
  return scale(st, s, vec3(0.5));
  #endif
}

vec3 scale(in vec3 st, in float value) {
  return scale(st, vec3(value));
}
#endif`;export{a as d,s as l,c as s};
