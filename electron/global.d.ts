export interface IElectronAPI {
    notice: {
        show: (title: string, message: any) => Promise<boolean>
    },
    elastic: {
        insert: (data: any) => Promise<any>,
        update: (data: any) => Promise<any>,
        getAll: () => Promise<any>,
        deleteById: (id: string) => Promise<*>,
    },
}

declare global {
    interface Window {
        api: IElectronAPI
    }
}