// utils/download.ts
export async function downloadFile(fileId: string, filename: string) {
  // Get the Cloudinary URL from your API
  const res = await fetch(`/api/files/${fileId}`);
  
  // The redirect response gives us the final Cloudinary URL
  const downloadUrl = res.url; // fetch follows redirects, .url is the final URL
  
  // Create a hidden anchor and click it — no new tab, direct save dialog
  const a = document.createElement("a");
  a.href = downloadUrl;
  a.download = filename; // suggests filename for the save dialog
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}