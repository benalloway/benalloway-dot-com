// @ts-check

/**
 * Health endpoint — M0 acceptance check.
 * Verifies the Worker boots and static/content layer responds.
 */
import { getRuntime } from '../../lib/runtime';

export const GET = async () => {
  try {
    const runtime = getRuntime(undefined);
    return Response.json({
      ok: true,
      service: 'benalloway-dot-com',
      db: runtime.DB ? 'bound' : 'static-mvp',
    });
  } catch (err) {
    return Response.json(
      { ok: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
};
