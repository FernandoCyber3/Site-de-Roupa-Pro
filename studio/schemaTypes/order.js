export default {
  name: 'order',
  title: 'Pedidos (Checkout)',
  type: 'document',
  readOnly: true, // Pedidos não devem ser editados pelo painel normalmente
  fields: [
    { name: 'customer_name', title: 'Nome do Cliente', type: 'string' },
    { name: 'customer_email', title: 'Email', type: 'string' },
    { name: 'customer_phone', title: 'WhatsApp/Telefone', type: 'string' },
    { name: 'shipping_address', title: 'Endereço Completo', type: 'text' },
    { name: 'payment_method', title: 'Forma de Pagamento', type: 'string' },
    { name: 'total', title: 'Valor Total', type: 'number' },
    {
      name: 'status',
      title: 'Status do Pedido',
      type: 'string',
      options: {
        list: [
          { title: 'Pendente', value: 'pending' },
          { title: 'Pago', value: 'paid' },
          { title: 'Enviado', value: 'shipped' },
          { title: 'Entregue', value: 'delivered' },
          { title: 'Cancelado', value: 'canceled' }
        ]
      }
    },
    {
      name: 'items',
      title: 'Itens Comprados',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', title: 'Produto', type: 'string' },
            { name: 'size', title: 'Tamanho', type: 'string' },
            { name: 'quantity', title: 'Quantidade', type: 'number' },
            { name: 'price', title: 'Preço Pago', type: 'number' }
          ]
        }
      ]
    }
  ],
  preview: {
    select: { title: 'customer_name', subtitle: 'total' },
    prepare({ title, subtitle }) {
      return { title: `Pedido: ${title}`, subtitle: `Total: R$ ${subtitle}` }
    }
  }
}
