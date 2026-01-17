export default function Logo({
  variant = "horizontal",
  width,
  height,
  title = "Sonko",
  className = "",
}: {
  variant?: "horizontal" | "vertical" | "icon";
  width?: number;
  height?: number;
  title?: string;
  className?: string;
}) {
  const logoSrc = variant === "horizontal"
    ? "/logo-horizontal.png"
    : variant === "vertical"
    ? "/logo-vertical.png"
    : "/logo-icon.png";

  return (
    <img
      src={logoSrc}
      alt={title}
      title={title}
      className={className}
      width={width}
      height={height}
      style={{
        width: width ? `${width}px` : undefined,
        height: height ? `${height}px` : undefined,
        objectFit: "contain",
      }}
    />
  );
}
