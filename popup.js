document.addEventListener('DOMContentLoaded', async () => {
    const fillZero = (num, length) => num.toString().padStart(length, '0');
    const updateTime = () => {
        const now = new Date();
        const timeString = `当前时间: ${fillZero(now.getFullYear(), 4)}-${fillZero(now.getMonth() + 1, 2)}-${fillZero(now.getDate(), 2)} ${fillZero(now.getHours(), 2)}:${fillZero(now.getMinutes(), 2)}:${fillZero(now.getSeconds(), 2)}`;
        document.getElementById('time').textContent = timeString;
    };
    setInterval(updateTime, 100);

    const setupRadioGroup = (name, storageKey, valueTransform = id => id) => {
        const radios = document.getElementsByName(name);
        for (const radio of radios) {
            radio.addEventListener('change', () => {
                if (radio.checked) {
                    chrome.storage.local.set({ [storageKey]: valueTransform(radio.id) });
                    chrome.runtime.sendMessage({action: "storageUpdated", key: storageKey, value: valueTransform(radio.id)});
                }
            });
        }

        chrome.storage.local.get(storageKey, result => {
            const savedValue = result[storageKey];
            if (savedValue) {
                const radio = Array.from(radios).find(r => valueTransform(r.id) === savedValue);
                if (radio) radio.checked = true;
            }
        });
    };

    setupRadioGroup('time1', 'time1', id => id.slice(0, -1));
    setupRadioGroup('time2', 'time2');
    setupRadioGroup('color', 'color');

    const updateCheckboxStateFromStorage = (id, storageKey, onChangeCallback) => {
        const checkbox = document.getElementById(id);
        chrome.storage.local.get(storageKey, result => {
            const isChecked = result[storageKey] === 1;
            checkbox.checked = isChecked;
            onChangeCallback(isChecked);
        });
    };

    const updateCheckboxState = (id, storageKey, onChangeCallback) => {
        const checkbox = document.getElementById(id);
        checkbox.addEventListener('change', () => {
            const newState = checkbox.checked ? 1 : 0;
            chrome.storage.local.set({ [storageKey]: newState }, () => {
                onChangeCallback(checkbox.checked);
                chrome.runtime.sendMessage({action: "storageUpdated", key: storageKey, value: newState});
            });
        });
    };

    const restoreState = () => {
        updateCheckboxStateFromStorage('bai', 'bai', checked => {
            document.getElementById('bai-theme').textContent = checked ? "当前已显示白色字体" : "当前已显示黑色字体";
        });
        updateCheckboxStateFromStorage('badge-color', 'badge-color', checked => {
            const optionColor = document.getElementById('option-color');
            optionColor.style.display = checked ? 'block' : 'none';
            document.getElementById('badge-label-color').textContent = checked ? "已显示徽章颜色" : "已隐藏徽章颜色";
        });
        
        updateCheckboxStateFromStorage('badge', 'badge', checked => {
            document.getElementById('l-lbl').textContent = checked ? "当前已显示徽章时间" : "当前已隐藏徽章时间";
        });



        updateCheckboxStateFromStorage('timer-date', 'timer-date', checked => {
            const options = document.querySelectorAll('.options');
            for (const el of options) {
                el.style.display = checked ? 'block' : 'none';
            }            
            document.getElementById('timer-label-color').textContent = checked ? "已显示日期时间" : "已隐藏日期时间";
        });


    };

    // 首先恢复状态
    restoreState();

    // 然后设置事件监听器
    updateCheckboxState('badge', 'badge', checked => {
        document.getElementById('l-lbl').textContent = checked ? "当前已显示徽章时间" : "当前已隐藏徽章时间";
    });

    updateCheckboxState('badge-color', 'badge-color', checked => {
        const optionColor = document.getElementById('option-color');
        optionColor.style.display = checked ? 'block' : 'none';
        document.getElementById('badge-label-color').textContent = checked ? "已显示徽章颜色" : "已隐藏徽章颜色";
    });

    updateCheckboxState('timer-date', 'timer-date', checked => {
        const options = document.querySelectorAll('.options');
        for (const el of options) {
            el.style.display = checked ? 'block' : 'none';
        }
        document.getElementById('timer-label-color').textContent = checked ? "已显示日期时间" : "已隐藏日期时间";
    });

    updateCheckboxState('bai', 'bai', checked => {
        document.getElementById('bai-theme').textContent = checked ? "当前已显示白色字体" : "当前已显示黑色字体";
    });

    document.querySelector('.embed-c').addEventListener('click', () => {
        chrome.tabs.create({ url: '../donate.html' });
    });
});