"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripe = void 0;
var node_html_parser_1 = require("node-html-parser");
var baseUrl = "https://stripe.com";
var jobsUrl = "".concat(baseUrl, "/jobs/search?query=software+engineer");
function stripe() {
    return __awaiter(this, void 0, void 0, function () {
        var jobs, text, node, section, tbody, _i, _a, tr, link, locationSpan, href, location_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.log("running");
                    return [4 /*yield*/, fetch(jobsUrl)];
                case 1:
                    jobs = _b.sent();
                    return [4 /*yield*/, jobs.text()];
                case 2:
                    text = _b.sent();
                    node = (0, node_html_parser_1.parse)(text);
                    section = node.querySelector("section.JobsListingsSection");
                    if (!section) {
                        throw new Error("Could not find jobs section");
                    }
                    tbody = section.querySelector("tbody");
                    if (!tbody) {
                        throw new Error("Could not find jobs table");
                    }
                    console.log("found tbody");
                    console.dir(tbody);
                    for (_i = 0, _a = tbody.querySelectorAll("tr"); _i < _a.length; _i++) {
                        tr = _a[_i];
                        link = tr.querySelector("a.JobsListings__Link");
                        locationSpan = tr.querySelector("span.JobsListings__locationDisplayName");
                        if (!link || !locationSpan) {
                            throw new Error("Could not find job link or location");
                        }
                        href = link.getAttribute("href");
                        location_1 = locationSpan.text;
                        console.log({
                            href: href,
                            location: location_1,
                        });
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.stripe = stripe;
stripe();
