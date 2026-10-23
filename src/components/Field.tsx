type FieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export function Field({ label, id, className = '', ...props }: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-navy-900">
        {label}
      </label>
      <input
        id={id}
        className={`w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition focus:border-navy-500 focus:outline-none focus:ring-2 focus:ring-navy-500/20 ${className}`}
        {...props}
      />
    </div>
  );
}

type SelectFieldProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
};

export function SelectField({ label, id, className = '', children, ...props }: SelectFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-navy-900">
        {label}
      </label>
      <select
        id={id}
        className={`w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 transition focus:border-navy-500 focus:outline-none focus:ring-2 focus:ring-navy-500/20 ${className}`}
        {...props}
      >
        {children}
      </select>
    </div>
  );
}
