export default {
  name: 'category',
  title: 'Categorias',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Nome da Categoria',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug (Link amigável)',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'image',
      title: 'Imagem da Categoria',
      type: 'image',
      options: { hotspot: true }
    },
    {
      name: 'order',
      title: 'Ordem de Exibição',
      type: 'number',
      description: 'Ex: 1 para aparecer primeiro',
      initialValue: 0
    }
  ]
}
