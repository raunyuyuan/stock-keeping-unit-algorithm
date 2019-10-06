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
    const {btnDisabledData, clickedBtnData} = getMapDomData(skuGroups, mcl)
    // 生成最初的Dom
    let doms = initDom($divGroup, btnDisabledData)
    clickSku = (event) => {
        const {idx, idx1} = event.currentTarget.dataset
        const fatherData = clickedBtnData[idx]
        const clickData = fatherData[idx1];
        clickData.clicked = !clickData.clicked;
        const clickedData = []
        const anotherLay = []
        

        clickedBtnData.forEach((item, lay) => {
            // 如果是取消的话，就需要将之前的组合给计算出来，
            if (!clickData.clicked) {
                item.forEach(item => {
                    if (item.clicked) clickedData.push({value: item.value, idx: lay});;
                })
            // 不是取消记录没有点过的元素
            } else if (lay !== Number(idx)) {
                anotherLay.push(lay);
            }
        })
        // 是选择的时候重新遍历所有没有选择的属性行 查找与现在的组合一起是否存在 存在为true
        const groupAttrs = [{value: clickData.value, idx: idx}]
       
        clickData.clicked && anotherLay.forEach(lay => {
            let a = [...groupAttrs]
            let addAttr = {value: '', idx: lay}
            a.push(addAttr)
            // 通过idx排序后 将其他行属性放入所在的位置
            a = a.sort((a, b) => a.idx - b.idx)
            clickedBtnData[lay].forEach((item, idx) => {
                addAttr.value = item.value
                const skuGroup = a.map(item => item.value).join('-')
                btnDisabledData[lay][idx] = !Boolean(mcl[skuGroup])
            })
        })
        // 取消的时候将已选择的组合圈出来和取消的这行进行组合 判断在不在组合内
        clickData.clicked || fatherData.forEach((item, idx1) => {
            let a = [...clickedData]
            a.push({value: item.value, idx})
            const skuGroup =  a.sort((a, b) => a.idx - b.idx).map(item => item.value).join('-')
            btnDisabledData[idx][idx1] = !Boolean(mcl[skuGroup])
        })
        // 刷新dom
        setDomStyle(doms, btnDisabledData, clickedBtnData)
    }
    // console.log($('body > div'))
})