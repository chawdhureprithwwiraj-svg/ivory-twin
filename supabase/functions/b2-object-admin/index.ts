// Pass 104 · authenticated Admin access to an exact private B2 object.
// Deployed beside b2-media; the Cloudflare proxy forwards only object_get and
// object_delete for this purpose. Existing post/member signing stays in b2-media.
// verify_jwt is false at the platform layer so this function can return clear
// errors; every request is nevertheless validated below with Auth and Admin RPC.

type B2Auth = {
  apiUrl: string;
  downloadUrl: string;
  authorizationToken: string;
  bucketId: string;
};

class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

// Match the existing b2-media function: the bucket is fixed, and only the
// established B2 key secrets are required. Do not invent a new deployment secret.
const B2_BUCKET = "ivory-post-media-b2-2026";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization,apikey,content-type,x-client-info",
  "Access-Control-Allow-Methods": "POST,OPTIONS",
  "Cache-Control": "no-store",
};

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS, "Content-Type": "application/json" },
  });
}

function env(name: string): string {
  const value = Deno.env.get(name)?.trim() || "";
  if (!value) throw new HttpError(500, `The server is missing ${name}.`);
  return value;
}

function exactKey(value: unknown): string {
  const key = typeof value === "string" ? value.trim() : "";
  if (!key || key.length > 1024 || key.startsWith("/") || key.includes("\\") ||
      key.includes("\u0000") || key.split("/").some((part) => part === "..")) {
    throw new HttpError(400, "A valid, exact B2 object key is required.");
  }
  return key;
}

function encodedKey(key: string): string {
  return key.split("/").map(encodeURIComponent).join("/");
}

async function requireAdmin(req: Request): Promise<void> {
  const authorization = req.headers.get("Authorization") || "";
  const apikey = req.headers.get("apikey") || "";
  if (!authorization.startsWith("Bearer ") || !apikey) {
    throw new HttpError(401, "Sign in as the house first.");
  }
  const base = env("SUPABASE_URL").replace(/\/$/, "");
  const headers = { Authorization: authorization, apikey };

  const authResponse = await fetch(`${base}/auth/v1/user`, { headers });
  if (!authResponse.ok) throw new HttpError(401, "The house session is not valid.");
  const user = await authResponse.json();
  if (!user?.id) throw new HttpError(401, "The house session is not valid.");

  const profileResponse = await fetch(
    `${base}/rest/v1/profiles?select=role&id=eq.${encodeURIComponent(user.id)}&limit=1`,
    { headers },
  );
  if (!profileResponse.ok) throw new HttpError(403, "The house profile could not be checked.");
  const profiles = await profileResponse.json();
  if (!Array.isArray(profiles) || profiles[0]?.role !== "admin") {
    throw new HttpError(403, "Admin only.");
  }
}

async function requireInventoryReference(req: Request, key: string): Promise<void> {
  const authorization = req.headers.get("Authorization") || "";
  const apikey = req.headers.get("apikey") || "";
  const base = env("SUPABASE_URL").replace(/\/$/, "");
  const response = await fetch(`${base}/rest/v1/rpc/media_vault_b2`, {
    method: "POST",
    headers: { Authorization: authorization, apikey, "Content-Type": "application/json" },
    body: "{}",
  });
  if (!response.ok) throw new HttpError(403, "The B2 inventory refused this house session.");
  const ledger = await response.json();
  if (!ledger || ledger.ok !== true || !Array.isArray(ledger.rows)) {
    throw new HttpError(403, "The B2 inventory refused this house session.");
  }
  if (!ledger.rows.some((row: { ref?: unknown }) => row?.ref === key)) {
    throw new HttpError(404, "That exact key is not in the Admin B2 inventory.");
  }
}

