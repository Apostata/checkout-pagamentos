import webpack from 'webpack';
import path from 'path';
import express from 'express';
import configDevClient from "../../config/webpack-dev-client.js";

const server = express();

if(process.env.NODE_ENV !== "production"){
    const compiler = webpack([configDevClient]);

    const webpackDevMiddleware = require('webpack-dev-middleware')(
        compiler,
        configDevClient.devServer,
    );
    
    const webpackHotMiddleware = require('webpack-hot-middleware')(
        compiler.compilers[0],
        configDevClient.devServer,
    );

    server.use(webpackDevMiddleware); //usar as configurações de devserver do webpack config
    server.use(webpackHotMiddleware); //usar live reload USAR SEMPRE DEPOIS DO DEV MIDDLEWARE
}

const PORT = process.env.PORT || 8989;
server.listen(PORT, ()=>{
    console.log(`Servidor funcionando na porta ${PORT} ${process.env.NODE_ENV}`);
});