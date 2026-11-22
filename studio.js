const $=id=>document.getElementById(id);
const supabaseClient=window.supabase.createClient(window.FANORA_SUPABASE_URL,window.FANORA_SUPABASE_PUBLISHABLE_KEY);
let currentUser=null;
const setStatus=(id,message)=>{$(id).textContent=message};
function showUser(user){currentUser=user;$('signOut').hidden=!user;$('authStatus').textContent=user?('Logged in as '+user.email):'You are not logged in.';}
function renderProfile(profile){
  $('displayName').value=profile?.display_name||'';
  $('username').value=profile?.username||'';
  $('bio').value=profile?.bio||'';
  $('previewName').textContent=profile?.display_name||'Your name';
  $('previewHandle').textContent='@'+(profile?.username||'yourname');
  $('previewBio').textContent=profile?.bio||'Your bio will appear here.';
  $('avatar').textContent=(profile?.display_name||'F').trim().charAt(0).toUpperCase();
}
async function loadProfile(){
  if(!currentUser){renderProfile(null);return;}
  const {data,error}=await supabaseClient.from('profiles').select('username,display_name,bio').eq('id',currentUser.id).maybeSingle();
  if(error){setStatus('profileStatus','Could not load profile: '+error.message);return;}
  renderProfile(data);
}
async function loadPosts(){
  $('posts').replaceChildren();
  if(!currentUser){const p=document.createElement('p');p.className='empty';p.textContent='Log in to load your posts.';$('posts').append(p);return;}
  const {data,error}=await supabaseClient.from('posts').select('id,title,body,visibility,status,created_at').eq('creator_id',currentUser.id).order('created_at',{ascending:false});
  if(error){const p=document.createElement('p');p.className='empty';p.textContent='Could not load posts: '+error.message;$('posts').append(p);return;}
  if(!data?.length){const p=document.createElement('p');p.className='empty';p.textContent='No posts yet. Create your first post above.';$('posts').append(p);return;}
  for(const post of data){const card=document.createElement('article');card.className='post';const tag=document.createElement('small');tag.textContent=(post.status==='published'?'PUBLISHED':'DRAFT')+' · '+(post.visibility==='members'?'MEMBERS ONLY':'PUBLIC');const title=document.createElement('h3');title.textContent=post.title;const body=document.createElement('p');body.textContent=post.body;card.append(tag,title,body);$('posts').append(card);}
}
async function refreshSession(){
  const {data,error}=await supabaseClient.auth.getSession();
  if(error)setStatus('authStatus','Session error: '+error.message);
  showUser(data.session?.user||null);
  if(currentUser){await loadProfile();await loadPosts();}
}
$('signUp').addEventListener('click',async()=>{
  const email=$('authEmail').value.trim(),password=$('authPassword').value;
  if(!email||password.length<8){setStatus('authStatus','Enter a valid email and a password of at least 8 characters.');return;}
  const {data,error}=await supabaseClient.auth.signUp({email,password});
  if(error){setStatus('authStatus','Sign-up failed: '+error.message);return;}
  if(data.session){showUser(data.user);await loadProfile();await loadPosts();setStatus('authStatus','Account created and logged in.');}
  else setStatus('authStatus','Account created. Check your email for the verification link, then log in.');
});
$('authForm').addEventListener('submit',async e=>{
  e.preventDefault();const {data,error}=await supabaseClient.auth.signInWithPassword({email:$('authEmail').value.trim(),password:$('authPassword').value});
  if(error){setStatus('authStatus','Login failed: '+error.message);return;}
  showUser(data.user);await loadProfile();await loadPosts();
});
$('signOut').addEventListener('click',async()=>{
  const {error}=await supabaseClient.auth.signOut();
  if(error){setStatus('authStatus','Logout failed: '+error.message);return;}
  showUser(null);renderProfile(null);await loadPosts();setStatus('authStatus','You have logged out.');
});
$('profileForm').addEventListener('submit',async e=>{
  e.preventDefault();if(!currentUser){setStatus('profileStatus','Please create an account or log in first.');return;}
  const profile={id:currentUser.id,display_name:$('displayName').value.trim(),username:$('username').value.trim().toLowerCase(),bio:$('bio').value.trim()};
  const {data,error}=await supabaseClient.from('profiles').upsert(profile,{onConflict:'id'}).select('username,display_name,bio').single();
  if(error){setStatus('profileStatus','Could not save profile: '+error.message);return;}
  renderProfile(data);setStatus('profileStatus','Profile saved to FANORA cloud database.');
});
$('postForm').addEventListener('submit',async e=>{
  e.preventDefault();if(!currentUser){setStatus('postStatus','Please create an account or log in first.');return;}
  if($('visibility').value==='members'){setStatus('postStatus','Members-only publishing is not enabled yet. Choose Public for now.');return;}
  const post={creator_id:currentUser.id,title:$('postTitle').value.trim(),body:$('postBody').value.trim(),visibility:'public',status:'published'};
  const {error}=await supabaseClient.from('posts').insert(post);
  if(error){setStatus('postStatus','Could not publish: '+error.message);return;}
  $('postForm').reset();setStatus('postStatus','Post published to your FANORA account.');await loadPosts();
});
$('refreshPosts').addEventListener('click',loadPosts);
supabaseClient.auth.onAuthStateChange((_event,session)=>{showUser(session?.user||null);if(session?.user){loadProfile();loadPosts();}else{renderProfile(null);loadPosts();}});
refreshSession();
