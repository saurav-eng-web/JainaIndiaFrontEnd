import { useTheme } from "@/theme/ThemeContext";

export default function Subheading({
  title,
  marginTop = 14,
  marginBottom = 8,
  variant = "default",
}) {
  const { colors } = useTheme();
  return (
    <div className={`mb-${marginBottom} mt-${marginTop}`}>
      {variant === "default" ? (
        <h3
          className="pb-1 text-lg font-semibold"
          style={{
            color: colors.primary,
            borderBottom: "2px solid",
            borderImage: `linear-gradient(to right, ${colors.primary}, transparent) 1`,
          }}
        >
          {title}
        </h3>
      ) : (
        <h3
          className="inline-block pb-1 text-lg font-semibold"
          style={{
            color: colors.primary,
            borderBottom: `2px solid ${colors.primary}`,
          }}
        >
          {title}
        </h3>
      )}
    </div>
  );
}

// variant = "short"
{
  /* <div className={`mb-${marginBottom} mt-${marginTop}`}>
  <h3
    className="inline-block pb-1 text-[17px] font-medium"
    style={{
      color: colors.primary,
      borderBottom: `2px solid ${colors.primary}`,
    }}
  >
    Resolution Action
  </h3>
</div>; */
}
