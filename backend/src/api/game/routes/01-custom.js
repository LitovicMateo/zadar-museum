"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    routes: [
        {
            method: "GET",
            path: "/games/q",
            handler: "game.findGames", // will handle seasons, competitions, etc.
        },
    ],
};
