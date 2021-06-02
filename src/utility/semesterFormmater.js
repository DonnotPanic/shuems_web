const formattingSemester = (raw) => {
    let raws = raw.split('-')
    let year = Number.parseInt(raws[0])
    let prefix = String(year) + '-' + String(year + 1)
    switch (raws[1]) {
        case "Q1":
            return prefix + "年秋季学期"
        case "Q2":
            return prefix + "年冬季学期"
        case "Q3":
            return prefix + "年春季学期"
        case "Q4":
            return prefix + "年夏季学期"
        default:
            return "我也不知道啥学期"
    }
}
export default formattingSemester