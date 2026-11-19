// In-memory integration check: never writes to a real Supabase project or browser storage.
import assert from 'node:assert/strict';
import { createServer } from 'vite';
const values = new Map();
globalThis.localStorage = {
  getItem: key => values.get(key) ?? null,
  setItem: (key,value) => values.set(key,String(value)),
  removeItem: key => values.delete(key),
};
const server = await createServer({server:{middlewareMode:true},appType:'custom',logLevel:'error'});
try {
  const {supabase,isConfigured,isDemoMode} = await server.ssrLoadModule('/src/lib/supabase.js');
  assert.equal(isConfigured,false,'Demo tests require an unconfigured local environment; no real account will be touched.');
  assert.equal(isDemoMode,true);
  const api = await server.ssrLoadModule('/src/lib/api.js');
  const {data:registered} = await supabase.auth.signUp({email:'seller@example.test',options:{data:{full_name:'Sample Seller',role:'seller'}}});
  const owner = {...registered.user,name:'Sample Seller',role:'seller'};
  const {data:profile} = await supabase.from('profiles').select('*').eq('id',owner.id).single();
  assert.equal(profile.role,'seller');
  const listing = await api.createProperty({title:'Integration sample',description:'Test only',price:150000,status:'For Sale',type:'House',city:'Ames',address:'Sample address',beds:3,baths:2,sqft:1100,yearBuilt:1995,features:[]},owner);
  assert.equal((await api.getMyProperties(owner)).length,1);
  assert.equal((await api.getMyProperties({id:'different-user'})).length,0);
  assert.equal((await api.getProperties({location:'Ames',minPrice:100000,maxPrice:160000})).some(p => p.id === listing.id),true);
  assert.equal((await api.getProperty(listing.id)).title,'Integration sample');
  await assert.rejects(api.deleteProperty(listing.id,{id:'different-user'}),/own demo listings/);
  await supabase.from('favorites').insert({user_id:owner.id,property_id:listing.id});
  const {data:favorites} = await supabase.from('favorites').select('property_id').eq('user_id',owner.id);
  assert.deepEqual(favorites,[{property_id:listing.id}]);
  await api.submitEnquiry({propertyId:listing.id,name:'Sample Buyer',email:'buyer@example.test',phone:'sample',subject:'Tour',message:'Sample enquiry'});
  assert.equal((await api.getMyEnquiries(owner)).length,1);
  assert.equal((await api.getMyEnquiries({id:'different-user'})).length,0);
  await api.deleteProperty(listing.id,owner);
  assert.equal((await api.getMyProperties(owner)).length,0);
  await supabase.auth.signOut();
  assert.equal((await supabase.auth.getSession()).data.session,null);
  const first = await supabase.auth.signInWithPassword({email:'first@example.test'});
  const second = await supabase.auth.signInWithPassword({email:'second@example.test'});
  assert.notEqual(first.data.user.id,second.data.user.id,'Unregistered demo users must not share an identity');
  console.log('Demo integration passed: account roles, isolated identities, listing ownership, filters, details, favorites, enquiries and logout.');
} finally {
  await server.close();
  delete globalThis.localStorage;
}
