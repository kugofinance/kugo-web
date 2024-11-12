export const Vertex_Toon = `
varying vec3 lightdir;
varying vec3 eyenorm;
uniform vec3 lightpos;
void main() {
gl_Position = projectionMatrix* modelViewMatrix * vec4( position, 1.0);

vec4 tmp = modelViewMatrix * vec4 (lightpos, 1.0);
lightdir = tmp.xyz;

eyenorm = normalMatrix * normal;
}`;
