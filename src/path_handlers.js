import { readFileSync } from "node:fs";

const index_html = readFileSync("static/index.html");

const pathConfigs = [
    {
        path: "/",
        allowed_methods: ["GET"],
        handler: (req, res) => {
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(index_html);
        },
    },
    {
        path: "/hello",
        allowed_methods: ["GET"],
        handler: (req, res) => {
            res.writeHead(200, { "Content-Type": "text/plain" });
            res.end("hello world!\n");
        },
    },
];

export function handlePath(path, req, res) {
    for (let config of pathConfigs) {
        if (path === config.path) {
            if (config.allowed_methods.includes(req.method)) {
                config.handler(req, res);
            } else {
                res.writeHead(405, { "Content-Type": "text/plain" });
                res.end("Method not allowed\n");
            }
            break;
        }
    }
}