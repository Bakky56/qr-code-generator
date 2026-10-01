const params = new URLSearchParams(window.location.search);

const name = params.get('name');
const image = params.get('image');

console.log("Name:", name);
console.log("Image:", image);

const profileName = document.getElementById('profileName');
const profileImage = document.getElementById('profileImage');

profileName.textContent = name;
profileImage.src = image;