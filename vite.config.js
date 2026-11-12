import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({plugins:[react()],server:{proxy:{'/tmdb':{target:process.env.VITE_API_PROXY_TARGET||'http://localhost:3000',changeOrigin:true},'/filmes':{target:process.env.VITE_API_PROXY_TARGET||'http://localhost:3000',changeOrigin:true}}}});
