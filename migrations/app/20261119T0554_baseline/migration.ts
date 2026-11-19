#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/767070f8b7ca45c649099c685900f6cac56b4ca2ddc357753f4420d2caabf71d/contract';
import endContract from '../../snapshots/767070f8b7ca45c649099c685900f6cac56b4ca2ddc357753f4420d2caabf71d/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  checkExpression,
  col,
  fn,
  lit,
  primaryKey,
  sql,
} from '@prisma/orm-postgres/migration';

export default class M extends Migration<never, End> {
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createSchema({ schema: 'public' }),
      this.createNativeEnumType({
        schema: 'public',
        typeName: 'item_condition',
        members: ['new', 'like_new', 'refurbished', 'used_good', 'used_fair', 'salvage'],
      }),
      this.createNativeEnumType({
        schema: 'public',
        typeName: 'item_status',
        members: [
          'purchased',
          'inspecting',
          'prep_required',
          'ready_to_list',
          'listed',
          'sold',
          'shipped',
          'completed',
          'returned',
          'unlisted',
          'scrapped',
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'acquisition',
        columns: [
          col('created_at', 'timestamptz(6)', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamptz-date@1', typeParams: { precision: 6 } },
          }),
          col('freight_cost', 'numeric(12,2)', {
            notNull: true,
            default: lit('0.00'),
            codecRef: { codecId: 'pg/numeric@1', typeParams: { precision: 12, scale: 2 } },
          }),
          col('id', 'BIGSERIAL', { notNull: true, codecRef: { codecId: 'pg/int8number@1' } }),
          col('manifest', 'jsonb', { codecRef: { codecId: 'pg/jsonb@1' } }),
          col('notes', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('purchase_date', 'date', {
            notNull: true,
            codecRef: { codecId: 'pg/date-string@1' },
          }),
          col('purchase_price', 'numeric(12,2)', {
            notNull: true,
            codecRef: { codecId: 'pg/numeric@1', typeParams: { precision: 12, scale: 2 } },
          }),
          col('supplier_name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updated_at', 'timestamptz(6)', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamptz-date@1', typeParams: { precision: 6 } },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression('acquisition_freight_cost_nonnegative_09be502f', sql`freight_cost >= 0`),
          checkExpression(
            'acquisition_purchase_price_nonnegative_db45adb0',
            sql`purchase_price >= 0`,
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'item',
        columns: [
          col('acquisition_id', 'int8', {
            notNull: true,
            codecRef: { codecId: 'pg/int8number@1' },
          }),
          col('allocated_cost', 'numeric(12,2)', {
            notNull: true,
            codecRef: { codecId: 'pg/numeric@1', typeParams: { precision: 12, scale: 2 } },
          }),
          col('condition', '"item_condition"', {
            notNull: true,
            codecRef: { codecId: 'pg/enum@1', typeParams: { typeName: 'item_condition' } },
          }),
          col('created_at', 'timestamptz(6)', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamptz-date@1', typeParams: { precision: 6 } },
          }),
          col('id', 'BIGSERIAL', { notNull: true, codecRef: { codecId: 'pg/int8number@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('sku', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('status', '"item_status"', {
            notNull: true,
            default: lit('purchased'),
            codecRef: { codecId: 'pg/enum@1', typeParams: { typeName: 'item_status' } },
          }),
          col('updated_at', 'timestamptz(6)', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamptz-date@1', typeParams: { precision: 6 } },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression('item_allocated_cost_nonnegative_85643bdd', sql`allocated_cost >= 0`),
          checkExpression('item_name_not_blank_b3fec168', sql`TRIM(name) <> ''`),
          checkExpression('item_sku_not_blank_6054bf7e', sql`TRIM(sku) <> ''`),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'supplier',
        columns: [
          col('created_at', 'timestamptz(6)', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamptz-date@1', typeParams: { precision: 6 } },
          }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updated_at', 'timestamptz(6)', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamptz-date@1', typeParams: { precision: 6 } },
          }),
        ],
        constraints: [
          primaryKey(['name']),
          checkExpression('supplier_name_not_blank_b3fec168', sql`TRIM(name) <> ''`),
        ],
      }),
      this.createIndex({
        schema: 'public',
        table: 'acquisition',
        index: 'acquisition_supplier_name_idx',
        columns: ['supplier_name'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'item',
        index: 'item_acquisition_id_idx_7bf4b5dc',
        columns: ['acquisition_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'item',
        index: 'item_acquisition_id_status_idx',
        columns: ['acquisition_id', 'status'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'item',
        index: 'item_sku_lower_idx_109410d2',
        expression: sql`LOWER(sku)`,
        extras: { unique: true },
      }),
      this.createIndex({
        schema: 'public',
        table: 'item',
        index: 'item_status_idx',
        columns: ['status'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'supplier',
        index: 'supplier_name_lower_idx_5e83f06d',
        expression: sql`LOWER(name)`,
        extras: { unique: true },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'acquisition',
        foreignKey: {
          name: 'acquisition_supplier_name_fkey',
          columns: ['supplier_name'],
          references: { schema: 'public', table: 'supplier', columns: ['name'] },
          onDelete: 'restrict',
          onUpdate: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'item',
        foreignKey: {
          name: 'item_acquisition_id_fkey',
          columns: ['acquisition_id'],
          references: { schema: 'public', table: 'acquisition', columns: ['id'] },
          onDelete: 'restrict',
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
