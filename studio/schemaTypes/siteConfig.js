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
    }
  ]
}
