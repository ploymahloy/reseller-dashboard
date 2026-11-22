import { SqlQueryError } from '@prisma/orm-family-sql/errors';

import { createAcquisition } from '../src/acquisition/acquisition.service.js';
import { ItemListQuerySchema, UpdateItemRequestSchema } from '../src/item/item.schema.js';
import { getItemQuantities, getItems, updateItem } from '../src/item/item.service.js';
import { db, type Tx } from '../src/prisma/db.js';
import {
  createSupplier,
  getSupplierName,
  isSupplierNotFoundError,
  listSupplierNames
} from '../src/supplier/supplier.service.js';

class RollbackCheck extends Error {
  constructor() {
    super('rollback check');
  }
}

let errorCount = 0;

const check = (name: string, ok: boolean, detail?: unknown) => {
  if (ok) return;
  const extra = detail === undefined ? '' : ` (${JSON.stringify(detail)})`;
  const message = `❌ ${name}${extra}`;
  spinner.clear();
  errorCount++;
  console.error(message);
};

const client = db as {
  orm: typeof db.orm;
  transaction: typeof db.transaction;
};
const realTransaction = client.transaction.bind(client);
const realOrm = client.orm;
let joined: Tx | null = null;

client.transaction = (async (fn, options) => {
  if (joined) return fn(joined);
  return realTransaction(async (tx) => {
    joined = tx;
    client.orm = tx.orm;
    try {
      return await fn(tx);
    } finally {
      joined = null;
      client.orm = realOrm;
    }
  }, options);
}) as typeof db.transaction;

const stamp = Date.now().toString(36);
const canonical = `Probe Mixed ${stamp}`;
const wild = `100%_off_${stamp}`;
const decoy = `100ZZZ_off_${stamp}`;
const skuA = `sku-a-${stamp}`;
const skuB = `sku-b-${stamp}`;
const skuFragment = `a-${stamp}`;

const sameUtcDay = (left: Date, right: Date) =>
  left.getUTCFullYear() === right.getUTCFullYear() &&
  left.getUTCMonth() === right.getUTCMonth() &&
  left.getUTCDate() === right.getUTCDate();

const beforeNames = await listSupplierNames();
const beforeItems = (await getItems()).items;

const startSpinner = (text: string) => {
  const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
  let i = 0;

  // Hide cursor
  process.stdout.write('\x1B[?25l');

  const timer = setInterval(() => {
    process.stdout.write(`\r${frames[i]} ${text}`);
    i = (i + 1) % frames.length;
  }, 80);


  const clear = () => {
    clearInterval(timer);
    // Clear line (\x1B[2K), return to start (\r), and show cursor (\x1B[?25h)
    process.stdout.write('\r\x1B[2K\x1B[?25h');
  };

  return {
    clear, stop(finalText?: string) {
      clearInterval(timer);
      process.stdout.write(`\r\x1B[2K${finalText ? `${finalText}\n` : ''}\x1B[?25h`);
    }
  };
};

const spinner = startSpinner('Running tests...');

