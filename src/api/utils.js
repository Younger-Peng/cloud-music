import { RankTypes } from "./config";

export const getCount = count => {
    if (count < 0) return;
    if (count < 10000) {
        return count;
    } else if (Math.floor(count / 10000) < 10000) {
        return Math.floor(count / 1000) / 10 + '万';
    } else {
        return Math.floor(count / 10000000) / 10 + '亿'
    }
}

// export const debounce = (func, delay) => {
//     let timer;
//     return function(...args) {
//         if (timer) {
//             clearTimeout(timer)
//         }
//         timer = setTimeout(() => {
//             func.apply(this, args);
//             clearTimeout(timer);
//         }, delay);
//     }
// }

export const debounce = (fn, delay) => {
    let preTime;
    return (...args) => {
        if (preTime && Date.now() - preTime < delay) {
            preTime = Date.now();
            return;
        }
        fn.apply(this, args);
        preTime = Date.now();
    }
}

export const filterIndex = rankList => {
    for (let i=0; i<rankList.length; i++) {
        if (
            rankList[i].tracks.length &&
            !rankList[i+1].tracks.length
        ) {
            return i + 1;
        }
    }
}

//找出排行榜的编号
export const filterIdx = name => {
  for (var key in RankTypes) {
    if (RankTypes[key] === name) return key;
  }
  return null;
};

// 处理歌手列表拼接歌手名字
export const getName = list => {
  let str = "";
  list.map ((item, index) => {
    str += index === 0 ? item.name : "/" + item.name;
    return item;
  });
  return str;
};

export const isEmptyObject = obj => {
    return !obj || Object.keys(obj).length === 0;
}

let elementStyle = document.createElement('div').style;
let vendor = (() => {
    let transformNames = {
        webkit: 'webkitTransform',
        Moz: 'MozTransform',
        O: 'OTransform',
        ms: 'msTransform',
        standard: 'Transform'
    };
    for (let key in transformNames) {
        if (elementStyle[transformNames[key]] !== undefined) {
            return key;
        }
    }
    return false;
})();

export function prefixStyle(style) {
    if (vendor ===  false) {
        return false
    }
    if (vendor === 'standard') {
        return style;
    }
    return vendor + style.charAt(0).toUpperCase() + style.substr(1);
}

export const getSongUrl = id => {
    return `https://music.163.com/song/media/outer/url?id=${id}.mp3`;
};

export const getFormatTime = ms => {
    let minute = parseInt(ms / 60);
    let seconds = parseInt(ms % 60);
    seconds = seconds >= 10 ? seconds : '0' + seconds;
    return minute + ':' + seconds;
}

export function getRandomInt(min, max) {
    return Math.floor(
        Math.random() * (max - min + 1) + min
    );
}

export function shuffle(arr) {
    let new_arr = [...arr];
    for (let i=0; i<new_arr.length; i++) {
        let j = getRandomInt(0, i);
        let t = new_arr[i];
        new_arr[i] = new_arr[j];
        new_arr[j] = t;
    }
    return new_arr;
}

export const findIndex = (song, list) => {
    return list.findIndex(item => item.id === song.id);
}