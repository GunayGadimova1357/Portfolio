export function DashboardField({
  label,
  name,
  defaultValue,
  value,
  placeholder,
  type = "text",
  multiline = false,
  required = true,
  rows = 4,
  onChange,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  value?: string;
  placeholder?: string;
  type?: string;
  multiline?: boolean;
  required?: boolean;
  rows?: number;
  onChange?: (value: string) => void;
}) {
  // Базовые props для всех текстовых полей dashboard.
  const sharedProps = {
    required,
    name,
    placeholder,
    className:
      "w-full rounded-2xl border border-white/12 bg-black/20 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/28 focus:border-white/30",
  };
  // Поддерживаем и controlled-поля через react-hook-form, и простые default values.
  const fieldProps = onChange
    ? {
        value: value ?? "",
        onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
          onChange(event.target.value),
      }
    : {
        defaultValue,
      };

  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-white/72">{label}</span>
      {multiline ? (
        <textarea
          {...sharedProps}
          {...fieldProps}
          rows={rows}
          className="w-full resize-y rounded-2xl border border-white/12 bg-black/20 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/28 focus:border-white/30"
        />
      ) : (
        <input
          {...sharedProps}
          type={type}
          {...fieldProps}
        />
      )}
    </label>
  );
}

export function DashboardCheckbox({
  label,
  name,
  defaultChecked = false,
  checked,
  onCheckedChange,
}: {
  label: string;
  name: string;
  defaultChecked?: boolean;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}) {
  // Чекбокс тоже может работать как controlled или uncontrolled input.
  const checkboxProps = onCheckedChange
    ? {
        checked: checked ?? false,
        onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
          onCheckedChange(event.target.checked),
      }
    : {
        defaultChecked,
      };

  return (
    <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/80">
      <input
        type="checkbox"
        name={name}
        {...checkboxProps}
        className="h-4 w-4 accent-white"
      />
      <span>{label}</span>
    </label>
  );
}
