export function loggingMiddleware(req,res,next)  {
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2,9)}`

    req.requestId = requestId;

    const start = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - start;

        console.log(
            JSON.stringify({
                timestamp: new Date().toISOString(),
                requestId,
                method: req.method,
                path: req.path,
                status: res.statusCode,
                durationMs: duration,
            })
        );
    })
    next();
}