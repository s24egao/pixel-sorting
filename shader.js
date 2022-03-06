let vert = `
attribute vec3 aPosition;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

void main() {
	vec4 pos = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 1.0);
	gl_Position = pos;
}
`

let frag = `
precision mediump float;

uniform sampler2D mainTex;
uniform vec2 resolution;
uniform float threshold;
uniform float angle;
uniform bool inverse;
	
float lightness(vec4 c) {
	return (inverse)? 1.0 - (c.r * 0.3 + c.g * 0.6 + c.b * 0.1) : c.r * 0.3 + c.g * 0.6 + c.b * 0.1;
}

bool edge(vec2 p) {
	return p.x >= 1.0 || p.x <= 0.0 || p.y >= 1.0 || p.y <= 0.0;
}

void main() {
	vec2 st = gl_FragCoord.xy / resolution.xy;
	st.y = 1.0 - st.y;
	
	vec4 color = texture2D(mainTex, st);
	vec2 dir = vec2(cos(angle), sin(angle)) * 1.45;
	
	vec2 p1, p2;
	vec4 pixels[10];
	
	if(lightness(color) < threshold ) {
		gl_FragColor = vec4(color.r, color.g, color.b, 1.0);
		return;
	}
	
	for(float i = 0.0; i < 1.0; i += 0.002) {
		vec4 c = texture2D(mainTex, st + dir * i);
		if(lightness(c) < threshold || edge(st + dir * i)) {
			p1 = st + dir * i;
			break;
		}
	}
	
	for(float i = 0.0; i < 1.0; i += 0.002) {
		vec4 c = texture2D(mainTex, st - dir * i);
		if(lightness(c) < threshold || edge(st - dir * i)) {
			p2 = st - dir * i;
			break;
		}
	}
	
	for(int i = 0; i < 10; i++) {
		vec2 p = mix(p1, p2, float(i) / 10.0);
		pixels[i] = texture2D(mainTex, p);
	}

	for(int i = 0; i < 9; i++) {
		for(int j = 0; j < 9; j++) {
			if(lightness(pixels[j]) < lightness(pixels[j + 1])) {
				vec4 temp = pixels[j + 1];
				pixels[j + 1] = pixels[j];
				pixels[j] = temp;
			}
		}
	}

	for(int i = 0; i < 9; i++) {
		if(i == int(distance(p1, st) / distance(p1, p2) * 9.0)) {
			float f = fract(distance(p1, st) / distance(p1, p2) * 9.0);
			color = mix(pixels[i], pixels[i + 1], f);
		}
	}
	
	gl_FragColor = vec4(color.r, color.g, color.b, 1.0);
}
`