export abstract class BaseStorageService<T> {
	abstract STORAGE_KEY: string;
	abstract load(): Iterable<T>;
	abstract save(items: Iterable<T>): void;
	abstract add(...data: any): void;
	abstract update(...data: any): void;
	abstract remove(id: any): void;
}
