#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/7fa4f83dd52e128dd593479c586a81b6d5c3d417457a186590b65f0665220424/contract';
import startContract from '../../snapshots/7fa4f83dd52e128dd593479c586a81b6d5c3d417457a186590b65f0665220424/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/b6bfebca8a89dc11a0692001f39b182ef103850e2ddae51f5d2ca4f75aeb594f/contract';
import endContract from '../../snapshots/b6bfebca8a89dc11a0692001f39b182ef103850e2ddae51f5d2ca4f75aeb594f/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.addColumn({
        schema: 'public',
        table: 'item',
        column: col('list_price', 'numeric(12,2)', {
          codecRef: { codecId: 'pg/numeric@1', typeParams: { precision: 12, scale: 2 } },
        }),
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
