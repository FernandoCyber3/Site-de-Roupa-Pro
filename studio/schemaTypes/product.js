export default {
  name: 'product',
  title: 'Produtos',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Título do Produto',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'price',
      title: 'Preço Original',
      type: 'number',
      validation: Rule => Rule.required()
    },
    {
      name: 'promo_price',
      title: 'Preço Promocional (Opcional)',
      type: 'number',
      description: 'Se preenchido, o produto aparecerá como Oferta/Outlet com preço riscado.'
    },
    {
      name: 'category',
      title: 'Categoria',
      type: 'reference',
      to: [{ type: 'category' }]
    },
    {
      name: 'video_file',
      title: 'Vídeo de Hover (Upload .mp4)',
      type: 'file',
      options: {
        accept: 'video/mp4'
      },
      description: 'Faça o upload de um vídeo curto (.mp4) para aparecer quando o cliente passar o mouse.'
    },
    {
      name: 'featured',
      title: 'Produto em Destaque?',
      type: 'boolean',
      initialValue: false,
      description: 'Se marcado, aparecerá na vitrine da página inicial.'
    },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Ativo', value: 'active' },
          { title: 'Rascunho / Inativo', value: 'draft' }
        ],
      },
      initialValue: 'active'
    },
    {
      name: 'colorVariants',
      title: 'Cores, Fotos e Tamanhos',
      description: 'DICA: Primeiro escolha uma cor, suba as fotos dela e marque todos os tamanhos que ela possui.',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'colorEntry',
          title: 'Configuração por Cor',
          fields: [
            {
              name: 'color',
              title: 'Qual a cor?',
              type: 'string',
              description: 'Ex: Azul Royal, Amarelo Canário'
            },
            {
              name: 'images',
              title: 'Galeria de Fotos desta Cor',
              description: 'DICA: Você pode selecionar várias fotos de uma vez no seu computador e arrastar para cá.',
              type: 'array',
              of: [{ type: 'image', options: { hotspot: true } }]
            },
            {
              name: 'sizeType',
              title: 'Tipo de Grade',
              type: 'string',
              options: {
                list: [
                  { title: 'Letras (P ao GG)', value: 'letters' },
                  { title: 'Números Tênis (34 ao 44)', value: 'shoes' },
                  { title: 'Números Calças (34 ao 52)', value: 'pants' },
                  { title: 'Personalizado (Digitar manual)', value: 'custom' }
                ],
                layout: 'radio'
              },
              initialValue: 'letters'
            },
            {
              name: 'sizes',
              title: 'Selecione os Tamanhos Disponíveis',
              description: 'Marque todos que você tem em estoque para esta cor.',
              type: 'array',
              of: [{ type: 'string' }],
              options: {
                list: [
                  // Letras
                  { title: 'P', value: 'P' },
                  { title: 'M', value: 'M' },
                  { title: 'G', value: 'G' },
                  { title: 'GG', value: 'GG' },
                  { title: 'XG', value: 'XG' },
                  // Tênis comum
                  { title: '34', value: '34' }, { title: '35', value: '35' }, { title: '36', value: '36' },
                  { title: '37', value: '37' }, { title: '38', value: '38' }, { title: '39', value: '39' },
                  { title: '40', value: '40' }, { title: '41', value: '41' }, { title: '42', value: '42' },
                  { title: '43', value: '43' }, { title: '44', value: '44' },
                  // Calças comum
                  { title: '46', value: '46' }, { title: '48', value: '48' }, { title: '50', value: '50' }, { title: '52', value: '52' }
                ]
              },
              hidden: ({ parent }) => parent?.sizeType === 'custom'
            },
            {
              name: 'customSizes',
              title: 'Tamanhos Personalizados',
              description: 'Digite os tamanhos separados por vírgula. Ex: 36, 38, 40',
              type: 'string',
              hidden: ({ parent }) => parent?.sizeType !== 'custom'
            },
            {
              name: 'stock',
              title: 'Estoque Padrão',
              description: 'Quantidade disponível para cada tamanho marcado acima.',
              type: 'number',
              initialValue: 10
            }
          ],
          preview: {
            select: { color: 'color', media: 'images.0', sizes: 'sizes' },
            prepare({ color, media, sizes }) {
              const sizesText = sizes?.length ? `[${sizes.join(', ')}]` : 'Sem tamanhos';
              return {
                title: `${color?.toUpperCase() || 'SEM COR'} ${sizesText}`,
                media
              }
            }
          }
        }
      ]
    }
  ],
  preview: {
    select: {
      title: 'title',
      price: 'price',
      colorVariants: 'colorVariants'
    },
    prepare(selection) {
      const { title, price, colorVariants } = selection;

      // Tenta encontrar a primeira imagem disponível em qualquer uma das cores
      const firstImage = colorVariants?.find(cv => cv.images?.[0])?.images?.[0];

      return {
        title: title,
        subtitle: `R$ ${price}`,
        media: firstImage
      }
    }
  }
}