try {
  await db.transaction(async (tx) => {
    const created = await createSupplier({ name: canonical });
    check('createSupplier returns the stored name', created.name === canonical);
    check(
      'createSupplier returns timestamps',
      created.created_at instanceof Date && created.updated_at instanceof Date
    );

    const resolved = await getSupplierName(tx, canonical.toLowerCase());
    check('getSupplierName matches case-insensitively', resolved === canonical);

    const wildRow = await createSupplier({ name: wild });
    await createSupplier({ name: decoy });
    const wildResolved = await getSupplierName(tx, wild.toUpperCase());
    check('getSupplierName treats % and _ as literal characters', wildResolved === wildRow.name, wildResolved);

    let missing = false;
    try {
      await getSupplierName(tx, `missing-${stamp}`);
    } catch (error) {
      missing = isSupplierNotFoundError(error);
    }
    check('a missing supplier raises the not-found error', missing);

    const names = await listSupplierNames();
    check(
      'listSupplierNames sees the uncommitted suppliers',
      [canonical, wild, decoy].every((name) => names.includes(name))
    );

    const createdAcquisition = await createAcquisition({
      supplier_name: canonical.toLowerCase(),
      purchase_date: new Date('2026-11-20T15:00:00.000Z'),
      purchase_price: 10.1,
      freight_cost: 2.5,
      notes: 'probe',
      manifest: [{ lot: 'A', qty: 2, skip: undefined }],
      items: [
        { name: 'Widget', sku: skuA, condition: 'used_good', allocated_cost: 12.5, status: 'purchased' },
        { name: 'Gadget', sku: skuB, condition: 'new', allocated_cost: 0, status: 'listed' }
      ]
    });
    const { acquisition, items } = createdAcquisition;
    check('createAcquisition stores the canonical supplier name', acquisition.supplier_name === canonical);
    check(
      'createAcquisition returns money as numbers',
      acquisition.purchase_price === 10.1 && acquisition.freight_cost === 2.5,
      { purchase_price: acquisition.purchase_price, freight_cost: acquisition.freight_cost }
    );
    check('createAcquisition stores the UTC purchase date', acquisition.purchase_date === '2026-11-20', acquisition.purchase_date);
    check('createAcquisition keeps the note', acquisition.notes === 'probe');
    const manifest = acquisition.manifest;
    check(
      'createAcquisition stores the manifest without undefined cells',
      Array.isArray(manifest) && manifest.length === 1 && manifest[0]?.lot === 'A' && manifest[0]?.qty === 2 && !('skip' in manifest[0]),
      manifest
    );
    check('createAcquisition returns both items', items.length === 2 && items[0]?.sku === skuA && items[1]?.sku === skuB);
    check(
      'created items return money and enums',
      items[0]?.allocated_cost === 12.5 &&
      items[0]?.condition === 'used_good' &&
      items[0]?.status === 'purchased' &&
      items[1]?.allocated_cost === 0 &&
      items[1]?.status === 'listed'
    );

    const listed = (await getItems()).items;
    const listedA = listed.find((item) => item.sku === skuA);
    const listedB = listed.find((item) => item.sku === skuB);
    check(
      'getItems returns the new items parsed',
      listedA?.allocated_cost === 12.5 &&
      listedA.condition === 'used_good' &&
      listedA.acquisition_id === acquisition.id &&
      listedB?.status === 'listed' &&
      listedB.allocated_cost === 0
    );
    if (!listedA || !listedB) throw new Error('probe items missing');

    const byId = (await getItems({ id: listedA.id })).items;
    check('getItems filters by id', byId.length === 1 && byId[0]?.sku === skuA, byId.map((item) => item.id));

    const byAcquisition = (await getItems({ acquisition_id: acquisition.id })).items;
    check(
      'getItems filters by acquisition_id',
      byAcquisition.length === 2 &&
      byAcquisition.every((item) => item.acquisition_id === acquisition.id) &&
      byAcquisition.some((item) => item.sku === skuA) &&
      byAcquisition.some((item) => item.sku === skuB),
      byAcquisition.map((item) => item.sku)
    );

    const byName = (await getItems({ name: 'Widget' })).items;
    check(
      'getItems filters by name',
      byName.some((item) => item.sku === skuA) &&
      !byName.some((item) => item.sku === skuB) &&
      byName.every((item) => item.name === 'Widget'),
      byName.map((item) => item.sku)
    );

    const bySku = (await getItems({ sku: skuFragment })).items;
    check(
      'getItems filters by sku',
      bySku.some((item) => item.sku === skuA) &&
      !bySku.some((item) => item.sku === skuB) &&
      bySku.every((item) => item.sku.includes(skuFragment)),
      bySku.map((item) => item.sku)
    );

    const byCondition = (await getItems({ condition: 'used_good' })).items;
    check(
      'getItems filters by condition',
      byCondition.some((item) => item.sku === skuA) &&
      !byCondition.some((item) => item.sku === skuB) &&
      byCondition.every((item) => item.condition === 'used_good'),
      byCondition.map((item) => item.sku)
    );

    const byCost = (await getItems({ allocated_cost: 12.5 })).items;
    check(
      'getItems filters by allocated_cost',
      byCost.some((item) => item.sku === skuA) &&
      !byCost.some((item) => item.sku === skuB) &&
      byCost.every((item) => item.allocated_cost >= 12.5),
      byCost.map((item) => item.allocated_cost)
    );

    const byStatus = (await getItems({ status: 'purchased' })).items;
    check(
      'getItems filters by status',
      byStatus.some((item) => item.sku === skuA) &&
      !byStatus.some((item) => item.sku === skuB) &&
      byStatus.every((item) => item.status === 'purchased'),
      byStatus.map((item) => item.sku)
    );

    const byCreated = (await getItems({ created_at: listedA.created_at })).items;
    check(
      'getItems filters by created_at',
      byCreated.some((item) => item.sku === skuA) &&
      byCreated.some((item) => item.sku === skuB) &&
      byCreated.every((item) => sameUtcDay(item.created_at, listedA.created_at)),
      byCreated.map((item) => item.created_at)
    );

    const byUpdated = (await getItems({ updated_at: listedA.updated_at })).items;
    check(
      'getItems filters by updated_at',
      byUpdated.some((item) => item.sku === skuA) &&
      byUpdated.some((item) => item.sku === skuB) &&
      byUpdated.every((item) => sameUtcDay(item.updated_at, listedA.updated_at)),
      byUpdated.map((item) => item.updated_at)
    );

    const firstId = Math.min(listedA.id, listedB.id);
    const secondId = Math.max(listedA.id, listedB.id);
    const firstPage = await getItems({ acquisition_id: acquisition.id, page: 1, page_size: 1 });
    check(
      'getItems returns the first page',
      firstPage.page === 1 &&
      firstPage.page_size === 1 &&
      firstPage.total_items === 2 &&
      firstPage.items.length === 1 &&
      firstPage.items[0]?.id === firstId,
      firstPage
    );
    const secondPage = await getItems({ acquisition_id: acquisition.id, page: 2, page_size: 1 });
    check(
      'getItems returns the second page',
      secondPage.page === 2 &&
      secondPage.page_size === 1 &&
      secondPage.total_items === 2 &&
      secondPage.items.length === 1 &&
      secondPage.items[0]?.id === secondId,
      secondPage
    );
    const emptyPage = await getItems({ acquisition_id: acquisition.id, page: 3, page_size: 1 });
    check(
      'getItems returns an empty page past the end',
      emptyPage.total_items === 2 && emptyPage.items.length === 0,
      emptyPage
    );
    const defaultedPage = await getItems({ acquisition_id: acquisition.id, page_size: 1 });
    check(
      'getItems defaults to the first page',
      defaultedPage.page === 1 && defaultedPage.items.length === 1 && defaultedPage.items[0]?.id === firstId,
      defaultedPage
    );

    const parsedSort = ItemListQuerySchema.safeParse({
      acquisition_id: String(acquisition.id),
      sort: 'allocated_cost',
      order: 'desc',
      page: '1',
      page_size: '1'
    });
    check(
      'ItemListQuerySchema accepts allocated_cost and created_at sort params',
      parsedSort.success &&
      parsedSort.data.sort === 'allocated_cost' &&
      parsedSort.data.order === 'desc' &&
      ItemListQuerySchema.safeParse({ sort: 'created_at', order: 'asc' }).success &&
      !ItemListQuerySchema.safeParse({ sort: 'name' }).success &&
      !ItemListQuerySchema.safeParse({ order: 'sideways' }).success
    );

    const parsedUpdate = UpdateItemRequestSchema.parse({ condition: 'new', allocated_cost: '4.5' });
    check(
      'UpdateItemRequestSchema reads query values without defaulting status',
      parsedUpdate.condition === 'new' &&
      parsedUpdate.allocated_cost === 4.5 &&
      parsedUpdate.status === undefined &&
      UpdateItemRequestSchema.parse({}).status === undefined,
      parsedUpdate
    );

    const byCostAsc = (await getItems({ acquisition_id: acquisition.id, sort: 'allocated_cost', order: 'asc' })).items;
    check(
      'getItems sorts allocated_cost ascending',
      byCostAsc.length === 2 && byCostAsc[0]?.sku === skuB && byCostAsc[1]?.sku === skuA,
      byCostAsc.map((item) => ({ sku: item.sku, allocated_cost: item.allocated_cost }))
    );
    const byCostDesc = (await getItems({ acquisition_id: acquisition.id, sort: 'allocated_cost', order: 'desc' })).items;
    check(
      'getItems sorts allocated_cost descending',
      byCostDesc.length === 2 && byCostDesc[0]?.sku === skuA && byCostDesc[1]?.sku === skuB,
      byCostDesc.map((item) => ({ sku: item.sku, allocated_cost: item.allocated_cost }))
    );
    const costPage = await getItems({
      acquisition_id: acquisition.id,
      sort: 'allocated_cost',
      order: 'desc',
      page: 1,
      page_size: 1
    });
    check(
      'getItems pages after the allocated_cost sort',
      costPage.total_items === 2 && costPage.items.length === 1 && costPage.items[0]?.sku === skuA,
      costPage
    );

    const earlier = new Date('2020-01-01T00:00:00.000Z');
    const moved = await tx.orm.public.Item.where((item) => item.id.eq(listedA.id)).update({ created_at: earlier });
    check('probe item created_at can be moved', moved?.id === listedA.id && moved.created_at.getTime() === earlier.getTime());

    const byCreatedAsc = (await getItems({ acquisition_id: acquisition.id, sort: 'created_at' })).items;
    check(
      'getItems sorts created_at ascending, defaulting a missing order to asc',
      byCreatedAsc.length === 2 && byCreatedAsc[0]?.id === listedA.id && byCreatedAsc[1]?.id === listedB.id,
      byCreatedAsc.map((item) => ({ id: item.id, created_at: item.created_at }))
    );
    const byCreatedDesc = (await getItems({ acquisition_id: acquisition.id, sort: 'created_at', order: 'desc' })).items;
    check(
      'getItems sorts created_at descending',
      byCreatedDesc.length === 2 && byCreatedDesc[0]?.id === listedB.id && byCreatedDesc[1]?.id === listedA.id,
      byCreatedDesc.map((item) => ({ id: item.id, created_at: item.created_at }))
    );

    await tx.orm.public.Item.create({
      acquisition_id: acquisition.id,
      name: 'Widget',
      sku: skuA,
      condition: 'used_good',
      allocated_cost: '1.00',
      status: 'purchased'
    });
    const quantities = (await getItemQuantities()).filter((row) => row.sku === skuA || row.sku === skuB);
    check(
      'getItemQuantities returns a name, sku, and quantity for each sku',
      quantities.length === 2 &&
      quantities[0]?.name === 'Widget' &&
      quantities[0].sku === skuA &&
      quantities[0].quantity === 2 &&
      quantities[1]?.name === 'Gadget' &&
      quantities[1].sku === skuB &&
      quantities[1].quantity === 1,
      quantities
    );

    const probeQuantities = async (
      sortOnColumn: 'name' | 'sku' | 'quantity',
      order: 'asc' | 'desc'
    ) => (await getItemQuantities(sortOnColumn, order)).filter((row) => row.sku === skuA || row.sku === skuB);

    const byNameAsc = await probeQuantities('name', 'asc');
    check(
      'getItemQuantities sorts name ascending',
      byNameAsc.length === 2 && byNameAsc[0]?.name === 'Gadget' && byNameAsc[1]?.name === 'Widget',
      byNameAsc
    );
    const byNameDesc = await probeQuantities('name', 'desc');
    check(
      'getItemQuantities sorts name descending',
      byNameDesc.length === 2 && byNameDesc[0]?.name === 'Widget' && byNameDesc[1]?.name === 'Gadget',
      byNameDesc
    );
    const bySkuAsc = await probeQuantities('sku', 'asc');
    check(
      'getItemQuantities sorts sku ascending',
      bySkuAsc.length === 2 && bySkuAsc[0]?.sku === skuA && bySkuAsc[1]?.sku === skuB,
      bySkuAsc
    );
    const bySkuDesc = await probeQuantities('sku', 'desc');
    check(
      'getItemQuantities sorts sku descending',
      bySkuDesc.length === 2 && bySkuDesc[0]?.sku === skuB && bySkuDesc[1]?.sku === skuA,
      bySkuDesc
    );
    const byQuantityAsc = await probeQuantities('quantity', 'asc');
    check(
      'getItemQuantities sorts quantity ascending',
      byQuantityAsc.length === 2 && byQuantityAsc[0]?.quantity === 1 && byQuantityAsc[1]?.quantity === 2,
      byQuantityAsc
    );
    const byQuantityDesc = await probeQuantities('quantity', 'desc');
    check(
      'getItemQuantities sorts quantity descending',
      byQuantityDesc.length === 2 && byQuantityDesc[0]?.quantity === 2 && byQuantityDesc[1]?.quantity === 1,
      byQuantityDesc
    );

    const statusOnly = await updateItem(listedA.id, { status: 'inspecting' });
    check(
      'updateItem changes status without clearing allocated_cost',
      statusOnly.id === listedA.id && statusOnly.status === 'inspecting' && statusOnly.allocated_cost === 12.5,
      statusOnly
    );
    const repriced = await updateItem(listedA.id, { allocated_cost: 4 });
    check(
      'updateItem returns allocated_cost as a number',
      repriced.allocated_cost === 4 && repriced.status === 'inspecting',
      repriced
    );

    await tx.execute(tx.raw.sql`SAVEPOINT supplier_duplicate`.affectedCount().build());
    try {
      await createSupplier({ name: canonical.toUpperCase() });
      throw new Error('duplicate supplier insert succeeded');
    } catch (error) {
      if (error instanceof Error && error.message === 'duplicate supplier insert succeeded') throw error;
      check('a duplicate supplier name is a unique violation', SqlQueryError.is(error) && error.sqlState === '23505', error);
      await tx.execute(tx.raw.sql`ROLLBACK TO SAVEPOINT supplier_duplicate`.affectedCount().build());
    }

    const namesAfterDuplicate = await listSupplierNames();
    check(
      'the duplicate insert did not keep a second supplier',
      namesAfterDuplicate.filter((name) => name.toLowerCase() === canonical.toLowerCase()).length === 1
    );

    throw new RollbackCheck();
  });
} catch (error) {
  if (!(error instanceof RollbackCheck)) throw error;
}

const afterNames = await listSupplierNames();
const afterItems = (await getItems()).items;
check('rollback removed the suppliers', ![canonical, wild, decoy].some((name) => afterNames.includes(name)));
check('rollback removed the items', !afterItems.some((item) => item.sku === skuA || item.sku === skuB));
check(
  'supplier names match the baseline',
  afterNames.length === beforeNames.length && beforeNames.every((name) => afterNames.includes(name))
);
check(
  'item ids match the baseline',
  afterItems.length === beforeItems.length && beforeItems.every((item) => afterItems.some((row) => row.id === item.id))
);

await db.close();
if (errorCount > 0) {
  spinner.stop();
} else {
  spinner.stop('✅ All tests complete');
}
