import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';

// 1. Configurando o cliente do Sanity com os dados fornecidos
export const sanityClient = createClient({
  projectId: 'p0fj0d8j',
  dataset: 'production',
  useCdn: true, // Use CDN para respostas mais rápidas
  apiVersion: '2024-05-03', // Data atual
  token: '', // Token será necessário apenas para gravar dados (ex: Checkout)
});

// 2. Construtor de URLs de imagens do Sanity
const builder = createImageUrlBuilder(sanityClient);
export const urlFor = (source) => builder.image(source);

// 3. Funções para mapear o formato do Sanity para o formato que o seu site já espera
const mapProduct = (p) => {
  const allColorImages = p.colorVariants?.flatMap(cv => cv.images || []) || [];
  const galleryImages = p.images || [];
  const combinedImages = [...new Set([...galleryImages, ...allColorImages])];

  const variants = [];
  p.colorVariants?.forEach(cv => {
    // Pegar a lista de tamanhos (dos checkboxes ou do campo personalizado)
    let sizeList = cv.sizes || [];
    if (cv.sizeType === 'custom' && cv.customSizes) {
      sizeList = cv.customSizes.split(',').map(s => s.trim()).filter(Boolean);
    }

    sizeList.forEach(sz => {
      variants.push({
        color: cv.color?.toUpperCase(),
        size: sz.toUpperCase(),
        stock: cv.stock || 0,
        // Para a troca de imagem, anexamos a primeira imagem da cor à variante
        image: cv.images?.[0] ? urlFor(cv.images[0]).url() : undefined,
        colorImages: cv.images?.map(img => urlFor(img).url()) || []
      });
    });
  });

  return {
    ...p,
    id: p._id,
    image: combinedImages[0] ? urlFor(combinedImages[0]).url() : undefined,
    images: combinedImages.map(img => urlFor(img).url()),
    category: p.categorySlug || p.categoryName,
    categoryName: p.categoryName,
    variants,
    created_date: p._createdAt
  };
};

const mapCategory = (c) => ({
  ...c,
  id: c._id,
  slug: c.slug?.current || c.slug,
  image: c.image ? urlFor(c.image).url() : undefined
});

// 4. O nosso "Truque": Um falso Base44Client que na verdade fala com o Sanity!
export const base44 = {
  entities: {
    SiteConfig: {
      list: async () => {
        const query = `*[_type == "siteConfig"]{
          banner_text,
          whatsapp_number,
          instagram_url,
          facebook_url,
          threads_url
        }`;
        return await sanityClient.fetch(query);
      }
    },
    Category: {
      list: async (orderBy = 'order', limit = 20) => {
        const orderPart = orderBy === 'order' ? 'order asc' : '_createdAt desc';
        const res = await sanityClient.fetch(`*[_type == "category"] | order(${orderPart}) [0...${limit}]`);
        return res.map(mapCategory);
      }
    },
    Product: {
      list: async (orderBy = '-created_date', limit = 100) => {
        const res = await sanityClient.fetch(`*[_type == "product"] { 
          ..., 
          "categoryName": category->name,
          "categorySlug": category->slug.current,
          "video_url": video_file.asset->url
        } | order(_createdAt desc) [0...${limit}]`);
        return res.map(mapProduct);
      },
      filter: async ({ id, category }) => {
        if (id) {
          const res = await sanityClient.fetch(`*[_type == "product" && _id == $id] { 
            ..., 
            "categoryName": category->name,
            "categorySlug": category->slug.current,
            "video_url": video_file.asset->url
          }`, { id });
          return res.map(mapProduct);
        }
        if (category) {
          const res = await sanityClient.fetch(`*[_type == "product" && (category->slug.current == $category || category->name == $category)] { 
            ..., 
            "categoryName": category->name,
            "categorySlug": category->slug.current,
            "video_url": video_file.asset->url
          }`, { category });
          return res.map(mapProduct);
        }
        return [];
      }
    },
    Order: {
      create: async (data) => {
        console.log("🛒 [Sanity] Pedido gerado (Aguardando Token para salvar no banco):", data);
        // await sanityClient.create({ _type: 'order', ...data });
        return { success: true };
      }
    }
  }
};
