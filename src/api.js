const ROOT=(import.meta.env.VITE_API_URL||'').replace(/\/$/,'');
export const poster=(path,size='w500')=>path?`https://image.tmdb.org/t/p/${size}${path}`:null;
export async function api(path,options={}){
  let response;
  try { response=await fetch(`${ROOT}${path}`,{...options,headers:{'Content-Type':'application/json',...options.headers}}); }
  catch { throw new Error('Não foi possível conectar à API. Verifique se o backend está executando na porta 3000.'); }
  let body=await response.json().catch(()=>null);
  if(!response.ok) throw new Error(body?.erro||body?.mensagem||`Erro HTTP ${response.status}`);
  return body;
}
export const getTrending=()=>api('/tmdb/em-alta');
export const searchMovies=(q)=>api(`/tmdb/pesquisar?query=${encodeURIComponent(q)}`);
export const getDetails=(id)=>api(`/tmdb/filmes/${id}`);
export const getCast=(id)=>api(`/tmdb/filmes/${id}/elenco`);
export const getCatalog=()=>api('/filmes');
export const createMovie=(movie)=>api('/filmes',{method:'POST',body:JSON.stringify(movie)});
export const updateMovie=(id,movie)=>api(`/filmes/${id}`,{method:'PUT',body:JSON.stringify(movie)});
export const deleteMovie=(id)=>api(`/filmes/${id}`,{method:'DELETE'});
