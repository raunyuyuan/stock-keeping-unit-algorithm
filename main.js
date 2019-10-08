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
    {skuId: '000', price: '30', stock: '10'},
]

$(document).ready(function() {
    const $divGroup = $('.sku-group')[0]
    // $divGroup.append('<div>123</div>'
    // 生成最短路径表
    console.time('init mcl')
    let mcl = getSkuMcl(skuData)
    console.timeEnd('init mcl')
    // 获得与dom对应的数据
    const {mapDomData} = getMapDomData(skuGroups, mcl)
    // 生成最初的Dom
    let doms = initDom($divGroup, mapDomData)

    clickSku = (event) => {
        console.time('click change')
        let {idx, idx1} = event.currentTarget.dataset
        idx = Number(idx)
        idx1 = Number(idx1)
        const fatherData = mapDomData[idx]
        const currentClick = fatherData[idx1]
        const isClick = !currentClick.clicked;
        switchClick(idx, idx1, mapDomData)
        // 获得点击的值相关层级等数据
        const {clickedValues, unClickLay} = getClickValueLay(mapDomData, isClick, idx)
        switchDisabled(isClick, clickedValues, mapDomData, idx, unClickLay, currentClick, mcl)
        
        console.timeEnd('click change')
        // 刷新dom
        setDomStyle(doms, mapDomData)
    }
})