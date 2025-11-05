import { readFileSync } from "node:fs";

const index_html = readFileSync("./static/index.html");
const favicon_ico = readFileSync("./static/img/favicon.ico");

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
        path: "/favicon.ico",
        allowed_methods: ["GET"],
        handler: (req, res) => {
            res.writeHead(200, { "Content-Type": "image/vnd.microsoft.icon" });
            res.end(favicon_ico);
        }
    }
];

export function handlePath(path, req, res) {

    const config = pathConfigs.find(cnfg => cnfg.path === path); //moim zdaniem czytelniej niż pętla

    if (!config) {
        return; // 404 obsłużone w index.js
    }

    if (config.allowed_methods.includes(req.method)) {
        config.handler(req, res);
    } else {
        res.writeHead(405, { "Content-Type": "text/plain" });
        res.end("Method not allowed\n");
    }
}