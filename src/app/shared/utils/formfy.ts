import { FormArray, FormControl, FormGroup } from '@angular/forms';

/**
 * Esse é um Helper para permitir criar um formulário de forma mais fácil a partir de um Payload.
 *
 * O uso dele é o seguinte:
 *
 * @example```typescript
 * type UserPayload = { name: string };
 * type UserForm = Formfy<UserPayload>;
 *
 * // use sempre o nonNullable.
 * const form: UserForm = formBuilder.nonNullable.group({
 *   name: ['', Validators.required],
 * });
 *
 * // caso você tenha uma propriedade de lista, ele vai transformar diretamente para objeto.
 * type UserArrayPayload = { names: string[] };
 * type UserArrayForm = Formfy<UserArrayPayload>;
 *
 * // use sempre o nonNullable.
 * const formArray: UserArrayForm = formBuilder.nonNullable.group({
 *   names: formBuilder.array<FormControl<string>>([]), // é necessário passar o parametro genérico
 * });
 *
 * // caso você queira que a lista seja um FormControl, use o segundo parametro do Formfy
 * // e passe o nome do objeto.
 * type UserArrayExcludedPayload = { names: string[] };
 * type UserArrayExcludedForm = Formfy<UserArrayExcludedPayload, 'names'>;
 *
 * // use sempre o nonNullable.
 * const formArrayExcluded: UserArrayExcludedForm = formBuilder.nonNullable.group({
 *   names: [[''] as string[], Validators.required], // é necessário fazer esse cast.
 * });
 * ```
 */
export type Formfy<T, ExcludeFromFormArray = never> = FormGroup<{
  [Key in keyof T]:
  T[Key] extends Array<infer ArrayValue>
    ? Key extends ExcludeFromFormArray
      ? FormControl<NonNullable<T[Key]>>
      : FormArray<FormControl<ArrayValue>>
    : T[Key] extends Date
      ? FormControl<T[Key]>
      : T[Key] extends object
        ? Formfy<T[Key]>
        : FormControl<T[Key]>
}>;
