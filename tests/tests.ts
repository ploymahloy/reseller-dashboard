import { SqlQueryError } from '@prisma/orm-family-sql/errors';

import { createAcquisition } from '../src/acquisition/acquisition.service.js';
import { listItems } from '../src/item/item.service.js';
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

const checks: string[] = [];

const check = (name: string, ok: boolean, detail?: unknown) => {
  if (!ok) {
    const extra = detail === undefined ? '' : ` (${JSON.stringify(detail)})`;
    throw new Error(`Check failed: ${name}${extra}`);
  }
  checks.push(name);
};

const realTransaction = db.transaction.bind(db);
const realOrm = db.orm;
let joined: Tx | null = null;

db.transaction = (async (fn, options) => {
  if (joined) return fn(joined);
  return realTransaction(async (tx) => {
    joined = tx;
    db.orm = tx.orm;
    try {
      return await fn(tx);
    } finally {
      joined = null;
      db.orm = realOrm;
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
const beforeItems = await listItems();

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

    const listed = await listItems();
    const listedA = listed.find((item) => item.sku === skuA);
    const listedB = listed.find((item) => item.sku === skuB);
    check(
      'listItems returns the new items parsed',
      listedA?.allocated_cost === 12.5 &&
      listedA.condition === 'used_good' &&
      listedA.acquisition_id === acquisition.id &&
      listedB?.status === 'listed' &&
      listedB.allocated_cost === 0
    );
    if (!listedA || !listedB) throw new Error('probe items missing');

    const byId = await listItems({ id: listedA.id });
    check('listItems filters by id', byId.length === 1 && byId[0]?.sku === skuA, byId.map((item) => item.id));

    const byAcquisition = await listItems({ acquisition_id: acquisition.id });
    check(
      'listItems filters by acquisition_id',
      byAcquisition.length === 2 &&
        byAcquisition.every((item) => item.acquisition_id === acquisition.id) &&
        byAcquisition.some((item) => item.sku === skuA) &&
        byAcquisition.some((item) => item.sku === skuB),
      byAcquisition.map((item) => item.sku)
    );

    const byName = await listItems({ name: 'Widget' });
    check(
      'listItems filters by name',
      byName.some((item) => item.sku === skuA) &&
        !byName.some((item) => item.sku === skuB) &&
        byName.every((item) => item.name === 'Widget'),
      byName.map((item) => item.sku)
    );

    const bySku = await listItems({ sku: skuFragment });
    check(
      'listItems filters by sku',
      bySku.some((item) => item.sku === skuA) &&
        !bySku.some((item) => item.sku === skuB) &&
        bySku.every((item) => item.sku.includes(skuFragment)),
      bySku.map((item) => item.sku)
    );

    const byCondition = await listItems({ condition: 'used_good' });
    check(
      'listItems filters by condition',
      byCondition.some((item) => item.sku === skuA) &&
        !byCondition.some((item) => item.sku === skuB) &&
        byCondition.every((item) => item.condition === 'used_good'),
      byCondition.map((item) => item.sku)
    );

    const byCost = await listItems({ allocated_cost: 12.5 });
    check(
      'listItems filters by allocated_cost',
      byCost.some((item) => item.sku === skuA) &&
        !byCost.some((item) => item.sku === skuB) &&
        byCost.every((item) => item.allocated_cost >= 12.5),
      byCost.map((item) => item.allocated_cost)
    );

    const byStatus = await listItems({ status: 'purchased' });
    check(
      'listItems filters by status',
      byStatus.some((item) => item.sku === skuA) &&
        !byStatus.some((item) => item.sku === skuB) &&
        byStatus.every((item) => item.status === 'purchased'),
      byStatus.map((item) => item.sku)
    );

    const byCreated = await listItems({ created_at: listedA.created_at });
    check(
      'listItems filters by created_at',
      byCreated.some((item) => item.sku === skuA) &&
        byCreated.some((item) => item.sku === skuB) &&
        byCreated.every((item) => sameUtcDay(item.created_at, listedA.created_at)),
      byCreated.map((item) => item.created_at)
    );

    const byUpdated = await listItems({ updated_at: listedA.updated_at });
    check(
      'listItems filters by updated_at',
      byUpdated.some((item) => item.sku === skuA) &&
        byUpdated.some((item) => item.sku === skuB) &&
        byUpdated.every((item) => sameUtcDay(item.updated_at, listedA.updated_at)),
      byUpdated.map((item) => item.updated_at)
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
const afterItems = await listItems();
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

console.log(checks.map((name) => `ok  ${name}`).join('\n'));
await db.close();
