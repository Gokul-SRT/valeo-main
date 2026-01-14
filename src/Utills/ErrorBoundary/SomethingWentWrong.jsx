import React from "react";

const SomethingWentWrong = ({ error }) => {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "#f8fafc",
        color: "#0f172a",
        textAlign: "center",
        padding: 24,
      }}
    >
      <h1>⚠️ Something went wrong</h1>
      <p>Please refresh the page or try again later.</p>

      {process.env.NODE_ENV === "development" && error && (
        <pre
          style={{
            marginTop: 16,
            color: "#b91c1c",
            maxWidth: 800,
            overflow: "auto",
          }}
        >
          {error.toString()}
        </pre>
      )}
    </div>
  );
};

export default SomethingWentWrong;
