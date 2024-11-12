export const Fragment_Toon = `
varying vec3 lightdir;
varying vec3 eyenorm;

void main() {
       //vec3 lightdir = vec3 (1,1,2);
float ndotl = dot (normalize (eyenorm), normalize (lightdir));
if (ndotl > 0.8) {
ndotl = 1.0;
} else if (ndotl > 0.6) {
ndotl = 0.6;
} else {
ndotl = 0.2;
}
gl_FragColor = vec4 (ndotl, ndotl, ndotl, 1.0);
}
`;
