export function DashboardField({
  label,
  name,
  defaultValue,
  placeholder,
  type = "text",
  multiline = false,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
  type?: string;
  multiline?: boolean;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-white/72">{label}</span>
      {multiline ? (
        <textarea
          required
          name={name}
          defaultValue={defaultValue}
          placeholder={placeholder}
          rows={4}
          className="w-full resize-y rounded-2xl border border-white/12 bg-black/20 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/28 focus:border-white/30"
        />
      ) : (
        <input
          required
          type={type}
          name={name}
          defaultValue={defaultValue}
          placeholder={placeholder}
          className="w-full rounded-2xl border border-white/12 bg-black/20 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/28 focus:border-white/30"
        />
      )}
    </label>
  );
}

export function DashboardCheckbox({
  label,
  name,
  defaultChecked = false,
}: {
  label: string;
  name: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/80">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="h-4 w-4 accent-white"
      />
      <span>{label}</span>
    </label>
  );
}
