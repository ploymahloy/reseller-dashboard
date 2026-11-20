#!/usr/bin/env -S node
import type {
  Contract as End,
  Contract as Start,
} from '../../snapshots/7fa4f83dd52e128dd593479c586a81b6d5c3d417457a186590b65f0665220424/contract';
import endContract from '../../snapshots/7fa4f83dd52e128dd593479c586a81b6d5c3d417457a186590b65f0665220424/contract.json' with { type: 'json' };
import startContract from '../../snapshots/7fa4f83dd52e128dd593479c586a81b6d5c3d417457a186590b65f0665220424/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, rawSql } from '@prisma/orm-postgres/migration';
import postgres from '@prisma/orm-postgres/runtime';
import { contractFromJson } from '@prisma/orm-postgres/static';

const { sql: db, contract } = postgres({ contract: contractFromJson<End>(endContract) });

const functionExists = `SELECT EXISTS (
  SELECT 1 FROM pg_proc p
  JOIN pg_namespace n ON n.oid = p.pronamespace
  WHERE n.nspname = 'public' AND p.proname = 'set_updated_at'
)`;

function triggerExists(table: string, trigger: string): string {
  return `SELECT EXISTS (
    SELECT 1 FROM pg_trigger t
    JOIN pg_class c ON c.oid = t.tgrelid
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public'
      AND c.relname = '${table}'
      AND t.tgname = '${trigger}'
      AND NOT t.tgisinternal
  )`;
}

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      rawSql({
        id: 'function.set_updated_at',
        label: 'Create function set_updated_at()',
        operationClass: 'additive',
        target: { id: 'postgres' },
        precheck: [],
        execute: [
          {
            description: 'create function set_updated_at',
            sql: `CREATE FUNCTION set_updated_at()
                  RETURNS TRIGGER AS $$
                  BEGIN
                    NEW.updated_at = NOW();
                    RETURN NEW;
                  END;
                  $$ LANGUAGE plpgsql`,
          },
        ],
        postcheck: [
          {
            description: 'function set_updated_at exists',
            sql: functionExists,
            expectation: { expects: 'present', object: 'function set_updated_at()' },
          },
        ],
      }),
      rawSql({
        id: 'trigger.supplier_set_updated_at',
        label: 'Create trigger supplier_set_updated_at',
        operationClass: 'additive',
        target: { id: 'postgres' },
        precheck: [],
        execute: [
          {
            description: 'create trigger supplier_set_updated_at',
            sql: `CREATE TRIGGER supplier_set_updated_at
                  BEFORE UPDATE ON supplier
                  FOR EACH ROW EXECUTE FUNCTION set_updated_at()`,
          },
        ],
        postcheck: [
          {
            description: 'trigger supplier_set_updated_at exists',
            sql: triggerExists('supplier', 'supplier_set_updated_at'),
            expectation: { expects: 'present', object: 'trigger supplier_set_updated_at on supplier' },
          },
        ],
      }),
      rawSql({
        id: 'trigger.acquisition_set_updated_at',
        label: 'Create trigger acquisition_set_updated_at',
        operationClass: 'additive',
        target: { id: 'postgres' },
        precheck: [],
        execute: [
          {
            description: 'create trigger acquisition_set_updated_at',
            sql: `CREATE TRIGGER acquisition_set_updated_at
                  BEFORE UPDATE ON acquisition
                  FOR EACH ROW EXECUTE FUNCTION set_updated_at()`,
          },
        ],
        postcheck: [
          {
            description: 'trigger acquisition_set_updated_at exists',
            sql: triggerExists('acquisition', 'acquisition_set_updated_at'),
            expectation: {
              expects: 'present',
              object: 'trigger acquisition_set_updated_at on acquisition',
            },
          },
        ],
      }),
      rawSql({
        id: 'trigger.item_set_updated_at',
        label: 'Create trigger item_set_updated_at',
        operationClass: 'additive',
        target: { id: 'postgres' },
        precheck: [],
        execute: [
          {
            description: 'create trigger item_set_updated_at',
            sql: `CREATE TRIGGER item_set_updated_at
                  BEFORE UPDATE ON item
                  FOR EACH ROW EXECUTE FUNCTION set_updated_at()`,
          },
        ],
        postcheck: [
          {
            description: 'trigger item_set_updated_at exists',
            sql: triggerExists('item', 'item_set_updated_at'),
            expectation: { expects: 'present', object: 'trigger item_set_updated_at on item' },
          },
        ],
      }),
      this.dataTransform(contract, 'set_updated_at_triggers', {
        invariantId: 'set_updated_at_triggers',
        check: () =>
          db.public.supplier.select('name').where((f, fns) => fns.eq(f.name, '')),
        run: () => db.public.supplier.delete().where((f, fns) => fns.eq(f.name, '')),
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
