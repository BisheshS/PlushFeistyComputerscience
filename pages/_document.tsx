import { Html, Head, Main, NextScript } from 'next/document'

// Marks the page as JS-enabled before first paint, so scroll reveals only
// hide content when the script that shows it again can run. Failsafe: if the
// app has not started after 4 s, drop the flag so no content stays hidden.
const jsFlag =
  "var d=document.documentElement;d.classList.add('js');" +
  "setTimeout(function(){if(!window.__puchkaReveal)d.classList.remove('js')},4000)"

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="color-scheme" content="light dark" />
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#f7f6f2" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#0c0c0e" />
        <script dangerouslySetInnerHTML={{ __html: jsFlag }} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
