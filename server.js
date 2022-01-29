import express from "express";
import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router";
import App from "./src/App";
import path from "path";
import fs from "fs";
import { ServerStyleSheet } from "styled-components";

const app = express();

app.use(express.static('./build', { index: false}))

app.get("/*", (req, res) => {
  const sheet = new ServerStyleSheet()
  const reactApp = renderToString(
    // <h1>Hello from the server side!</h1>
    sheet.collectStyles(
      <StaticRouter location={req.url}>
      <App />
    </StaticRouter>
    )
  );

  // return res.send(`
  //   <html>
  //     <body>
  //       <div id="root">${reactApp}</div>
  //     </body>
  //   </html>
  // `);
  const templateFile = path.resolve('./build/index.html')
    fs.readFile(templateFile, 'utf-8', (err, data) => {
      if (err) {
        return res.status(500).send(err)
      }

      return res.send(
        data.replace('<div id="root"></div>',  `<div id="root">${reactApp}</div>`)
            // .replace('{{ styles }}', sheet.getStyleTags())
      )
    })
});

app.listen(8080, () => {
  console.log(`Server running on port 8080 🔥`);
});
