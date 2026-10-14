interface PrintElementOptions {
  selector: string;
  title?: string;
}

const waitForImages = async (doc: Document) => {
  const images = Array.from(doc.images);
  await Promise.all(
    images.map((image) => {
      if (image.complete) return Promise.resolve();
      return new Promise<void>((resolve) => {
        image.onload = () => resolve();
        image.onerror = () => resolve();
      });
    })
  );
};

const collectDocumentStyles = async () => {
  const nodes = Array.from(document.querySelectorAll<HTMLLinkElement | HTMLStyleElement>("link[rel='stylesheet'], style"));

  const styles = await Promise.all(
    nodes.map(async (node) => {
      if (node.tagName.toLowerCase() !== "link") {
        return `<style>${(node.textContent || "").replace(/<\/style/gi, "<\\/style")}</style>`;
      }

      const link = node as HTMLLinkElement;
      try {
        const response = await fetch(link.href, { credentials: "same-origin" });
        if (!response.ok) throw new Error(`Unable to load stylesheet: ${link.href}`);
        const css = (await response.text()).replace(/<\/style/gi, "<\\/style");
        return `<style>${css}</style>`;
      } catch {
        return `<link rel="stylesheet" href="${link.href}">`;
      }
    })
  );

  return styles.join("\n");
};

const waitForStylesheets = async (doc: Document) => {
  const links = Array.from(doc.querySelectorAll<HTMLLinkElement>("link[rel='stylesheet']"));
  await Promise.all(
    links.map((link) => {
      if (link.sheet) return Promise.resolve();
      return new Promise<void>((resolve) => {
        const timer = window.setTimeout(resolve, 2500);
        link.onload = () => {
          window.clearTimeout(timer);
          resolve();
        };
        link.onerror = () => {
          window.clearTimeout(timer);
          resolve();
        };
      });
    })
  );
};

export const printElementBySelector = async ({ selector, title = "Document" }: PrintElementOptions) => {
  const source = document.querySelector<HTMLElement>(selector);

  if (!source) {
    console.error(`Print source not found: ${selector}`);
    return false;
  }

  const clone = source.cloneNode(true) as HTMLElement;
  clone.querySelectorAll(".no-print, [data-no-print='true']").forEach((element) => element.remove());

  const frame = document.createElement("iframe");
  frame.setAttribute("aria-hidden", "true");
  frame.style.position = "fixed";
  frame.style.left = "-10000px";
  frame.style.top = "0";
  frame.style.width = "210mm";
  frame.style.height = "297mm";
  frame.style.border = "0";
  frame.style.opacity = "0";
  frame.style.pointerEvents = "none";
  document.body.appendChild(frame);

  const printWindow = frame.contentWindow;
  const printDocument = printWindow?.document;

  if (!printWindow || !printDocument) {
    frame.remove();
    return false;
  }

  const styles = await collectDocumentStyles();
  const safeTitle = title.replace(/[<>]/g, "");

  printDocument.open();
  printDocument.write(`<!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>${safeTitle}</title>
        ${styles}
        <style>
          @page { size: A4 portrait; margin: 6mm; }
          * { box-sizing: border-box; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          html, body { margin: 0 !important; padding: 0 !important; background: #ffffff !important; }
          body { width: 100%; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
          .lovable-print-root {
            width: 198mm;
            margin: 0 auto;
            background: #ffffff;
            transform-origin: top left;
          }
          /* Fit-to-one-page: scale down if content overflows A4 portrait usable height (~285mm) */
          .lovable-print-root { zoom: 0.82; }
          @supports (-webkit-hyphens:none) {
            /* Safari fallback using transform */
            .lovable-print-root { zoom: normal; }
          }
          .lovable-print-root .no-print, .lovable-print-root [data-no-print='true'] { display: none !important; visibility: hidden !important; }
          .lovable-print-root, .lovable-print-root * {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          .lovable-print-root img { max-width: 100%; height: auto; }
          @media print {
            body * { visibility: visible !important; }
            .lovable-print-root, .lovable-print-root * { visibility: visible !important; }
          }
        </style>
      </head>
      <body>
        <main class="lovable-print-root">${clone.outerHTML}</main>
      </body>
    </html>`);
  printDocument.close();

  await waitForStylesheets(printDocument);
  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  await waitForImages(printDocument);
  await printDocument.fonts?.ready.catch(() => undefined);

  printWindow.focus();
  printWindow.print();

  const cleanup = () => setTimeout(() => frame.remove(), 500);
  printWindow.addEventListener("afterprint", cleanup, { once: true });
  setTimeout(cleanup, 30000);

  return true;
};