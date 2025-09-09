import {
  Component,
  forwardRef,
  HostListener,
  input,
  signal
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR
} from '@angular/forms';

@Component({
  selector: 'app-select',
  imports: [],
    providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Select),
      multi: true
    }
  ],
  templateUrl: './select.html',
  styleUrl: './select.scss'
})
export class Select<T extends { label: string }> implements ControlValueAccessor {
  options = input<T[]>([]);
  placeholder = input<string>('Select an option');

  isOpen = signal<boolean>(false);
  selected = signal<T | undefined>(undefined);
  isDisabled = signal<boolean>(false);

  onChange = (_: any) => {};
  onTouched = () => {};

  writeValue(value: T | undefined): void {
    this.selected.set(value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  toggleDropdown(): void {
    if (!this.isDisabled()) {
      this.isOpen.set(!this.isOpen());
    }
  }

  selectOption(option: T): void {
    this.selected.set(option);
    this.onChange(option);
    this.onTouched();
    this.isOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  handleOutsideClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.custom-select-container')) {
      this.isOpen.set(false);
    }
  }
}



