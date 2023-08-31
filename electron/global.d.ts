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
    history: {
        insert: (data: any) => Promise<any>,
        getList: (siteId: string) => Promise<any>,
        deleteById: (id: string) => Promise<number>,
    },
    open: (url: string) => void,
    openSaveFolder: (name: string) => Promise<any>,
    export: {
        excel: (path: string, filename: string, columns: string[], list: any) => Promise<any>
        text: (path: string, filename: string, text: string) => Promise<any>
    },
    copy: (text: string) => void,
}

declare global {
    interface Window {
        api: IElectronAPI
    }
}