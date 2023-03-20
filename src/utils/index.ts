export const sleep = async (second: number) =>
  await new Promise((resolve) => setTimeout(resolve, 1000 * second));

export function getObjectURL(file: Blob | MediaSource): string {
  let url = null;
  if (undefined !== (window as any).createObjcectURL) {
    url = (window as any).createOjcectURL(file);
  } else if (undefined !== window.URL) {
    url = window.URL.createObjectURL(file);
  } else if (undefined !== window.webkitURL) {
    url = window.webkitURL.createObjectURL(file);
  }
  return url;
}

export * from './ls';
