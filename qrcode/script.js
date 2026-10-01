const supabaseUrl = 'https://pgagzteeniktasxcdodi.supabase.co';
const supabaseKey = 'sb_publishable__smuRxH-yY-OGOzFh-VGKw_Lm3zKmg7';

const supabaseClient = window.supabase.createClient(
  supabaseUrl,
  supabaseKey
);

const textInput = document.getElementById('textInput');
const imageInput = document.getElementById('imageInput');
const generatorButton = document.getElementById('generatorButton');
const qrCode = document.getElementById('qrCode');

generatorButton.addEventListener('click', async (e) => {
  e.preventDefault();

  const name = textInput.value.trim();
  const file = imageInput.files[0];

  // Check name
  if (!name) {
    alert('Please enter your name');
    return;
  }

  // Check image
  if (!file) {
    alert('Please choose an image');
    return;
  }

  // Create unique file name
  const fileName = `${Date.now()}-${file.name}`;

  console.log('Uploading:', fileName);
  console.log('Starting upload...');

  // Upload image to Supabase Storage
  const { data: uploadData, error } =
    await supabaseClient.storage
      .from('profiles')
      .upload(fileName, file);

  console.log('Upload finished');
  console.log('Upload data:', uploadData);
  console.log('Upload error:', error);

  // Check upload error
  if (error) {
    console.error('Upload error:', error);
    alert('Image upload failed');
    return;
  }

  // Get public image URL
  const { data: publicUrlData } =
    supabaseClient.storage
      .from('profiles')
      .getPublicUrl(fileName);

  const imageUrl = publicUrlData.publicUrl;

  console.log('Image URL:', imageUrl);

  // Save profile to Supabase Database
  const { data: profileData, error: profileError } =
    await supabaseClient
      .from('profiles')
      .insert({
        name: name,
        image_url: imageUrl
      })
      .select()
      .single();

  // Check database error
  if (profileError) {
    console.error('Profile save error:', profileError);
    alert('Could not save profile');
    return;
  }

  console.log('Profile saved:', profileData);

  // Get UUID from database
  const id = profileData.id;

  console.log('PROFILE ID:', id);

  // Create profile URL
  const profileUrl =
    `https://qrcode-generator-bakky.vercel.app/profile.html?id=${id}`;

  console.log('PROFILE URL:', profileUrl);
  console.log('URL LENGTH:', profileUrl.length);

  // Clear previous QR
  qrCode.innerHTML = '';

  // Generate QR code
  new QRCode(qrCode, {
    text: profileUrl,
    width: 200,
    height: 200,
    colorDark: '#000000',
    colorLight: '#ffffff',
    correctLevel: QRCode.CorrectLevel.H
  });

  console.log('QR code generated!');
});