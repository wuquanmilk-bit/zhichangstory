"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var hono_1 = require("hono");
var app = new hono_1.Hono();
app.get("/api/", function (c) { return c.json({ name: "Cloudflare" }); });
exports.default = app;
