// @ts-check

/**
 * Central runtime bindings.
 *
 * PORTABILITY: all platform glue lives behind this file + the adapters in
 * ./adapters. Porting to a non-Cloudflare host means reimplementing the
 * adapters — nothing else in the app reaches for platform modules directly.
 */
import { env } from 'cloudflare:workers';

/**
 * @param {App.Locals} [_locals]
 */
export function getRuntime(_locals) {
  return /** @type {NonNullable<App.Locals["runtime"]>} */ (env);
}
