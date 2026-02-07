import { useTheme } from "@/theme/ThemeContext";

export default function Subheading({ title, marginTop = 14, marginBottom = 8 }) {
  const { colors } = useTheme();
  return (
    <div className={`mb-${marginBottom} mt-${marginTop}`}>
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
    </div>
  );
}
