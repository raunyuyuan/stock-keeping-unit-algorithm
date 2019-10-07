let clickSkuEvent = void(0)
// 模拟数据
const skuGroups = [
    {name: '颜色', key: 'color', list: [{value: '蓝色', id: 0}, {value: '白色', id: 1}, {value: '红色', id: 2}]},
    {name: '型号', key: 'model', list: [{value: 'A', id: 0}, {value: 'B', id: 1}, {value: 'C', id: 2}]},
    {name: '尺寸', key: 'size', list: [{value: '大', id: 0}, {value: '中', id: 1}, {value: '小', id: 2}]}
]

const skuData = [
    {skuId: '200', price: '10', stock: '20'},
    {skuId: '111', price: '20', stock: '15'},
    {skuId: '000', price: '30', stock: '10'}
]

$(document).ready(function() {
    const $divGroup = $('.sku-group')[0]
    // $divGroup.append('<div>123</div>'
    // 生成最短路径表
    let mcl = getSkuMcl(skuData)
    // 获得与dom对应的数据
    const {mapDomData} = getMapDomData(skuGroups, mcl)
    // 生成最初的Dom
    let doms = initDom($divGroup, mapDomData)

    clickSku = (event) => {
        let {idx, idx1} = event.currentTarget.dataset
        idx = Number(idx)
        idx1 = Number(idx1)
        const fatherData = mapDomData[idx]
        const currentClick = fatherData[idx1]
        const isClick = !currentClick.clicked;
        switchClick(idx, idx1, mapDomData)
        // 获得点击的值相关层级等数据
        const {clickedValues, unClickLay} = getClickValueLay(mapDomData, isClick, idx)
        // 是选择的时候重新遍历所有没有选择的属性行 查找与现在的组合一起是否存在 存在为true
        isClick && unClickLay.forEach(lay => {
            let a = [{value: currentClick.value, idx: idx}]
            let addAttr = {value: '', idx: lay}
            a.push(addAttr)
            // 通过idx排序后 将其他行属性放入所在的位置
            a = a.sort((a, b) => a.idx - b.idx)
            mapDomData[lay].forEach((item, idx) => {
                addAttr.value = item.value
                const skuGroup = a.map(item => item.value).join('-')
                item.disabled = !Boolean(mcl[skuGroup])
            })
            
        });
        // 取消的时候将已选择的组合圈出来和取消的这行进行组合 判断在不在组合内
        (!isClick && clickedValues.length != 0) && fatherData.forEach((item, idx1) => {
            let a = [...clickedValues]
            a.push({value: item.value, idx})
            const skuGroup =  a.sort((a, b) => a.idx - b.idx).map(item => item.value).join('-')
            mapDomData[idx][idx1].disabled = !Boolean(mcl[skuGroup])
        });
        // 取消全部选择
        if (clickedValues.length === 0 && !isClick) {
            mapDomData.forEach(list => {
                list.forEach(item => item.disabled = !Boolean(mcl[item.value]))
            })
        }
        // 刷新dom
        setDomStyle(doms, mapDomData)
    }
})