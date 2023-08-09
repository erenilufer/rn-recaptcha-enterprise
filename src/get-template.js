const getTemplate = ({ siteKey, lang, action }) => {
  let template = `
  <!DOCTYPE html>
  <html lang="${lang}">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>ReCaptcha</title>
      <script src="https://www.google.com/recaptcha/enterprise.js?onload=onLoad&render=${siteKey}"></script>
      <script>
        var onLoad = function () {
          setTimeout(function () {
            window.ReactNativeWebView.postMessage(
              JSON.stringify({ status: "loaded", payload: {} })
            );
  
            grecaptcha.enterprise.ready(function () {
              grecaptcha.enterprise
                .execute('${siteKey}', {
                  action: '${action}',
                })
                .then(function (token) {
                  window.ReactNativeWebView.postMessage(
                    JSON.stringify({ status: "verified", payload: { token } })
                  );
                })
                .catch(function (error) {
                  window.ReactNativeWebView.postMessage(
                    JSON.stringify({ status: "failed", payload: { error } })
                  );
                });
            });
          }, 1000);
        };
      </script>
  
      <style>
        html,
        body,
        .container {
          height: 100%;
          width: 100%;
          margin: 0;
          padding: 0;
          background-color: transparent;
        }
  
        .container {
          display: flex;
          background-color: rgba(0, 0, 0, 0);
          justify-content: center;
          align-items: center;
        }
      </style>
    </head>
  
    <body>
      <div class="container">
        <span id="recaptcha-container"></span>
      </div>
    </body>
  </html>
  
`;

  return template;
};

export default getTemplate;
