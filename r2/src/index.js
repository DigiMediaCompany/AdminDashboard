import { Hono } from "hono";
import { nanoid } from "nanoid";
import { cors } from "hono/cors";

// Constants
const CACHE_TTL = 60 * 60 * 24 * 30; // 1 month
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const CACHE_HEADERS = {
    CACHE_CONTROL: 'public, max-age=31536000, immutable',
    CACHE_TAG: 'x-cache-tag',
};

// Initialize Hono app
const app = new Hono();
const cache = caches.default;

// Middleware
function requestLogger() {
    return async (c, next) => {
        const start = Date.now();
        await next();
        const ms = Date.now() - start;
        console.log(`${c.req.method} ${c.req.url} - ${ms}ms`);
    };
}

// Response helper with type safety
function createResponse(data, options = {}) {
    const {
        status = 200,
        headers = {},
        isJson = true,
        cacheControl = 'public, max-age=60',
    } = options;

    const responseHeaders = new Headers({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PATCH, DELETE',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Accept, Origin',
        ...headers
    });

    if (isJson) {
        responseHeaders.set('Content-Type', 'application/json');
        responseHeaders.set('Cache-Control', cacheControl);
    }

    const body = isJson ? JSON.stringify(data) : data;
    
    return new Response(body, {
        status,
        headers: responseHeaders,
    });
}

// Error handling middleware
app.onError((err, c) => {
    console.error('Error:', err);
    return createResponse(
        { error: 'Internal Server Error' },
        { status: 500 }
    );
});

// CORS middleware
app.use('*', cors({
    origin: '*',
    allowMethods: ['GET', 'POST', 'OPTIONS', 'PATCH', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
}));

// Request logging
app.use('*', requestLogger());

// File upload endpoint
app.post('/files', async (c) => {
    try {
        const body = await c.req.parseBody();
        const file = body.file;

        if (!file || !(file instanceof File)) {
            return createResponse(
                { message: 'No file uploaded' },
                { status: 400 }
            );
        }

        
        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
            return createResponse(
                { message: `File too large. Max ${MAX_FILE_SIZE / 1024 / 1024}MB allowed.` },
                { status: 413 }
            );
        }

        // Generate unique filename
        const fileExt = file.name.split('.').pop();
        const uniqueName = `${Date.now()}-${nanoid()}.${fileExt}`;
        const arrayBuffer = await file.arrayBuffer();

        // Upload to R2
        await c.env.BUCKET.put(uniqueName, arrayBuffer, {
            httpMetadata: {
                contentType: file.type,
                cacheControl: CACHE_HEADERS.CACHE_CONTROL,
            },
            customMetadata: {
                originalName: file.name,
                uploadedAt: new Date().toISOString(),
            },
        });

        return createResponse({
            success: true,
            filename: uniqueName,
            originalName: file.name,
            size: file.size,
            mimeType: file.type,
        });

    } catch (error) {
        console.error('Upload error:', error);
        return createResponse(
            { error: 'Failed to process file upload' },
            { status: 500 }
        );
    }
});

// Get file endpoint
app.get('/files/:filename', async (c) => {
    try {
        const filename = c.req.param('filename');
        const cacheKey = new Request(c.req.url);
        const cachedResponse = await cache.match(cacheKey);

        if (cachedResponse) {
            return cachedResponse;
        }

        const object = await c.env.BUCKET.get(filename);
        if (!object) {
            return createResponse(
                { message: 'File not found' },
                { status: 404 }
            );
        }

        const headers = new Headers({
            'Content-Type': object.httpMetadata?.contentType || 'application/octet-stream',
            'ETag': object.httpEtag,
            'Cache-Control': object.httpMetadata?.cacheControl || CACHE_HEADERS.CACHE_CONTROL,
            [CACHE_HEADERS.CACHE_TAG]: object.etag,
        });

        const response = new Response(object.body, { headers });

        // Cache the response
        c.executionCtx.waitUntil(cache.put(cacheKey, response.clone()));

        return response;

    } catch (error) {
        console.error('File retrieval error:', error);
        return createResponse(
            { error: 'Failed to retrieve file' },
            { status: 500 }
        );
    }
});

// Delete file endpoint
app.delete('/files/:filename', async (c) => {
    try {
        const filename = c.req.param('filename');
        const object = await c.env.BUCKET.head(filename);

        if (!object) {
            return createResponse(
                { message: 'File not found' },
                { status: 404 }
            );
        }

        await c.env.BUCKET.delete(filename);
        
        // Invalidate cache
        const cacheUrl = new URL(`/files/${filename}`, c.req.url).toString();
        await cache.delete(new Request(cacheUrl));

        return createResponse({
            success: true,
            message: `File '${filename}' deleted successfully`
        });

    } catch (error) {
        console.error('Delete error:', error);
        return createResponse(
            { error: 'Failed to delete file' },
            { status: 500 }
        );
    }
});

export default app;