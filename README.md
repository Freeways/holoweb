# HoloWeb

[![Latest NPM release][npm-badge]][npm-badge-url]
[![License][license-badge]][license-badge-url]
[![Dependencies][dependencies-badge]][dependencies-badge-url]
[![Dev Dependencies][devDependencies-badge]][devDependencies-badge-url]

## Hologram Web Framework
This project aims to create a lightweight, minimalist and easy to use framework for Holograms on webpage.

## Usage
Clone this repository and run:
```sh
npm run build:prod
```
Create your html file and include the minified file:
```html
<script src="./dist/holoweb.min.js"></script>
```
You can then try this code that would create a rotating holographic cube:
```javascript
var holoweb = new HoloWeb();

function animate() {
    requestAnimationFrame(animate);
    mesh.rotation.y += 0.01;
}

var texture = new THREE.TextureLoader().load('images/crate.gif');
var geometry = new THREE.BoxBufferGeometry(200, 200, 200);
var material = new THREE.MeshBasicMaterial({map: texture});
var mesh = new THREE.Mesh(geometry, material);
holoweb.add(mesh);

animate();
window.onmousemove = function (e) {
    mesh.position.x = 2 * (e.clientX - window.innerWidth / 2);
    mesh.position.y = 3 * (window.innerHeight / 2 - e.clientY);
}
```
[npm-badge]: https://img.shields.io/npm/v/holoweb.js.svg
[npm-badge-url]: https://www.npmjs.com/package/holoweb.js
[license-badge]: https://img.shields.io/npm/l/holoweb.js.svg
[license-badge-url]: ./LICENSE
[dependencies-badge]: https://img.shields.io/david/Freeways/holoweb.svg
[dependencies-badge-url]: https://david-dm.org/Freeways/holoweb
[devDependencies-badge]: https://img.shields.io/david/dev/Freeways/holoweb.svg
[devDependencies-badge-url]: https://david-dm.org/Freeways/holoweb?type=dev
