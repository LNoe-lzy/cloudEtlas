/**
 * Created by lizongyuan on 16/8/10.
 */
var Tool = {
    // 根据关键字排序
    keysort: function (key, desc) {
        return function (a, b) {
            return desc ? ~~(a[key] < b[key]) : ~~(a[key] > b[key]);
        }
    }
};

module.exports = Tool;