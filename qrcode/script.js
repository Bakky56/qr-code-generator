const supabaseUrl = 'https://pgagzteeniktasxcdodi.supabase.co';
const supabaseKey = 'sb_publishable__smuRxH-yY-OGOzFh-VGKw_Lm3zKmg7';
const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);

const textInput = document.getElementById('textInput');

const imageInput = document.getElementById('imageInput');
const imgdisplay = document.getElementById('imgdisplay');
const displayName = document.getElementById('displayName');
const generatorButton = document.getElementById('generatorButton');
const qrCode = document.getElementById('qrCode');

generatorButton.addEventListener('click', async (e) => {
  e.preventDefault();

  const name = textInput.value.trim();
  const file = imageInput.files[0];

  if (!name) {
    alert('Please enter your name');
    return;
  }

  if (!file) {
    alert('Please choose an image');
    return;
  }

  const fileName = `${Date.now()}-${file.name}`;

  console.log('Uploading:', fileName);

  const { data, error } = await supabaseClient.storage
    .from('profiles')
    .upload(fileName, file);

  if (error) {
    console.error('Upload error:', error);
    return;
  }

  const { data: publicUrlData } = supabaseClient.storage
    .from('profiles')
    .getPublicUrl(fileName);

  const imageUrl = publicUrlData.publicUrl;
  const profileUrl = `profile.htm?name=${encodeURIComponent(name)}&image=${encodeURIComponent(imageUrl)}`;
  qrCode.innerHTML = '';

  new QRCode(qrCode, {
    text: profileUrl,
    width: 200,
    height: 200,
    colorDark: '#000000',
    colorLight: '#ffffff',
    correctLevel: QRCode.CorrectLevel.H,
  });
});
