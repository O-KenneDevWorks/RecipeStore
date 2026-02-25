import * as Select from '@radix-ui/react-select';
import '../Styling/RecipeSelect.css';

interface Option {
  value: string;
  label: string;
}

interface Props {
  value: string;
  onChange: (val: string) => void;
  options: Option[];
  placeholder?: string;
}

export default function RecipeSelect({ value, onChange, options, placeholder = 'Select...' }: Props) {
  return (
    <Select.Root value={value} onValueChange={onChange}>
      <Select.Trigger className="recipe-select__trigger">
        <Select.Value placeholder={placeholder} />
        <Select.Icon className="recipe-select__icon">
          ▼
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content className="recipe-select__content" position="popper" sideOffset={4}>
          <Select.Viewport className="recipe-select__viewport">
            {options.map((opt) => (
              <Select.Item
                key={opt.value}
                value={opt.value}
                className="recipe-select__item"
              >
                <Select.ItemText>{opt.label}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
