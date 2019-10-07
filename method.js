// 初始化sku最短路径表
const getSkuMcl = (skuData) => {
    let existSkus = {}
    skuData.forEach(item => {
        let skuGroup = item.skuId.split('')
        if (Number(item.stock) === 0) return
        let existSku = skuGroup.map((id, idx) => {
            return skuGroups[idx].list.find(item => Number(item.id) === Number(id)).value
        })
        // 求幂集 后一项依赖前一项的组合
        let ps = ['']
        existSku.forEach((skuAttr, i) => {
            ps.forEach((item1, j) => {
                const prevItem = ps[j]
                const exitKey = prevItem + (prevItem === '' ? '': '-') + skuAttr
                ps.push(exitKey)
                if (!existSkus[exitKey]) {
                    existSkus[exitKey] = [
                        item
                    ]
                } else {
                    existSkus[exitKey].push(item)
                }
                
            })
        })
    })
    return existSkus
}


// 生成对应dom的数据
function getMapDomData (skuGroups, mcl){
    const mapDomData = []
    skuGroups.forEach((item, idx) => {
        mapDomData.push([])
        item.list.forEach((item, idx1) => {
            mapDomData[idx].push({value: item.value, clicked: false, disabled: !Boolean(mcl[item.value])})
        })
    })
    return {mapDomData}
}


// 点击后重新设置dom样式
const setDomStyle = (doms, mapDomData) => {
    doms.forEach((itemList, lay) => {
        itemList.forEach((btn, btnIdx) => {
            if(mapDomData[lay][btnIdx].disabled) {
                btn.attr('disabled', 'true')
            } else {
                btn.removeAttr('disabled')
            }
            if(mapDomData[lay][btnIdx].clicked) {
                btn.addClass('clicked')
            } else {
                btn.removeClass('clicked')
            }
        })
    })
}

// 生成最初dom
const initDom = ($box, mapDomData) => {
    let doms = []
    skuGroups.forEach((item, idx) => {
        const $dom =  $(
            `<div class='attr-item'>
                ${item.name}:
            </div>`
        );
        let len = doms.push([])
        item.list.forEach((item1, idx1)=> {
            let $listItem = $(`
                <input
                    type="button"
                    class="sku"
                    ${mapDomData[idx][idx1].disabled ? 'disabled' : ''}
                    data-idx=${idx}
                    data-idx1="${idx1}"
                    value="${item1.value}"
                    onclick="clickSku(event)"
                />
            `)
            doms[len - 1].push($listItem)
            $listItem.appendTo($dom)
        })
        $dom.appendTo($box)
    })
    return doms
}


const getClickValueLay = (mapDomData, isClick, currentClickLay) => {
    const clickedValues = []
    const unClickLay = []
    mapDomData.forEach((item, lay) => {
        // 如果是取消的话，就需要将之前的组合给计算出来，
        if (!isClick) {
            item.forEach(item => {
                if (item.clicked) clickedValues.push({value: item.value, idx: lay});
            })
        // 不是取消记录没有点过的属性行
        } else if (lay !== Number(currentClickLay)) {
            unClickLay.push(lay);
        }
    })
    return {clickedValues, unClickLay}
}

const switchClick =(currentClickLay, currentClickBtnIdx, mapDomData) => {
    mapDomData[currentClickLay].forEach((item, btnIdx) => {
        if (btnIdx === currentClickBtnIdx) {
            item.clicked = !item.clicked
        } else {
            item.clicked = false
        }
    })
}