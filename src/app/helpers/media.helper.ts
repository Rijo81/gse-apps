async function UrlToBlob(imageUrl: string): Promise<Blob> {
  const response = await fetch(imageUrl); // Obtener la imagen de la URL
  const blob = await response.blob(); // Convertir la respuesta en un Blob
  return blob; // Retornar el Blob
}

export {
  UrlToBlob
}
