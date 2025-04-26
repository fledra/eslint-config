export * from './configs';

export { fledra as default } from './factory';
export * from './types';

export class test {
  private a!: string;
  private b!: string;

  public foo() {
    return this.b;
  }

  public bar() {
    return this.a;
  }
}
