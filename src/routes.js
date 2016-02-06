export default app => {
    app.get('/', (req, res) => {
        const HTML = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <title>Targetprocess view utils</title>
            </head>
            <body>
              <div id="rootElement">Hello there</div>
            </body>
          </html>
        `;
        
        res.end(HTML);
    });
}