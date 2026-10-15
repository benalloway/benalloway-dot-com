/// <reference types="@cloudflare/workers-types" />

type RuntimeBindings = {
  ASSETS: Fetcher;
  DB?: D1Database;
  MEDIA?: R2Bucket;
  RESEND_API_KEY?: string;
};

declare namespace App {
  interface Locals {
    runtime: RuntimeBindings | undefined;
    cfContext: ExecutionContext;
  }
}

declare module 'cloudflare:workers' {
  export const env: RuntimeBindings & Record<string, unknown>;
}
