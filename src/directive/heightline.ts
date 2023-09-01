export const heightLine = {
    updated(el, binding) {
        const {value, arg} = binding;
        let str = ''
        if (!value || !arg) {
            el.innerHTML = arg
            return;
        }
        let array = arg.split(value);
        array.forEach((item, index) => {
            if (index < array.length - 1) {
                str = str + item + `<span class="text-height-line">${value}</span>`
            } else {
                str = str + item
            }
        })
        el.innerHTML = str
    }
};