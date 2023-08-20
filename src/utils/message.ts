import {ElMessage, ElMessageBox, MessageBoxData} from "element-plus"

export const success = (message: string) => {
    ElMessage({
        message: message,
        type: "success"
    })
}
export const error = (message: any) => {
    ElMessage({
        message: message,
        type: "error"
    })
}
export const confirm = (title: string, message: string): Promise<MessageBoxData> => {
    return ElMessageBox.confirm(message, title);
}