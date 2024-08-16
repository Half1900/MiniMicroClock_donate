let canvas;
let ctx;
const img = new Array(10);
const imgbai = new Array(10);
let loadedImages = 0;
let badgeInterval = null;
function initCanvas() {
    canvas = new OffscreenCanvas(19, 19);
    ctx = canvas.getContext('2d', { willReadFrequently: true });
}

const fillZero = (num, length) => num.toString().padStart(length, '0');

async function drawTime(time) {
    const bai = await getStorageItem('bai') === 1;
    ctx.clearRect(0, 0, 19, 19);
    time.forEach((digit, index) => {
        const x = index % 2 * 10;
        const y = Math.floor(index / 2) * 10;
        ctx.drawImage(bai ? imgbai[digit] : img[digit], x, y, 9, 9);
    });
    
    const imageData = ctx.getImageData(0, 0, 19, 19);
    chrome.action.setIcon({ imageData: imageData });
}

async function updateTime() {
    const [time1 = 'sec', time2 = 'minute'] = await Promise.all([
        getStorageItem('time1'),
        getStorageItem('time2')
    ]);
    
    const arr_2 = [time1, time2];
    const time = new Date();
    const data = {
        hour: time.getHours(),
        minute: time.getMinutes(),
        sec: time.getSeconds(),
        month: time.getMonth() + 1,
        date: time.getDate(),
        year: time.getFullYear() % 100
    };
    const timeString = fillZero(data[time1], 2) + fillZero(data[time2], 2);
    await drawTime(timeString.split('').map(Number));
}

function checkLoad() {
    loadedImages++;
    if (loadedImages === 20) {
        //setInterval(updateTime, 1000);
        chrome.alarms.create('updateTime', { periodInMinutes: 1/600 });
        chrome.alarms.onAlarm.addListener((alarm) => {
            if (alarm.name === 'updateTime') {
              updateTime();
            }
        });
          
    }
}

async function loadImage(url) {
    const response = await fetch(url);
    const blob = await response.blob();
    return createImageBitmap(blob);
}

async function loadImages() {
    const suffixes = ['', '-w'];
    for (const suffix of suffixes) {
        const imgArray = suffix === '' ? img : imgbai;
        for (let i = 0; i < 10; i++) {
            const url = chrome.runtime.getURL(`img/${i}${suffix}.png`);
            imgArray[i] = await loadImage(url);
            checkLoad();
        }
        
        
    }
    
}

function getStorageItem(key) {
    return new Promise((resolve) => {
        chrome.storage.local.get(key, (result) => {
            resolve(result[key]);
        });
    });
}

function setStorageItem(key, value) {
    return new Promise((resolve) => {
        chrome.storage.local.set({[key]: value}, resolve);
    });
}

initCanvas();
loadImages();

chrome.runtime.onMessage.addListener((request) => {
    if (request.action === "updateTime") {
        updateTime();
    }
    if (request.action === "storageUpdated") {
        // 存储已更新，执行相应操作
        handleStorageUpdate(request.key, request.value);
    }
});
let color;
async function handleStorageUpdate(key, value) {

    switch(key) {
        case 'badge':
            value === 1 ? startBadgeUpdate() : stopBadgeUpdate();
            break;
        case 'bai':
            updateTime();
            break;
        case 'color':
            color = getColor((await getStorageItem("color")).toString());
            chrome.action.setBadgeBackgroundColor({ color: color });
        break;

    }
}
async function updateBadgeTime() {
    const now = new Date();
    now.setSeconds(0);
    const timeString = `${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}`;
    chrome.action.setBadgeText({ text: timeString });
    color = getColor((await getStorageItem("color")).toString());   
    chrome.action.setBadgeBackgroundColor({ color: color });
}

async function startBadgeUpdate() {
    if (!badgeInterval) {
        badgeInterval = setInterval(updateBadgeTime, 500); // 每分钟更新一次
    } 

}

function stopBadgeUpdate() {
    if (badgeInterval) {
        clearInterval(badgeInterval);
        badgeInterval = null;
    } 
    chrome.action.setBadgeText({ text: '' });
}

// 在插件启动或刷新时检查 badge 状态
async function checkBadgeStatus() {
    const isBadgeChecked = await getStorageItem("badge")  === 1;
    if (isBadgeChecked) {
        startBadgeUpdate();
    } else {
        stopBadgeUpdate();
    }
}

checkBadgeStatus();

// 监听存储变化
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'local' && changes.badge) {
        const newValue = changes.badge.newValue;
        if (newValue === 1) {
            startBadgeUpdate();
        } else {
            stopBadgeUpdate();
        }
    }
});

function getColor(arg) {
    let color1;
    switch (arg) {
        case "default":
            color1 = "#0091ea";
            break;

        case "green":
            color1 = "green";
            break;

        case "yellow":
            color1 = "#ff8c00";
            break;

        case "red":
            color1 = "#f00";
            break;

        case "cyan":
            color1 = "#607d8b";
            break;

        case "purple":
            color1 = "#BB33FF";
            break;

        case "brown":
            color1 = "#996633";
            break;

        case "pink":
            color1 = "#FA7296";
            break;
    }
    return color1;
}