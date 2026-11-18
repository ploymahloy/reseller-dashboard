-- Reusable trigger function for updated_at columns
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TYPE item_condition AS ENUM (
  'new',
  'like_new',
  'refurbished',
  'used_good',
  'used_fair',
  'salvage'
);

CREATE TYPE item_status AS ENUM (
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
  'scrapped'
);

CREATE TABLE supplier (
  name TEXT PRIMARY KEY CHECK (TRIM(name) <> ''),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE acquisition (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  supplier_name TEXT NOT NULL REFERENCES supplier(name) ON UPDATE CASCADE ON DELETE RESTRICT,
  purchase_date DATE NOT NULL,
  purchase_price NUMERIC(12, 2) NOT NULL CHECK (purchase_price >= 0),
  freight_cost NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (freight_cost >= 0),
  manifest JSONB,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE item (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  acquisition_id BIGINT NOT NULL REFERENCES acquisition(id) ON DELETE RESTRICT,
  name TEXT NOT NULL CHECK (TRIM(name) <> ''),
  sku TEXT NOT NULL CHECK (TRIM(sku) <> ''),
  condition item_condition NOT NULL,
  allocated_cost NUMERIC(12, 2) NOT NULL CHECK (allocated_cost >= 0),
  status item_status NOT NULL DEFAULT 'purchased',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Case-insensitive uniqueness for SKUs and suppliers
CREATE UNIQUE INDEX supplier_name_lower_idx ON supplier (LOWER(name));
CREATE UNIQUE INDEX item_sku_lower_idx ON item (LOWER(sku));

-- Indexes
CREATE INDEX acquisition_supplier_name_idx ON acquisition (supplier_name);
CREATE INDEX item_acquisition_id_status_idx ON item (acquisition_id, status);
CREATE INDEX item_status_idx ON item (status);

-- Attach updated_at triggers to prevent stale updated_at times
CREATE TRIGGER supplier_set_updated_at
  BEFORE UPDATE ON supplier
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER acquisition_set_updated_at
  BEFORE UPDATE ON acquisition
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER item_set_updated_at
  BEFORE UPDATE ON item
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
