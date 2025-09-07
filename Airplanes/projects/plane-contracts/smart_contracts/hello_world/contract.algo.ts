import { Contract } from '@algorandfoundation/algorand-typescript'

export class HelloWorld extends Contract {
  public hello(owner: string, shoeName: string): string {
    return `Hello, ${owner} ${shoeName}`
  }
}
