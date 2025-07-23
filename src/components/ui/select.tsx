
import { ChevronUpDownIcon, CheckIcon } from '@heroicons/react/20/solid';
import { Label, Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';

interface SelectOption {
  id: string | number;
  name: string;
  value: string | number;
}

interface SelectProps {
  label: string;
  options: readonly SelectOption[];
  value: SelectOption;
  onChange: (selected: SelectOption) => void;
  minWidth?: string;
}

export function Select({ 
  label, 
  options, 
  value, 
  onChange, 
  minWidth = "140px" 
}: SelectProps) {
  return (
    <div className="flex items-center gap-3">
      <Listbox value={value} onChange={onChange}>
        <Label className="text-sm font-semibold text-gray-800">{label}:</Label>
        <div className="relative">
          <ListboxButton 
            className="grid w-full cursor-default grid-cols-1 rounded-lg bg-white py-2.5 pr-8 pl-4 text-left text-gray-900 outline-1 -outline-offset-1 outline-gray-300 shadow-sm transition-all duration-200 ease-in-out hover:outline-gray-400 hover:shadow-md focus:outline-2 focus:-outline-offset-2 focus:outline-orange-400 sm:text-sm/6"
            style={{ minWidth }}
          >
            <span className="col-start-1 row-start-1 truncate pr-6 font-medium">
              {value.name}
            </span>
            <ChevronUpDownIcon
              aria-hidden="true"
              className="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-500"
            />
          </ListboxButton>

          <ListboxOptions
            transition
            className="fixed z-[999999] mt-1 max-h-60 overflow-auto rounded-lg bg-white py-1 text-base shadow-2xl ring-1 ring-black/10 focus:outline-hidden data-leave:transition data-leave:duration-100 data-leave:ease-in data-closed:data-leave:opacity-0 sm:text-sm"
            style={{ width: minWidth }}
            anchor="bottom start"
          >
            {options.map((option) => (
              <ListboxOption
                key={option.id}
                value={option}
                className="group relative cursor-default py-2.5 pr-9 pl-4 text-gray-900 select-none data-focus:bg-orange-400 data-focus:text-white data-focus:outline-hidden transition-colors duration-150"
              >
                <span className="block truncate font-medium group-data-selected:font-semibold">
                  {option.name}
                </span>

                <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-orange-400 group-not-data-selected:hidden group-data-focus:text-white">
                  <CheckIcon aria-hidden="true" className="size-5" />
                </span>
              </ListboxOption>
            ))}
          </ListboxOptions>
        </div>
      </Listbox>
    </div>
  );
} 