import mammoth from 'mammoth';

export async function parseFile(file: File): Promise<string> {
  const fileType = file.type;
  const arrayBuffer = await file.arrayBuffer();

  if (fileType === 'application/pdf') {
    // Parse PDF using pdfjs-dist (client-side only)
    const pdfjsLib = await import('pdfjs-dist');

    // Set up the worker - using local file from public directory
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;

    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str ?? "")
        .join(" ");
      fullText += pageText + '\n';
    }

    return fullText.trim();
  } else if (
    fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    fileType === 'application/msword'
  ) {
    // Parse Word document
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  } else {
    throw new Error('Unsupported file type. Please upload a PDF or Word document.');
  }
}
