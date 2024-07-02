export const doExtractPdf = async (file: File): Promise<any> => {
    const url = new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/api/chatpdf-text`);
    const formData = new FormData();
    formData.append('file', file, file.name);

    try {
        const response = await fetch(url.toString(), {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            alert('Failed to upload PDF file. Please try again.');
        }
        return await response.json();
    } catch (error) {
        alert('Failed to upload PDF file. Please try again.');
    }
};
