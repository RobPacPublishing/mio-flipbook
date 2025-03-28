// Script per convertire PDF in immagini usando PDF.js
// Salva questo file come convert-pdf.js

const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');
const pdfjsLib = require('pdfjs-dist');

// Percorso del PDF e cartella di output
const PDF_PATH = path.join(__dirname, 'pdfs', 'libro.pdf');
const OUTPUT_DIR = path.join(__dirname, 'images');

// Assicurati che la cartella di output esista
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function convertPDFToImages() {
  try {
    // Carica il documento PDF
    const doc = await pdfjsLib.getDocument(PDF_PATH).promise;
    console.log(`PDF caricato con successo. Totale pagine: ${doc.numPages}`);

    // Per ogni pagina
    for (let i = 1; i <= doc.numPages; i++) {
      console.log(`Elaborazione pagina ${i}/${doc.numPages}...`);
      
      // Ottieni la pagina
      const page = await doc.getPage(i);
      
      // Imposta scala e dimensioni
      const scale = 1.5;
      const viewport = page.getViewport({ scale });
      
      // Crea canvas per il rendering
      const canvas = createCanvas(viewport.width, viewport.height);
      const context = canvas.getContext('2d');
      
      // Prepara il canvas per il rendering
      const renderContext = {
        canvasContext: context,
        viewport: viewport
      };
      
      // Renderizza la pagina sul canvas
      await page.render(renderContext).promise;
      
      // Salva l'immagine
      const imageData = canvas.toBuffer('image/jpeg', { quality: 0.9 });
      const outputPath = path.join(OUTPUT_DIR, `page-${i}.jpg`);
      fs.writeFileSync(outputPath, imageData);
      
      console.log(`Pagina ${i} salvata come ${outputPath}`);
    }
    
    console.log('Conversione completata con successo!');
    
  } catch (error) {
    console.error('Errore durante la conversione:', error);
  }
}

// Esegui la conversione
convertPDFToImages();