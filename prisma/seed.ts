import { prisma } from "../lib/prisma";
import { PRODUCTS } from "../lib/products";

async function main() {
  console.log(`Start seeding ...`);

  // Clear existing products
  await prisma.product.deleteMany({});

  for (const p of PRODUCTS) {
    const product = await prisma.product.create({
      data: {
        id: p.id,
        slug: p.slug,
        nameBn: p.nameBn,
        category: p.category,
        mark: p.mark,
        monthlyPrice: p.monthlyPrice,
        isOneTime: p.isOneTime,
        unitLabel: p.unitLabel,
        badge: p.badge,
        deliveryEta: p.deliveryEta,
        stock: p.stock,
        aboutBn: p.aboutBn,
        metaBn: p.metaBn,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        specs: p.specs as any,
        includes: p.includes,
        wasPrice: p.wasPrice,
        imageUrl: p.imageUrl,
      },
    });
    console.log(`Created product with id: ${product.id}`);
  }
  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
