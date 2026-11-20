import { z } from 'zod';

// Rejects null, undefined, and empty strings before coercion
export const SafeCoercedDateSchema = z.preprocess((val) => (val === '' || val === null ? undefined : val), z.coerce.date());

export const JsonPrimitiveSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);
