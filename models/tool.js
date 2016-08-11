/**
 * Created by lizongyuan on 16/8/10.
 */
var Tool = {
    // 根据关键字排序
    keysort: function (key, desc) {
        return function (a, b) {
            return desc ? ~~(a[key] < b[key]) : ~~(a[key] > b[key]);
        }
    },
    getTime: function () {
        //获取当前的时间
        var date = new Date();
        return time = {
            date: date,
            year: date.getFullYear(),
            month: date.getFullYear() + "-" + (date.getMonth() + 1),
            day: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
            minute: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
        };
    }
};

module.exports = Tool;