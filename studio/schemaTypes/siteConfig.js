export default {
  name: 'siteConfig',
  title: 'Configurações do Site',
  type: 'document',
  fields: [
    {
      name: 'banner_text',
      title: 'Texto da Faixa (Banner Topo)',
      type: 'string',
      description: 'Ex: FRETE GRÁTIS ACIMA DE R$299 • NOVA COLEÇÃO DISPONÍVEL'
    },
    {
      name: 'whatsapp_number',
      title: 'Número do WhatsApp',
      type: 'string',
      description: 'Ex: 5511999999999 (Apenas números, com código do país 55 e DDD)'
    },
    {
      name: 'instagram_url',
      title: 'URL do Instagram',
      type: 'url'
    },
    {
      name: 'facebook_url',
      title: 'URL do Facebook',
      type: 'url'
    },
    {
      name: 'threads_url',
      title: 'URL do Threads',
      type: 'url'
    },

    // ─── Vídeos em Destaque (Seção da Homepage) ──────────────────────────────
    // Para trocar os vídeos basta colar a URL direta do arquivo .mp4 ou .webm
    {
      name: 'feature_video_1',
      title: '📹 Vídeo Destaque 1 — URL (painel esquerdo)',
      type: 'url',
      description: 'URL direta do vídeo (ex: https://cdn.exemplo.com/video1.mp4). Aparece no painel esquerdo da seção de vídeos.'
    },
    {
      name: 'feature_video_label_1',
      title: '🏷️ Vídeo Destaque 1 — Legenda',
      type: 'string',
      description: 'Texto exibido sobre o vídeo 1. Ex: Nova Coleção Verão'
    },
    {
      name: 'feature_video_2',
      title: '📹 Vídeo Destaque 2 — URL (painel direito)',
      type: 'url',
      description: 'URL direta do vídeo (ex: https://cdn.exemplo.com/video2.mp4). Aparece no painel direito da seção de vídeos.'
    },
    {
      name: 'feature_video_label_2',
      title: '🏷️ Vídeo Destaque 2 — Legenda',
      type: 'string',
      description: 'Texto curto exibido sobre o vídeo 2. Ex: Streetwear Exclusivo'
    },
  ]
}
