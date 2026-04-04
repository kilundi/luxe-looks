const SkipToContent = () => {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-white px-6 py-3 rounded-lg z-50 font-semibold shadow-lg"
    >
      Skip to main content
    </a>
  );
};

export default SkipToContent;
