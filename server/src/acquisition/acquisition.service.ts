import type { CreateItemRequest } from '@/item/item.schema.js';
import { db, type Tx } from '@/prisma/db.js';

import { getSupplierName } from '@/supplier/supplier.service.js';
import type { CreateAcquisitionRequest } from './acquisition.schema.js';
import { asMoney } from '@/shared/utils.js';

const money = (value: number) => value.toFixed(2);
const purchaseDate = (value: Date) => value.toISOString().slice(0, 10);

const manifestJson = (rows: CreateAcquisitionRequest['manifest']) => {
  if (rows == null) return null;
  return rows.map((row) =>
    Object.fromEntries(
      Object.entries(row).filter((entry): entry is [string, string | number | boolean | null] => entry[1] !== undefined)
    )
  );
};

const insertAcquisition = async (tx: Tx, body: CreateAcquisitionRequest, supplierName: string) => {
  const row = await tx.orm.public.Acquisition.create({
    supplier_name: supplierName,
    purchase_date: purchaseDate(body.purchase_date),
    purchase_price: money(body.purchase_price),
    freight_cost: money(body.freight_cost ?? 0),
    manifest: manifestJson(body.manifest),
    notes: body.notes ?? null
  });

  return {
    ...row,
    purchase_price: asMoney(row.purchase_price),
    freight_cost: asMoney(row.freight_cost)
  };
};

const insertItem = async (tx: Tx, acquisitionId: number, item: CreateItemRequest) => {
  const row = await tx.orm.public.Item.create({
    acquisition_id: acquisitionId,
    name: item.name,
    sku: item.sku,
    condition: item.condition,
    allocated_cost: money(item.allocated_cost),
    status: item.status
  });

  return {
    ...row,
    allocated_cost: asMoney(row.allocated_cost)
  };
};

export const createAcquisition = async (body: CreateAcquisitionRequest) => {
  return db.transaction(async (tx) => {
    const supplierName = await getSupplierName(tx, body.supplier_name);
    const acquisition = await insertAcquisition(tx, body, supplierName);
    const items = [];
    for (const item of body.items) {
      items.push(await insertItem(tx, acquisition.id, item));
    }
    return { acquisition, items };
  });
};
