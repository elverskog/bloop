export async function setTitle(title) {
  if(isBrowser) {
    document.title = title;
  } else {
    global.title = title;
  }
}