async function authorizeB2(): Promise<B2Auth> {
  const keyId = env("B2_KEY_ID");
  const applicationKey = env("B2_APPLICATION_KEY");
  const response = await fetch("https://api.backblazeb2.com/b2api/v2/b2_authorize_account", {
    headers: { Authorization: `Basic ${btoa(`${keyId}:${applicationKey}`)}` },
  });
  if (!response.ok) throw new HttpError(502, "B2 would not authorize the house.");
  const data = await response.json();
  let bucketId = data?.allowed?.bucketId || Deno.env.get("B2_BUCKET_ID") || "";
  const downloadUrl = data?.downloadUrl;
  const apiUrl = data?.apiUrl;
  if (!data?.authorizationToken || !downloadUrl || !apiUrl) {
    throw new HttpError(502, "B2 returned an incomplete authorization.");
  }
  const auth = { apiUrl, downloadUrl, authorizationToken: data.authorizationToken, bucketId };
  if (!bucketId) {
    const buckets = await b2Call(auth, "b2_list_buckets", {
      accountId: data.accountId,
      bucketName: B2_BUCKET,
    });
    bucketId = (buckets?.buckets || []).find((bucket: { bucketName?: string }) =>
      bucket?.bucketName === B2_BUCKET)?.bucketId || "";
    auth.bucketId = bucketId;
  }
  if (!bucketId) throw new HttpError(502, "B2 could not identify the house bucket.");
  return auth;
}

async function b2Call(auth: B2Auth, operation: string, body: Record<string, unknown>): Promise<any> {
  const response = await fetch(`${auth.apiUrl}/b2api/v2/${operation}`, {
    method: "POST",
    headers: { Authorization: auth.authorizationToken, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    // Do not expose B2's raw response or any credential material to the browser.
    throw new HttpError(502, `B2 refused ${operation} (HTTP ${response.status}).`);
  }
  return await response.json();
}

async function findObject(auth: B2Auth, key: string): Promise<any> {
  const listing = await b2Call(auth, "b2_list_file_names", {
    bucketId: auth.bucketId,
    prefix: key,
    maxFileCount: 10,
  });
  const file = (listing?.files || []).find((item: { fileName?: string }) => item?.fileName === key);
  if (!file?.fileId) throw new HttpError(404, "That exact object is not in the B2 bucket.");
  return file;
}

async function signObject(key: string): Promise<unknown> {
  const auth = await authorizeB2();
  const file = await findObject(auth, key);
  const signed = await b2Call(auth, "b2_get_download_authorization", {
    bucketId: auth.bucketId,
    fileNamePrefix: key,
    validDurationInSeconds: 300,
  });
  if (!signed?.authorizationToken) throw new HttpError(502, "B2 returned no download authorization.");
  const bucketName = B2_BUCKET;
  const url = `${auth.downloadUrl.replace(/\/$/, "")}/file/${encodeURIComponent(bucketName)}/${encodedKey(key)}?Authorization=${encodeURIComponent(signed.authorizationToken)}`;
  return {
    ok: true,
    key,
    url,
    bytes: Number(file.contentLength) || null,
    content_type: file.contentType || null,
    expires_in: 300,
  };
}

async function deleteObject(key: string): Promise<unknown> {
  const auth = await authorizeB2();
  const file = await findObject(auth, key);
  await b2Call(auth, "b2_delete_file_version", { fileId: file.fileId, fileName: key });
  return { ok: true, key, deleted: true };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
  if (req.method !== "POST") return json({ ok: false, error: "POST only." }, 405);
  try {
    await requireAdmin(req);
    const body = await req.json();
    const op = typeof body?.op === "string" ? body.op : "";
    const key = exactKey(body?.key);

    if (op === "object_get") {
      // Read-signing remains scoped to objects named by the Admin ledger. A
      // bank row is sufficient; no post_id is required or manufactured.
      await requireInventoryReference(req, key);
      return json(await signObject(key));
    }
    if (op === "object_delete") {
      // Deletion is an explicit Admin object action. It also supports removal
      // of the old copy after a successful move, when its ledger reference has
      // already been transferred to the new provider/key.
      return json(await deleteObject(key));
    }
    return json({ ok: false, error: "Unsupported Admin B2 object operation." }, 400);
  } catch (error) {
    if (error instanceof HttpError) return json({ ok: false, error: error.message }, error.status);
    console.error("b2-object-admin failed", error instanceof Error ? error.message : "unknown error");
    return json({ ok: false, error: "The Admin B2 object door failed safely." }, 500);
  }
});
