#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/767070f8b7ca45c649099c685900f6cac56b4ca2ddc357753f4420d2caabf71d/contract';
import startContract from '../../snapshots/767070f8b7ca45c649099c685900f6cac56b4ca2ddc357753f4420d2caabf71d/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/7fa4f83dd52e128dd593479c586a81b6d5c3d417457a186590b65f0665220424/contract';
import endContract from '../../snapshots/7fa4f83dd52e128dd593479c586a81b6d5c3d417457a186590b65f0665220424/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, sql } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.dropIndex({ schema: 'public', table: 'item', index: 'item_sku_lower_idx_109410d2' }),
      this.createIndex({
        schema: 'public',
        table: 'item',
        index: 'item_sku_lower_idx_950f3d87',
        expression: sql`LOWER(sku)`,
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
