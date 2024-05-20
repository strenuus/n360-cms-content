export default function PreviewSection({ title, children }) {
  return (
    <>
      <h4>{title}:</h4>
      <div
        style={{
          border: "1px dashed #dfdfe3",
          padding: "1.5rem",
          borderRadius: ".75rem",
        }}
      >
        {children}
      </div>
    </>
  );
}
