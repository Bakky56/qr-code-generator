const supabaseUrl = 'https://pgagzteeniktasxcdodi.supabase.co';
const supabaseKey = 'sb_publishable__smuRxH-yY-OGOzFh-VGKw_Lm3zKmg7';

const supabaseClient = window.supabase.createClient(
  supabaseUrl,
  supabaseKey
);

const params = new URLSearchParams(window.location.search);

const id = params.get('id');

console.log('ID:', id);

const profileName = document.getElementById('profileName');
const profileImage = document.getElementById('profileImage');

async function loadProfile() {

  if (!id) {
    profileName.textContent = 'Profile not found';
    console.error('No ID found in URL');
    return;
  }

  const { data: profile, error } =
    await supabaseClient
      .from('profiles')
      .select('name, image_url')
      .eq('id', id)
      .single();

  console.log('Profile:', profile);
  console.log('Error:', error);

  if (error) {
    profileName.textContent = 'Profile not found';
    return;
  }

  profileName.textContent = profile.name;
  profileImage.src = profile.image_url;
}

loadProfile();