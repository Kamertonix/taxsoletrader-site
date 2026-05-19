type SectionTitleProps = {
  eyebrow?: string;
  title: string;
  text?: string;
  align?: "left" | "center";
};

export default function SectionTitle({ eyebrow, title, text, align = "center" }: SectionTitleProps) {
  return (
    <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      {eyebrow && (
        <div className="mb-4 text-xs font-black uppercase tracking-[0.32em] text-blue-300">
          {eyebrow}
        </div>
      )}
      <h2 className="text-4xl font-black tracking-[-1.5px] text-white md:text-6xl">{title}</h2>
      {text && <p className="mt-5 text-lg leading-8 text-slate-300">{text}</p>}
    </div>
  );
}
