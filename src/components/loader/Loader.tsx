import "./loader.css";

export const Loader = () => {
  return (
    <div className="w-full h-full flex justify-center items-center fixed left-0 right-0 top-0 bottom-0 z-[60] bg-[rgba(0,0,0,0.6)]">
      <span className="spinner-border animate-spin inline-block w-16 h-16 border-4 border-solid rounded-full border-t-transparent border-primary"></span>
    </div>
  );
};
