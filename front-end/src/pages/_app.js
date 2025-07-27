import "@/styles/globals.css"; // adjust path if needed

export default function MyApp({ Component, pageProps }) {
  // Component is the page being rendered /dashboard /index etc... and pageProps is the props passed on each page

  const getLayout = Component.getLayout || ((page) => page); // getLayout is a function that will be responsible to render the requested page with a layout if the file has it or then render the page by itself
  return getLayout(<Component {...pageProps} />);
}
